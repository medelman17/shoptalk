#!/usr/bin/env tsx
/**
 * Contract Ingestion Script using Mastra RAG
 *
 * Extracts text from PDFs, chunks using Mastra, generates embeddings,
 * and stores in Pinecone.
 *
 * Usage:
 *   pnpm tsx scripts/ingest-contracts.ts                    # Process all documents
 *   pnpm tsx scripts/ingest-contracts.ts --id master        # Process single document
 *   pnpm tsx scripts/ingest-contracts.ts --list             # List available documents
 *   pnpm tsx scripts/ingest-contracts.ts --setup            # Create Pinecone index
 *   pnpm tsx scripts/ingest-contracts.ts --stats            # Show index stats
 *
 * Required environment variables:
 *   OPENAI_API_KEY          - OpenAI API key for embeddings
 *   PINECONE_API_KEY        - Pinecone API key
 *   PINECONE_INDEX_NAME     - Pinecone index name (default: shoptalk-contracts)
 */

import { existsSync } from "fs";
import { join } from "path";
import { embedMany, gateway } from "ai";
import { extractPdf } from "../src/lib/documents/extract";
import { DOCUMENT_MANIFEST, type RawDocument } from "../src/lib/documents/manifest";
import { processDocument, getProcessingStats } from "../src/lib/rag/processor";
import {
  ensureIndex,
  upsertChunks,
  getIndexStats,
  VECTOR_CONFIG,
} from "../src/lib/rag/vector-store";

const ROOT_DIR = process.cwd();

/**
 * Parse command line arguments.
 */
function parseArgs(): {
  id?: string;
  list?: boolean;
  setup?: boolean;
  stats?: boolean;
} {
  const args = process.argv.slice(2);
  const result: {
    id?: string;
    list?: boolean;
    setup?: boolean;
    stats?: boolean;
  } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--id" && args[i + 1]) {
      result.id = args[i + 1];
      i++;
    } else if (args[i] === "--list") {
      result.list = true;
    } else if (args[i] === "--setup") {
      result.setup = true;
    } else if (args[i] === "--stats") {
      result.stats = true;
    }
  }

  return result;
}

/**
 * List available documents.
 */
function listDocuments(): void {
  console.log("\nAvailable contract documents:\n");

  const byType: Record<string, RawDocument[]> = {};
  for (const doc of DOCUMENT_MANIFEST) {
    if (!byType[doc.type]) {
      byType[doc.type] = [];
    }
    byType[doc.type].push(doc);
  }

  for (const [type, docs] of Object.entries(byType)) {
    console.log(`${type.toUpperCase()}:`);
    for (const doc of docs) {
      const exists = existsSync(join(ROOT_DIR, doc.filePath));
      const status = exists ? "✓" : "✗";
      console.log(`  ${status} ${doc.id.padEnd(30)} ${doc.shortTitle}`);
    }
    console.log();
  }

  console.log(`Total: ${DOCUMENT_MANIFEST.length} documents`);
}

/**
 * Show Pinecone index statistics.
 */
async function showStats(): Promise<void> {
  console.log("\nPinecone index statistics:\n");

  try {
    const stats = await getIndexStats();
    console.log(`  Index: ${VECTOR_CONFIG.indexName}`);
    console.log(`  Vectors: ${stats.count.toLocaleString()}`);
    console.log(`  Dimension: ${stats.dimension}`);
    console.log(`  Metric: ${stats.metric}`);
  } catch (error) {
    console.error(`  Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Process a single document end-to-end.
 */
async function ingestDocument(doc: RawDocument): Promise<number> {
  const filePath = join(ROOT_DIR, doc.filePath);

  if (!existsSync(filePath)) {
    console.error(`  File not found: ${doc.filePath}`);
    return 0;
  }

  console.log(`\n  Processing: ${doc.shortTitle}`);

  // Step 1: Extract text from PDF
  console.log(`    Extracting PDF...`);
  const extracted = await extractPdf(filePath, doc.id, doc.title);
  console.log(`    Pages: ${extracted.pageCount}`);

  // Step 2: Chunk using Mastra
  console.log(`    Chunking...`);
  const chunks = await processDocument(extracted, {
    maxSize: 1500, // ~375 tokens
    overlap: 200, // ~50 tokens
  });
  const stats = getProcessingStats(chunks);
  console.log(`    Chunks: ${stats.totalChunks} (avg ${stats.avgTokens} tokens)`);

  // Step 3: Generate embeddings via Vercel AI Gateway
  console.log(`    Generating embeddings...`);
  const { embeddings } = await embedMany({
    model: gateway.embeddingModel("openai/text-embedding-3-large"),
    values: chunks.map((c) => c.content),
  });
  console.log(`    Embeddings: ${embeddings.length}`);

  // Step 4: Upsert to Pinecone (with deleteFilter for re-indexing)
  console.log(`    Upserting to Pinecone...`);
  await upsertChunks(chunks, embeddings, doc.id);

  console.log(`    Done: ${chunks.length} vectors`);
  return chunks.length;
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  const args = parseArgs();

  console.log("\n=== Contract Ingestion (Mastra RAG) ===");
  console.log(`Model: openai/text-embedding-3-large (${VECTOR_CONFIG.dimension} dimensions)`);

  if (args.list) {
    listDocuments();
    return;
  }

  if (args.stats) {
    await showStats();
    return;
  }

  if (args.setup) {
    console.log("\nSetting up Pinecone index...");
    await ensureIndex();
    return;
  }

  // Get documents to process
  let documents = DOCUMENT_MANIFEST;
  if (args.id) {
    const doc = documents.find((d) => d.id === args.id);
    if (!doc) {
      console.error(`\nDocument not found: ${args.id}`);
      console.log("Use --list to see available documents");
      process.exit(1);
    }
    documents = [doc];
  }

  console.log(`\nProcessing ${documents.length} document(s)...\n`);

  // Process documents
  let totalVectors = 0;
  let success = 0;
  let failed = 0;

  for (const doc of documents) {
    try {
      const vectors = await ingestDocument(doc);
      if (vectors > 0) {
        totalVectors += vectors;
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`  Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      failed++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`  Documents: ${success} succeeded, ${failed} failed`);
  console.log(`  Total vectors: ${totalVectors.toLocaleString()}`);

  // Show final stats
  try {
    const stats = await getIndexStats();
    console.log(`  Index total: ${stats.count.toLocaleString()} vectors\n`);
  } catch {
    // Ignore stats error
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
