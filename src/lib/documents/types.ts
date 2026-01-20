/**
 * Type definitions for document processing pipeline.
 *
 * This module defines interfaces for:
 * - Raw PDF documents
 * - Extracted text with page boundaries
 * - Chunked content with metadata
 * - Document storage metadata
 */

/**
 * Document types in the contract corpus.
 */
export type DocumentType = "master" | "supplement" | "rider" | "local";

/**
 * Raw document metadata before processing.
 */
export interface RawDocument {
  /** Unique identifier (e.g., "master", "western") */
  id: string;
  /** Full document title */
  title: string;
  /** Short display name */
  shortTitle: string;
  /** Document classification */
  type: DocumentType;
  /** Path to source PDF file */
  filePath: string;
  /** Region for supplements */
  region?: string;
  /** Associated local number for local agreements */
  localNumber?: number;
}

/**
 * Single page of extracted text.
 */
export interface ExtractedPage {
  /** 1-indexed page number */
  pageNumber: number;
  /** Raw text content of the page */
  text: string;
}

/**
 * Fully extracted document with all pages.
 */
export interface ExtractedDocument {
  /** Document identifier */
  documentId: string;
  /** Document title */
  title: string;
  /** Total page count */
  pageCount: number;
  /** All extracted pages */
  pages: ExtractedPage[];
  /** Extraction timestamp */
  extractedAt: string;
}

/**
 * Detected section header in document.
 */
export interface SectionHeader {
  /** Article number (e.g., "6", "12") */
  article?: string;
  /** Section number (e.g., "2", "3(a)") */
  section?: string;
  /** Full header text */
  headerText: string;
  /** Page where header appears */
  pageNumber: number;
  /** Character offset in page text */
  offset: number;
}

/**
 * Metadata for a document chunk.
 */
export interface ChunkMetadata {
  /** Source document ID */
  documentId: string;
  /** Article number if identified */
  article: string | null;
  /** Section number if identified */
  section: string | null;
  /** Starting page in source PDF */
  pageStart: number;
  /** Ending page in source PDF */
  pageEnd: number;
  /** Approximate token count */
  tokenCount: number;
  /** Index within the document */
  chunkIndex: number;
}

/**
 * A chunk of document content ready for embedding.
 */
export interface DocumentChunk {
  /** Unique chunk identifier */
  id: string;
  /** Text content of the chunk */
  content: string;
  /** Chunk metadata */
  metadata: ChunkMetadata;
}

/**
 * Chunked document with all chunks.
 */
export interface ChunkedDocument {
  /** Document identifier */
  documentId: string;
  /** Document title */
  title: string;
  /** All chunks */
  chunks: DocumentChunk[];
  /** Chunking timestamp */
  chunkedAt: string;
  /** Configuration used for chunking */
  config: ChunkingConfig;
}

/**
 * Configuration for the chunking process.
 */
export interface ChunkingConfig {
  /** Target tokens per chunk */
  targetTokens: number;
  /** Maximum tokens per chunk */
  maxTokens: number;
  /** Overlap tokens between chunks */
  overlapTokens: number;
  /** Whether to preserve article boundaries */
  preserveArticleBoundaries: boolean;
}

/**
 * Document metadata stored in Supabase.
 */
export interface DocumentRecord {
  /** Document identifier (primary key) */
  id: string;
  /** Full document title */
  title: string;
  /** Short display name */
  short_title: string;
  /** Document type */
  type: DocumentType;
  /** Vercel Blob URL */
  blob_url: string;
  /** Total page count */
  page_count: number;
  /** Contract effective date */
  effective_date: string | null;
  /** Contract expiration date */
  expiration_date: string | null;
  /** Record creation timestamp */
  created_at: string;
}

/**
 * Insert type for document records.
 */
export type DocumentRecordInsert = Omit<DocumentRecord, "created_at">;

/**
 * Vector record for Pinecone upsert.
 */
export interface VectorRecord {
  /** Unique vector ID (chunk ID) */
  id: string;
  /** Embedding vector (3072 dimensions for text-embedding-3-large) */
  values: number[];
  /** Metadata for filtering and retrieval */
  metadata: {
    documentId: string;
    article: string | null;
    section: string | null;
    pageStart: number;
    pageEnd: number;
    chunkIndex: number;
    /** Store text content for retrieval */
    content: string;
  };
}

/**
 * Query result from Pinecone.
 */
export interface VectorQueryResult {
  /** Chunk ID */
  id: string;
  /** Similarity score */
  score: number;
  /** Chunk metadata */
  metadata: VectorRecord["metadata"];
}

/**
 * Default chunking configuration.
 */
export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  targetTokens: 400,
  maxTokens: 500,
  overlapTokens: 50,
  preserveArticleBoundaries: true,
};
