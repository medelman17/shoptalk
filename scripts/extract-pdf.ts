#!/usr/bin/env tsx
/**
 * PDF Extraction CLI Script
 *
 * Extracts text from contract PDF files and outputs structured JSON.
 *
 * Usage:
 *   pnpm tsx scripts/extract-pdf.ts                    # Extract all documents
 *   pnpm tsx scripts/extract-pdf.ts --id master        # Extract single document
 *   pnpm tsx scripts/extract-pdf.ts --list             # List available documents
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { extractPdf } from "../src/lib/documents/extract";
import { DOCUMENT_MANIFEST, type RawDocument } from "../src/lib/documents/manifest";
import type { ExtractedDocument } from "../src/lib/documents/types";

const OUTPUT_DIR = "data/extracted";
const ROOT_DIR = process.cwd();

/**
 * Parse command line arguments.
 */
function parseArgs(): { id?: string; list?: boolean } {
  const args = process.argv.slice(2);
  const result: { id?: string; list?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--id" && args[i + 1]) {
      result.id = args[i + 1];
      i++;
    } else if (args[i] === "--list") {
      result.list = true;
    }
  }

  return result;
}

/**
 * Ensure output directory exists.
 */
function ensureOutputDir(): void {
  const dir = join(ROOT_DIR, OUTPUT_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Extract a single document.
 */
async function extractDocument(doc: RawDocument): Promise<ExtractedDocument | null> {
  const filePath = join(ROOT_DIR, doc.filePath);

  if (!existsSync(filePath)) {
    console.error(`  File not found: ${doc.filePath}`);
    return null;
  }

  console.log(`  Extracting: ${doc.shortTitle}...`);

  try {
    const extracted = await extractPdf(filePath, doc.id, doc.title);
    console.log(`    Pages: ${extracted.pageCount}`);
    return extracted;
  } catch (error) {
    console.error(`    Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}

/**
 * Save extracted document to JSON.
 */
function saveExtracted(extracted: ExtractedDocument): void {
  const outputPath = join(ROOT_DIR, OUTPUT_DIR, `${extracted.documentId}.json`);
  writeFileSync(outputPath, JSON.stringify(extracted, null, 2));
  console.log(`    Saved: ${OUTPUT_DIR}/${extracted.documentId}.json`);
}

/**
 * List all available documents.
 */
function listDocuments(): void {
  console.log("\nAvailable documents:\n");

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
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  const args = parseArgs();

  console.log("\n=== PDF Extraction ===\n");

  if (args.list) {
    listDocuments();
    return;
  }

  ensureOutputDir();

  // Filter documents to process
  let documents = DOCUMENT_MANIFEST;
  if (args.id) {
    const doc = documents.find((d) => d.id === args.id);
    if (!doc) {
      console.error(`Document not found: ${args.id}`);
      console.log("\nUse --list to see available documents");
      process.exit(1);
    }
    documents = [doc];
  }

  // Process documents
  let success = 0;
  let failed = 0;

  for (const doc of documents) {
    const extracted = await extractDocument(doc);
    if (extracted) {
      saveExtracted(extracted);
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`  Success: ${success}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Output: ${OUTPUT_DIR}/\n`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
