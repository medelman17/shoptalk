/**
 * RAG tools for AI agents.
 *
 * Provides vector query tool for contract document retrieval.
 */

import { createVectorQueryTool, PINECONE_PROMPT } from "@mastra/rag";
import { gateway } from "ai";
import { VECTOR_CONFIG, getVectorStore } from "./vector-store";

/**
 * Pinecone filter prompt for agent instructions.
 * Include this in agent instructions to enable metadata filtering.
 */
export { PINECONE_PROMPT };

/**
 * Create a contract query tool for agents.
 *
 * This tool allows agents to search contract documents using semantic similarity.
 * Supports filtering by document ID (for user's applicable contracts).
 *
 * @returns Vector query tool
 */
export function createContractQueryTool() {
  // Ensure vector store is initialized
  getVectorStore();

  return createVectorQueryTool({
    vectorStoreName: "shoptalk-pinecone",
    indexName: VECTOR_CONFIG.indexName,
    model: gateway.embeddingModel("openai/text-embedding-3-large"),
    description: `Search UPS Teamster contract documents to find relevant sections about wages, benefits, working conditions, grievance procedures, and other union contract topics. Returns the most relevant contract text chunks with their source document and page numbers.`,
  });
}

/**
 * Agent instructions for contract RAG.
 *
 * Include this in your agent's system prompt for optimal RAG performance.
 */
export const CONTRACT_RAG_INSTRUCTIONS = `
## Contract Document Retrieval

When users ask questions about their UPS Teamster contract:

1. Use the contract query tool to search for relevant information
2. Always cite the source document and page numbers in your response
3. If the user has specified their Local union, filter results to their applicable documents
4. For complex questions, make multiple queries with different phrasings
5. If no relevant results are found, acknowledge this and suggest rephrasing

Contract documents include:
- National Master Agreement (applies to all workers)
- Regional Supplements (Western, Central, Southern, Atlantic, Eastern)
- Local Agreements (specific to each Local union)
- Riders (additional regional/local provisions)

${PINECONE_PROMPT}
`;
