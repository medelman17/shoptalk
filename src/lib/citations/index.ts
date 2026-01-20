/**
 * Citation system for contract document references.
 *
 * This module provides utilities for parsing and rendering citations
 * in AI-generated responses about UPS Teamster contracts.
 *
 * Citation format: [Doc: {documentId}, Art: {article}, Sec: {section}, Page: {page}]
 */

export type {
  Citation,
  TextSegment,
  ParseResult,
  FootnoteSegment,
  FootnoteParseResult,
  UniqueSource,
  NumberedCitation,
} from "./types";

export {
  extractCitations,
  parseCitations,
  parseFootnoteCitations,
  transformToMarkdownFootnotes,
  formatCitation,
  stripCitations,
  hasCitations,
} from "./parser";
