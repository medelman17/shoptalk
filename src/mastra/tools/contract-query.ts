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
import { querySimilar } from "@/lib/rag/vector-store";
import type { ContractChunkMetadata } from "@/lib/rag/processor";

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
 */
async function embedQuery(query: string): Promise<number[]> {
  const model = gateway.embeddingModel("openai/text-embedding-3-large");
  const result = await model.doEmbed({ values: [query] });
  return result.embeddings[0];
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
    // Extract document scope from request context
    // RequestContext uses a Map-like interface with get/set methods
    const requestContext = context?.requestContext;
    const documentIds = requestContext?.get("documentIds") as string[] | undefined;

    if (!documentIds || documentIds.length === 0) {
      console.warn("No document scope provided in requestContext, defaulting to master only");
    }

    // Generate embedding for the query
    const queryVector = await embedQuery(query);

    // Query Pinecone with scope filtering
    const results = await querySimilar(queryVector, {
      topK,
      documentIds: documentIds?.length ? documentIds : ["master"],
    });

    // Transform results for agent consumption
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

    return {
      results: formattedResults,
      query,
      totalResults: formattedResults.length,
    };
  },
});

/**
 * Type helper for the contract query tool.
 */
export type ContractQueryTool = typeof contractQueryTool;
