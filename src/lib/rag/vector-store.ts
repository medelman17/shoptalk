/**
 * Vector store configuration using Mastra's PineconeVector.
 *
 * Provides a configured Pinecone client for contract document embeddings.
 */

import { PineconeVector } from "@mastra/pinecone";
import type { ProcessedChunk, ContractChunkMetadata } from "./processor";

/**
 * Vector store configuration.
 */
export const VECTOR_CONFIG = {
  indexName: process.env.PINECONE_INDEX_NAME ?? "shoptalk-contracts",
  dimension: 3072, // text-embedding-3-large
  metric: "cosine" as const,
};

/**
 * PineconeVector client singleton.
 */
let vectorStore: PineconeVector | null = null;

/**
 * Get the Pinecone vector store instance.
 *
 * @returns PineconeVector client
 * @throws Error if PINECONE_API_KEY is not set
 */
export function getVectorStore(): PineconeVector {
  if (vectorStore) {
    return vectorStore;
  }

  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error("PINECONE_API_KEY environment variable is not set");
  }

  vectorStore = new PineconeVector({
    id: "shoptalk-pinecone",
    apiKey,
    cloud: "aws",
    region: "us-east-1",
  });

  return vectorStore;
}

/**
 * Ensure the contracts index exists.
 *
 * @returns True if index was created, false if already existed
 */
export async function ensureIndex(): Promise<boolean> {
  const store = getVectorStore();
  const indexes = await store.listIndexes();

  if (indexes.includes(VECTOR_CONFIG.indexName)) {
    console.log(`Index "${VECTOR_CONFIG.indexName}" already exists`);
    return false;
  }

  console.log(`Creating index "${VECTOR_CONFIG.indexName}"...`);
  await store.createIndex({
    indexName: VECTOR_CONFIG.indexName,
    dimension: VECTOR_CONFIG.dimension,
    metric: VECTOR_CONFIG.metric,
  });

  console.log(`Index "${VECTOR_CONFIG.indexName}" created`);
  return true;
}

/**
 * Upsert chunks with their embeddings to Pinecone.
 *
 * @param chunks - Processed chunks
 * @param embeddings - Embedding vectors (must match chunks order)
 * @param documentId - Optional document ID to delete existing vectors first
 */
export async function upsertChunks(
  chunks: ProcessedChunk[],
  embeddings: number[][],
  documentId?: string
): Promise<void> {
  if (chunks.length !== embeddings.length) {
    throw new Error(
      `Chunk count (${chunks.length}) doesn't match embedding count (${embeddings.length})`
    );
  }

  const store = getVectorStore();

  // Use deleteFilter to replace existing chunks atomically
  await store.upsert({
    indexName: VECTOR_CONFIG.indexName,
    vectors: embeddings,
    metadata: chunks.map((chunk) => chunk.metadata),
    ids: chunks.map((chunk) => chunk.id),
    ...(documentId && { deleteFilter: { documentId: { $eq: documentId } } }),
  });
}

/**
 * Query for similar chunks.
 *
 * @param queryVector - Query embedding vector
 * @param options - Query options
 * @returns Similar chunks with scores
 */
export async function querySimilar(
  queryVector: number[],
  options: {
    topK?: number;
    documentIds?: string[];
  } = {}
): Promise<
  Array<{
    id: string;
    score: number;
    metadata: ContractChunkMetadata;
  }>
> {
  const store = getVectorStore();
  const { topK = 10, documentIds } = options;

  // Build filter if document IDs provided
  const filter = documentIds?.length
    ? { documentId: { $in: documentIds } }
    : undefined;

  const results = await store.query({
    indexName: VECTOR_CONFIG.indexName,
    queryVector,
    topK,
    filter,
  });

  return results.map((r) => ({
    id: r.id,
    score: r.score,
    metadata: r.metadata as ContractChunkMetadata,
  }));
}

/**
 * Delete all vectors for a document.
 *
 * Note: For re-indexing, prefer using upsertChunks with documentId parameter
 * which uses deleteFilter for atomic replace operations.
 *
 * @param documentId - Document ID to delete
 */
export async function deleteDocumentChunks(documentId: string): Promise<void> {
  const store = getVectorStore();

  await store.deleteVectors({
    indexName: VECTOR_CONFIG.indexName,
    filter: { documentId: { $eq: documentId } },
  });
}

/**
 * Get index statistics.
 */
export async function getIndexStats(): Promise<{
  dimension: number;
  count: number;
  metric: string;
}> {
  const store = getVectorStore();
  const stats = await store.describeIndex({ indexName: VECTOR_CONFIG.indexName });
  return {
    dimension: stats.dimension ?? 0,
    count: stats.count ?? 0,
    metric: stats.metric ?? "cosine",
  };
}
