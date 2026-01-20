/**
 * Contract query tool for semantic search over UPS Teamster contracts.
 *
 * This tool queries the Pinecone vector store with scope filtering based on
 * the user's Local union number. The document scope is passed via requestContext
 * to ensure users can only access documents applicable to their situation.
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { gateway } from "ai";
import { querySimilar, getVectorStore, VECTOR_CONFIG } from "@/lib/rag/vector-store";
import type { ContractChunkMetadata } from "@/lib/rag/processor";

/**
 * Structured logging for contract query operations.
 */
function logContractQuery(
  level: "info" | "warn" | "error",
  step: string,
  data: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const prefix = `[ContractQuery:${step}]`;
  const message = { timestamp, ...data };

  if (level === "error") {
    console.error(prefix, JSON.stringify(message));
  } else if (level === "warn") {
    console.warn(prefix, JSON.stringify(message));
  } else {
    console.log(prefix, JSON.stringify(message));
  }
}

/**
 * Check required environment variables and return status.
 */
function checkEnvironment(): { valid: boolean; missing: string[] } {
  const required = [
    { name: "PINECONE_API_KEY", value: process.env.PINECONE_API_KEY },
    { name: "VERCEL_AI_GATEWAY_KEY", value: process.env.VERCEL_AI_GATEWAY_KEY },
  ];

  const missing = required
    .filter(({ value }) => !value)
    .map(({ name }) => name);

  return { valid: missing.length === 0, missing };
}

/**
 * Result from a contract query.
 */
export interface ContractQueryResult {
  /** Relevant text chunk */
  text: string;
  /** Source document ID */
  documentId: string;
  /** Document title */
  documentTitle: string;
  /** Article number (if detected) */
  article: string;
  /** Section number (if detected) */
  section: string;
  /** Starting page number */
  pageStart: number;
  /** Ending page number */
  pageEnd: number;
  /** Similarity score (0-1) */
  score: number;
}

/**
 * Generate embedding for a query using the Vercel AI Gateway.
 *
 * @throws Error with detailed message if embedding fails
 */
async function embedQuery(query: string): Promise<number[]> {
  const startTime = Date.now();

  logContractQuery("info", "embed-start", {
    queryLength: query.length,
    model: "openai/text-embedding-3-large",
  });

  try {
    const model = gateway.embeddingModel("openai/text-embedding-3-large");
    const result = await model.doEmbed({ values: [query] });

    const duration = Date.now() - startTime;
    logContractQuery("info", "embed-success", {
      duration,
      embeddingDimension: result.embeddings[0]?.length ?? 0,
    });

    if (!result.embeddings[0] || result.embeddings[0].length === 0) {
      throw new Error("Embedding result was empty");
    }

    return result.embeddings[0];
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logContractQuery("error", "embed-failed", {
      duration,
      error: errorMessage,
      stack: errorStack,
      gatewayKeyPresent: !!process.env.VERCEL_AI_GATEWAY_KEY,
    });

    throw new Error(`Embedding generation failed: ${errorMessage}`);
  }
}

/**
 * Contract query tool for searching UPS Teamster contract documents.
 *
 * The tool receives document scope via requestContext.documentIds, ensuring
 * users can only search documents applicable to their Local union.
 */
export const contractQueryTool = createTool({
  id: "contract-query",
  description: `Search UPS Teamster contract documents to find relevant sections about wages, benefits, working conditions, grievance procedures, overtime, seniority, vacations, holidays, and other union contract topics. Returns the most relevant contract text chunks with their source document, article, section, and page numbers. Use this tool whenever you need to answer questions about the contract.`,
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The search query to find relevant contract sections. Be specific and use contract terminology when possible."
      ),
    topK: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe("Number of relevant sections to return (1-10, default 5)"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        text: z.string(),
        documentId: z.string(),
        documentTitle: z.string(),
        article: z.string(),
        section: z.string(),
        pageStart: z.number(),
        pageEnd: z.number(),
        score: z.number(),
      })
    ),
    query: z.string(),
    totalResults: z.number(),
  }),
  execute: async ({ query, topK = 5 }, context) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    logContractQuery("info", "execute-start", {
      requestId,
      query: query.substring(0, 100), // Truncate for logging
      topK,
    });

    // Step 1: Check environment variables
    const envCheck = checkEnvironment();
    if (!envCheck.valid) {
      logContractQuery("error", "env-check-failed", {
        requestId,
        missing: envCheck.missing,
      });
      throw new Error(
        `Missing required environment variables: ${envCheck.missing.join(", ")}`
      );
    }

    // Step 2: Extract document scope from request context
    const requestContext = context?.requestContext;
    const documentIds = requestContext?.get("documentIds") as string[] | undefined;

    if (!documentIds || documentIds.length === 0) {
      logContractQuery("warn", "no-document-scope", {
        requestId,
        defaultScope: ["master"],
      });
    } else {
      logContractQuery("info", "document-scope", {
        requestId,
        documentIds,
      });
    }

    const effectiveDocumentIds = documentIds?.length ? documentIds : ["master"];

    try {
      // Step 3: Verify Pinecone connection
      logContractQuery("info", "pinecone-check-start", {
        requestId,
        indexName: VECTOR_CONFIG.indexName,
      });

      try {
        const store = getVectorStore();
        const indexes = await store.listIndexes();

        if (!indexes.includes(VECTOR_CONFIG.indexName)) {
          logContractQuery("error", "index-not-found", {
            requestId,
            indexName: VECTOR_CONFIG.indexName,
            availableIndexes: indexes,
          });
          throw new Error(
            `Pinecone index "${VECTOR_CONFIG.indexName}" not found. Available: ${indexes.join(", ") || "none"}`
          );
        }

        logContractQuery("info", "pinecone-check-success", {
          requestId,
          indexName: VECTOR_CONFIG.indexName,
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes("not found")) {
          throw error; // Re-throw index not found error
        }
        const errorMessage = error instanceof Error ? error.message : String(error);
        logContractQuery("error", "pinecone-connection-failed", {
          requestId,
          error: errorMessage,
        });
        throw new Error(`Failed to connect to Pinecone: ${errorMessage}`);
      }

      // Step 4: Generate embedding for the query
      const queryVector = await embedQuery(query);

      // Step 5: Query Pinecone with scope filtering
      logContractQuery("info", "query-start", {
        requestId,
        topK,
        documentIds: effectiveDocumentIds,
      });

      const queryStartTime = Date.now();
      const results = await querySimilar(queryVector, {
        topK,
        documentIds: effectiveDocumentIds,
      });

      logContractQuery("info", "query-success", {
        requestId,
        duration: Date.now() - queryStartTime,
        resultCount: results.length,
        topScores: results.slice(0, 3).map((r) => r.score.toFixed(3)),
      });

      // Step 6: Transform results for agent consumption
      const formattedResults: ContractQueryResult[] = results.map((result) => {
        const metadata = result.metadata as ContractChunkMetadata;
        return {
          text: metadata.text || "",
          documentId: metadata.documentId,
          documentTitle: metadata.documentTitle,
          article: metadata.article || "",
          section: metadata.section || "",
          pageStart: metadata.pageStart,
          pageEnd: metadata.pageEnd,
          score: result.score,
        };
      });

      const totalDuration = Date.now() - startTime;
      logContractQuery("info", "execute-complete", {
        requestId,
        totalDuration,
        resultCount: formattedResults.length,
      });

      return {
        results: formattedResults,
        query,
        totalResults: formattedResults.length,
      };
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      logContractQuery("error", "execute-failed", {
        requestId,
        totalDuration,
        error: errorMessage,
        stack: errorStack,
      });

      // Re-throw with context for agent to handle gracefully
      throw new Error(`Contract query failed: ${errorMessage}`);
    }
  },
});

/**
 * Type helper for the contract query tool.
 */
export type ContractQueryTool = typeof contractQueryTool;
