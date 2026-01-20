/**
 * Citation types for contract document references.
 *
 * Citations are structured references to specific locations within
 * UPS Teamster contract documents.
 */

/**
 * A citation reference to a specific location in a contract document.
 */
export interface Citation {
  /** Document ID (e.g., "master", "western", "northern-california") */
  documentId: string;
  /** Article number, if specified */
  article?: string;
  /** Section number/name, if specified */
  section?: string;
  /** Starting page number, if specified */
  page?: number;
  /** The original citation string as it appeared in the text */
  raw: string;
}

/**
 * A citation with an assigned footnote number.
 */
export interface NumberedCitation extends Citation {
  /** Footnote number (1-indexed) */
  footnoteNumber: number;
}

/**
 * A unique source that may be referenced multiple times.
 */
export interface UniqueSource {
  /** Footnote number (1-indexed) */
  footnoteNumber: number;
  /** The citation details */
  citation: Citation;
  /** How many times this source was cited */
  occurrences: number;
}

/**
 * A parsed segment of text that may contain citations.
 * Used for rendering text with inline citation badges.
 */
export type TextSegment =
  | { type: "text"; content: string }
  | { type: "citation"; citation: Citation };

/**
 * Footnote-style segment with numbered references.
 */
export type FootnoteSegment =
  | { type: "text"; content: string }
  | { type: "footnote"; footnoteNumber: number; citation: Citation };

/**
 * Result of parsing text for citations.
 */
export interface ParseResult {
  /** The original text */
  original: string;
  /** All citations found in the text */
  citations: Citation[];
  /** Text segments for rendering (alternating text and citations) */
  segments: TextSegment[];
}

/**
 * Result of parsing text for footnote-style citations.
 */
export interface FootnoteParseResult {
  /** The original text */
  original: string;
  /** Unique sources, deduplicated and numbered */
  sources: UniqueSource[];
  /** Text segments with footnote numbers */
  segments: FootnoteSegment[];
}
