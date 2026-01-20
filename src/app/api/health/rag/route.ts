/**
 * RAG system health check endpoint.
 *
 * Verifies that the vector store and embedding services are operational.
 * Useful for diagnosing production issues without making full queries.
 */

import { NextResponse } from "next/server";
import { gateway } from "ai";
import { getVectorStore, VECTOR_CONFIG, getIndexStats } from "@/lib/rag/vector-store";

interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    environment: {
      status: "pass" | "fail";
      details: {
        pineconeApiKey: boolean;
        vercelAiGatewayKey: boolean;
        pineconeIndexName: string;
      };
    };
    pinecone: {
      status: "pass" | "fail";
      latencyMs?: number;
      error?: string;
      details?: {
        indexExists: boolean;
        vectorCount: number;
        dimension: number;
      };
    };
    embedding: {
      status: "pass" | "fail";
      latencyMs?: number;
      error?: string;
      details?: {
        model: string;
        dimension: number;
      };
    };
  };
}

export async function GET(): Promise<NextResponse<HealthCheckResult>> {
  const timestamp = new Date().toISOString();

  // Check environment variables
  const envCheck = {
    status: "pass" as "pass" | "fail",
    details: {
      pineconeApiKey: !!process.env.PINECONE_API_KEY,
      vercelAiGatewayKey: !!process.env.VERCEL_AI_GATEWAY_KEY,
      pineconeIndexName: VECTOR_CONFIG.indexName,
    },
  };

  if (!envCheck.details.pineconeApiKey || !envCheck.details.vercelAiGatewayKey) {
    envCheck.status = "fail";
  }

  // Check Pinecone connection
  const pineconeCheck: HealthCheckResult["checks"]["pinecone"] = {
    status: "fail",
  };

  if (envCheck.details.pineconeApiKey) {
    const pineconeStart = Date.now();
    try {
      const store = getVectorStore();
      const indexes = await store.listIndexes();
      const indexExists = indexes.includes(VECTOR_CONFIG.indexName);

      let stats = { count: 0, dimension: 0 };
      if (indexExists) {
        stats = await getIndexStats();
      }

      pineconeCheck.status = indexExists ? "pass" : "fail";
      pineconeCheck.latencyMs = Date.now() - pineconeStart;
      pineconeCheck.details = {
        indexExists,
        vectorCount: stats.count,
        dimension: stats.dimension,
      };

      if (!indexExists) {
        pineconeCheck.error = `Index "${VECTOR_CONFIG.indexName}" not found. Available: ${indexes.join(", ") || "none"}`;
      }
    } catch (error) {
      pineconeCheck.status = "fail";
      pineconeCheck.latencyMs = Date.now() - pineconeStart;
      pineconeCheck.error = error instanceof Error ? error.message : String(error);
    }
  } else {
    pineconeCheck.error = "PINECONE_API_KEY not configured";
  }

  // Check embedding service
  const embeddingCheck: HealthCheckResult["checks"]["embedding"] = {
    status: "fail",
  };

  if (envCheck.details.vercelAiGatewayKey) {
    const embedStart = Date.now();
    try {
      const model = gateway.embeddingModel("openai/text-embedding-3-large");
      const result = await model.doEmbed({ values: ["health check test"] });

      embeddingCheck.status = "pass";
      embeddingCheck.latencyMs = Date.now() - embedStart;
      embeddingCheck.details = {
        model: "openai/text-embedding-3-large",
        dimension: result.embeddings[0]?.length ?? 0,
      };
    } catch (error) {
      embeddingCheck.status = "fail";
      embeddingCheck.latencyMs = Date.now() - embedStart;
      embeddingCheck.error = error instanceof Error ? error.message : String(error);
    }
  } else {
    embeddingCheck.error = "VERCEL_AI_GATEWAY_KEY not configured";
  }

  // Determine overall status
  const allPassed =
    envCheck.status === "pass" &&
    pineconeCheck.status === "pass" &&
    embeddingCheck.status === "pass";

  const somePassed =
    pineconeCheck.status === "pass" || embeddingCheck.status === "pass";

  const overallStatus: HealthCheckResult["status"] = allPassed
    ? "healthy"
    : somePassed
      ? "degraded"
      : "unhealthy";

  const result: HealthCheckResult = {
    status: overallStatus,
    timestamp,
    checks: {
      environment: envCheck,
      pinecone: pineconeCheck,
      embedding: embeddingCheck,
    },
  };

  // Return appropriate HTTP status code
  const httpStatus = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 207 : 503;

  return NextResponse.json(result, { status: httpStatus });
}
