/**
 * Citation parser for extracting document references from text.
 *
 * Parses citations in the format:
 * [Doc: {documentId}, Art: {article}, Sec: {section}, Page: {page}]
 *
 * Examples:
 * - [Doc: master, Art: 6, Sec: 2, Page: 45]
 * - [Doc: western, Art: 3, Page: 12]
 * - [Doc: northern-california, Page: 8]
 */

import type { Citation, ParseResult, TextSegment } from "./types";

/**
 * Regular expression to match citation patterns.
 *
 * Captures:
 * - documentId (required): alphanumeric with hyphens
 * - article (optional): alphanumeric
 * - section (optional): alphanumeric with dots
 * - page (optional): numeric
 */
const CITATION_REGEX =
  /\[Doc:\s*([a-zA-Z0-9-]+)(?:,\s*Art:\s*([a-zA-Z0-9.]+))?(?:,\s*Sec:\s*([a-zA-Z0-9.]+))?(?:,\s*Page:\s*(\d+))?\]/g;

/**
 * Parse a single citation match into a Citation object.
 *
 * @param match - The regex match array
 * @returns Parsed Citation object
 */
function parseCitationMatch(match: RegExpMatchArray): Citation {
  const [raw, documentId, article, section, pageStr] = match;

  return {
    documentId,
    article: article || undefined,
    section: section || undefined,
    page: pageStr ? parseInt(pageStr, 10) : undefined,
    raw,
  };
}

/**
 * Extract all citations from text.
 *
 * @param text - The text to search for citations
 * @returns Array of Citation objects
 */
export function extractCitations(text: string): Citation[] {
  const citations: Citation[] = [];
  const regex = new RegExp(CITATION_REGEX.source, "g");

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    citations.push(parseCitationMatch(match));
  }

  return citations;
}

/**
 * Parse text into segments of plain text and citations.
 *
 * This is useful for rendering text with inline citation badges.
 *
 * @param text - The text to parse
 * @returns ParseResult with citations and segments
 */
export function parseCitations(text: string): ParseResult {
  const citations: Citation[] = [];
  const segments: TextSegment[] = [];
  const regex = new RegExp(CITATION_REGEX.source, "g");

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before this citation
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    // Parse and add the citation
    const citation = parseCitationMatch(match);
    citations.push(citation);
    segments.push({
      type: "citation",
      citation,
    });

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last citation
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return {
    original: text,
    citations,
    segments,
  };
}

/**
 * Format a citation for display.
 *
 * @param citation - The citation to format
 * @param style - Display style ("short" or "full")
 * @returns Formatted citation string
 */
export function formatCitation(
  citation: Citation,
  style: "short" | "full" = "short"
): string {
  if (style === "short") {
    // Short format: "Master Art. 6" or "Western p.12"
    const parts: string[] = [];

    // Document name (capitalize first letter)
    const docName = citation.documentId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    parts.push(docName);

    if (citation.article) {
      parts.push(`Art. ${citation.article}`);
    } else if (citation.page) {
      parts.push(`p.${citation.page}`);
    }

    return parts.join(" ");
  }

  // Full format: "Master Agreement, Article 6, Section 2, Page 45"
  const parts: string[] = [];

  const docName = citation.documentId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  parts.push(docName);

  if (citation.article) {
    parts.push(`Article ${citation.article}`);
  }
  if (citation.section) {
    parts.push(`Section ${citation.section}`);
  }
  if (citation.page) {
    parts.push(`Page ${citation.page}`);
  }

  return parts.join(", ");
}

/**
 * Remove all citations from text, leaving only the prose.
 *
 * @param text - Text with citations
 * @returns Text with citations removed
 */
export function stripCitations(text: string): string {
  return text.replace(CITATION_REGEX, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * Check if text contains any citations.
 *
 * @param text - Text to check
 * @returns True if text contains citations
 */
export function hasCitations(text: string): boolean {
  return CITATION_REGEX.test(text);
}
