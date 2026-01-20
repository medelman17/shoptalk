/**
 * Document chunking utilities.
 *
 * Splits extracted documents into semantically meaningful chunks
 * suitable for embedding and retrieval.
 */

import type {
  ExtractedDocument,
  DocumentChunk,
  ChunkedDocument,
  ChunkMetadata,
  ChunkingConfig,
  SectionHeader,
  DEFAULT_CHUNKING_CONFIG,
} from "./types";
import { detectSectionHeaders, getFullText, getPageForOffset } from "./extract";

/**
 * Estimate token count using a simple word-based heuristic.
 * OpenAI's tokenizer typically produces ~1.3 tokens per word for English.
 *
 * @param text - Text to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return Math.ceil(words.length * 1.3);
}

/**
 * Split text into sentences.
 *
 * @param text - Text to split
 * @returns Array of sentences
 */
function splitSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.filter((s) => s.trim().length > 0);
}

/**
 * Generate a unique chunk ID.
 *
 * @param documentId - Document identifier
 * @param chunkIndex - Chunk index within document
 * @returns Unique chunk ID
 */
function generateChunkId(documentId: string, chunkIndex: number): string {
  return `${documentId}-chunk-${chunkIndex.toString().padStart(4, "0")}`;
}

/**
 * Find the current article/section context for a position in text.
 *
 * @param headers - Detected section headers
 * @param offset - Character offset in full text
 * @returns Current article and section
 */
function findContext(
  headers: SectionHeader[],
  offset: number,
  fullTextOffsets: Map<number, number>
): { article: string | null; section: string | null } {
  let article: string | null = null;
  let section: string | null = null;

  for (const header of headers) {
    const headerOffset = fullTextOffsets.get(header.pageNumber) ?? 0;
    const absoluteOffset = headerOffset + header.offset;

    if (absoluteOffset <= offset) {
      if (header.article) {
        article = header.article;
        // Reset section when entering new article
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
 * Chunk a document into smaller pieces for embedding.
 *
 * @param document - Extracted document
 * @param config - Chunking configuration
 * @returns Chunked document
 */
export function chunkDocument(
  document: ExtractedDocument,
  config: ChunkingConfig = {
    targetTokens: 400,
    maxTokens: 500,
    overlapTokens: 50,
    preserveArticleBoundaries: true,
  }
): ChunkedDocument {
  const fullText = getFullText(document);
  const headers = detectSectionHeaders(document.pages);
  const sentences = splitSentences(fullText);

  // Build page offset map
  const pageOffsets = new Map<number, number>();
  let currentOffset = 0;
  for (const page of document.pages) {
    pageOffsets.set(page.pageNumber, currentOffset);
    currentOffset += page.text.length + 2; // +2 for \n\n separator
  }

  const chunks: DocumentChunk[] = [];
  let chunkIndex = 0;
  let currentChunkSentences: string[] = [];
  let currentTokenCount = 0;
  let chunkStartOffset = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const sentenceTokens = estimateTokens(sentence);

    // Check if adding this sentence would exceed max tokens
    if (
      currentTokenCount + sentenceTokens > config.maxTokens &&
      currentChunkSentences.length > 0
    ) {
      // Finalize current chunk
      const chunkText = currentChunkSentences.join(" ");
      const chunkEndOffset =
        chunkStartOffset + chunkText.length;

      const pageStart = getPageForOffset(document, chunkStartOffset);
      const pageEnd = getPageForOffset(document, chunkEndOffset);
      const context = findContext(headers, chunkStartOffset, pageOffsets);

      chunks.push({
        id: generateChunkId(document.documentId, chunkIndex),
        content: chunkText,
        metadata: {
          documentId: document.documentId,
          article: context.article,
          section: context.section,
          pageStart,
          pageEnd,
          tokenCount: estimateTokens(chunkText),
          chunkIndex,
        },
      });

      chunkIndex++;

      // Start new chunk with overlap
      const overlapSentences: string[] = [];
      let overlapTokens = 0;

      // Add sentences from the end of current chunk for overlap
      for (let j = currentChunkSentences.length - 1; j >= 0; j--) {
        const overlapSentence = currentChunkSentences[j];
        const tokens = estimateTokens(overlapSentence);
        if (overlapTokens + tokens > config.overlapTokens) {
          break;
        }
        overlapSentences.unshift(overlapSentence);
        overlapTokens += tokens;
      }

      currentChunkSentences = [...overlapSentences];
      currentTokenCount = overlapTokens;
      chunkStartOffset = chunkEndOffset - overlapSentences.join(" ").length;
    }

    // Add sentence to current chunk
    currentChunkSentences.push(sentence);
    currentTokenCount += sentenceTokens;
  }

  // Finalize last chunk if there's remaining content
  if (currentChunkSentences.length > 0) {
    const chunkText = currentChunkSentences.join(" ");
    const chunkEndOffset = fullText.length;

    const pageStart = getPageForOffset(document, chunkStartOffset);
    const pageEnd = getPageForOffset(document, chunkEndOffset);
    const context = findContext(headers, chunkStartOffset, pageOffsets);

    chunks.push({
      id: generateChunkId(document.documentId, chunkIndex),
      content: chunkText,
      metadata: {
        documentId: document.documentId,
        article: context.article,
        section: context.section,
        pageStart,
        pageEnd,
        tokenCount: estimateTokens(chunkText),
        chunkIndex,
      },
    });
  }

  return {
    documentId: document.documentId,
    title: document.title,
    chunks,
    chunkedAt: new Date().toISOString(),
    config,
  };
}

/**
 * Get statistics about chunked document.
 *
 * @param chunked - Chunked document
 * @returns Statistics object
 */
export function getChunkStats(chunked: ChunkedDocument): {
  totalChunks: number;
  avgTokens: number;
  minTokens: number;
  maxTokens: number;
  articlesFound: string[];
} {
  const tokenCounts = chunked.chunks.map((c) => c.metadata.tokenCount);
  const articles = new Set<string>();

  for (const chunk of chunked.chunks) {
    if (chunk.metadata.article) {
      articles.add(chunk.metadata.article);
    }
  }

  return {
    totalChunks: chunked.chunks.length,
    avgTokens: Math.round(
      tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length
    ),
    minTokens: Math.min(...tokenCounts),
    maxTokens: Math.max(...tokenCounts),
    articlesFound: Array.from(articles).sort((a, b) => parseInt(a) - parseInt(b)),
  };
}
