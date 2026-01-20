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
 * A parsed segment of text that may contain citations.
 * Used for rendering text with inline citation badges.
 */
export type TextSegment =
  | { type: "text"; content: string }
  | { type: "citation"; citation: Citation };

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
