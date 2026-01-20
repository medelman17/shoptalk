/**
 * Document processor using Mastra's RAG utilities.
 *
 * Combines PDF text extraction with Mastra's chunking strategies,
 * while preserving contract-specific metadata (article, section, page numbers).
 */

import { MDocument } from "@mastra/rag";
import type { ExtractedDocument } from "@/lib/documents/types";
import { getFullText, getPageForOffset, detectSectionHeaders } from "@/lib/documents/extract";

/**
 * Chunk metadata for contract documents.
 */
export interface ContractChunkMetadata {
  /** Source document ID */
  documentId: string;
  /** Document title */
  documentTitle: string;
  /** Article number (e.g., "6" for Article 6), empty string if not detected */
  article: string;
  /** Section number (e.g., "2" or "2.1"), empty string if not detected */
  section: string;
  /** Starting page number */
  pageStart: number;
  /** Ending page number */
  pageEnd: number;
  /** Estimated token count */
  tokenCount: number;
  /** Chunk index within document */
  chunkIndex: number;
  /** The chunk text content (stored for retrieval display) */
  text: string;
}

/**
 * Processed chunk ready for embedding.
 */
export interface ProcessedChunk {
  /** Unique chunk identifier */
  id: string;
  /** Chunk text content */
  content: string;
  /** Chunk metadata */
  metadata: ContractChunkMetadata;
}

/**
 * Chunking configuration options.
 */
export interface ChunkingOptions {
  /** Target chunk size in characters */
  maxSize?: number;
  /** Overlap between chunks in characters */
  overlap?: number;
}

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  maxSize: 1500, // ~375 tokens at 4 chars/token
  overlap: 200, // ~50 tokens overlap
};

/**
 * Estimate token count from text.
 * Uses ~4 characters per token as approximation for English.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Generate unique chunk ID.
 */
function generateChunkId(documentId: string, index: number): string {
  return `${documentId}-chunk-${index.toString().padStart(4, "0")}`;
}

/**
 * Find article/section context for a position in the full text.
 */
function findArticleSectionContext(
  headers: ReturnType<typeof detectSectionHeaders>,
  charOffset: number,
  document: ExtractedDocument
): { article: string | null; section: string | null } {
  let article: string | null = null;
  let section: string | null = null;

  // Build cumulative page offsets
  const pageOffsets = new Map<number, number>();
  let offset = 0;
  for (const page of document.pages) {
    pageOffsets.set(page.pageNumber, offset);
    offset += page.text.length + 2; // +2 for \n\n separator
  }

  for (const header of headers) {
    const headerPageOffset = pageOffsets.get(header.pageNumber) ?? 0;
    const absoluteOffset = headerPageOffset + header.offset;

    if (absoluteOffset <= charOffset) {
      if (header.article) {
        article = header.article;
        if (!header.section) {
          section = null;
        }
      }
      if (header.section) {
        section = header.section;
      }
    }
  }

  return { article, section };
}

/**
 * Process an extracted PDF document using Mastra's chunking.
 *
 * @param document - Extracted PDF document
 * @param options - Chunking options
 * @returns Processed chunks with contract-specific metadata
 */
export async function processDocument(
  document: ExtractedDocument,
  options: ChunkingOptions = DEFAULT_OPTIONS
): Promise<ProcessedChunk[]> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Get full text and headers for context extraction
  const fullText = getFullText(document);
  const headers = detectSectionHeaders(document.pages);

  // Create Mastra document and chunk it
  const doc = MDocument.fromText(fullText);
  const mastraChunks = await doc.chunk({
    strategy: "recursive",
    maxSize: mergedOptions.maxSize ?? 1500,
    overlap: mergedOptions.overlap ?? 200,
  });

  // Enrich chunks with contract-specific metadata
  const processedChunks: ProcessedChunk[] = [];
  let charOffset = 0;

  for (let i = 0; i < mastraChunks.length; i++) {
    const chunk = mastraChunks[i];
    const chunkText = chunk.text;

    // Find this chunk's position in the full text
    const chunkStart = fullText.indexOf(chunkText, charOffset);
    const chunkEnd = chunkStart + chunkText.length;

    // Get page numbers
    const pageStart = getPageForOffset(document, chunkStart);
    const pageEnd = getPageForOffset(document, chunkEnd);

    // Get article/section context
    const context = findArticleSectionContext(headers, chunkStart, document);

    processedChunks.push({
      id: generateChunkId(document.documentId, i),
      content: chunkText,
      metadata: {
        documentId: document.documentId,
        documentTitle: document.title,
        // Pinecone doesn't accept null values - use empty string as fallback
        article: context.article ?? "",
        section: context.section ?? "",
        pageStart,
        pageEnd,
        tokenCount: estimateTokens(chunkText),
        chunkIndex: i,
        text: chunkText.slice(0, 1000), // Truncated for Pinecone metadata
      },
    });

    // Move offset forward (with some backtrack for overlap)
    charOffset = Math.max(0, chunkStart);
  }

  return processedChunks;
}

/**
 * Get processing statistics for chunks.
 */
export function getProcessingStats(chunks: ProcessedChunk[]): {
  totalChunks: number;
  avgTokens: number;
  minTokens: number;
  maxTokens: number;
  totalTokens: number;
  articlesFound: string[];
} {
  const tokenCounts = chunks.map((c) => c.metadata.tokenCount);
  const articles = new Set<string>();

  for (const chunk of chunks) {
    if (chunk.metadata.article) {
      articles.add(chunk.metadata.article);
    }
  }

  const totalTokens = tokenCounts.reduce((a, b) => a + b, 0);

  return {
    totalChunks: chunks.length,
    avgTokens: chunks.length > 0 ? Math.round(totalTokens / chunks.length) : 0,
    minTokens: chunks.length > 0 ? Math.min(...tokenCounts) : 0,
    maxTokens: chunks.length > 0 ? Math.max(...tokenCounts) : 0,
    totalTokens,
    articlesFound: Array.from(articles).sort((a, b) => parseInt(a) - parseInt(b)),
  };
}
