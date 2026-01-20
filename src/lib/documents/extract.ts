/**
 * PDF text extraction utilities.
 *
 * Uses pdf-parse to extract text from PDF documents while preserving
 * page boundaries for accurate citations.
 */

import { readFile } from "fs/promises";

// pdf-parse is a CommonJS module, need to handle interop
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse");
import type {
  ExtractedDocument,
  ExtractedPage,
  SectionHeader,
} from "./types";

/**
 * Extract text from a PDF file.
 *
 * @param filePath - Path to the PDF file
 * @param documentId - Unique identifier for the document
 * @param title - Document title
 * @returns Extracted document with pages
 */
export async function extractPdf(
  filePath: string,
  documentId: string,
  title: string
): Promise<ExtractedDocument> {
  const buffer = await readFile(filePath);

  // Track pages as we extract
  const pages: ExtractedPage[] = [];
  let currentPage = 0;

  // Custom page renderer to capture individual pages
  const options = {
    // Called for each page
    pagerender: async (pageData: { getTextContent: () => Promise<{ items: Array<{ str: string }> }> }) => {
      currentPage++;
      const textContent = await pageData.getTextContent();
      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      pages.push({
        pageNumber: currentPage,
        text: pageText,
      });

      return pageText;
    },
  };

  const data = await pdf(buffer, options);

  return {
    documentId,
    title,
    pageCount: data.numpages,
    pages,
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Regex patterns for identifying article and section headers.
 *
 * Contract documents follow patterns like:
 * - "ARTICLE 6" or "Article 6"
 * - "Section 2" or "SECTION 2"
 * - "Section 2(a)" or "Section 2.1"
 */
const ARTICLE_PATTERN = /\b(?:ARTICLE|Article)\s+(\d+)\b/g;
const SECTION_PATTERN = /\b(?:SECTION|Section)\s+(\d+(?:\.\d+)?(?:\([a-z]\))?)\b/g;

/**
 * Detect section headers in extracted text.
 *
 * @param pages - Extracted pages
 * @returns Array of detected section headers
 */
export function detectSectionHeaders(pages: ExtractedPage[]): SectionHeader[] {
  const headers: SectionHeader[] = [];
  let currentArticle: string | undefined;

  for (const page of pages) {
    // Find article headers
    const articleMatches = page.text.matchAll(ARTICLE_PATTERN);
    for (const match of articleMatches) {
      currentArticle = match[1];
      headers.push({
        article: currentArticle,
        headerText: match[0],
        pageNumber: page.pageNumber,
        offset: match.index ?? 0,
      });
    }

    // Find section headers
    const sectionMatches = page.text.matchAll(SECTION_PATTERN);
    for (const match of sectionMatches) {
      headers.push({
        article: currentArticle,
        section: match[1],
        headerText: match[0],
        pageNumber: page.pageNumber,
        offset: match.index ?? 0,
      });
    }
  }

  return headers;
}

/**
 * Get the full text of a document (all pages concatenated).
 *
 * @param document - Extracted document
 * @returns Full document text
 */
export function getFullText(document: ExtractedDocument): string {
  return document.pages.map((p) => p.text).join("\n\n");
}

/**
 * Find which page a character offset falls on.
 *
 * @param document - Extracted document
 * @param offset - Character offset in full text
 * @returns Page number (1-indexed)
 */
export function getPageForOffset(
  document: ExtractedDocument,
  offset: number
): number {
  let currentOffset = 0;

  for (const page of document.pages) {
    const pageEnd = currentOffset + page.text.length + 2; // +2 for \n\n separator
    if (offset < pageEnd) {
      return page.pageNumber;
    }
    currentOffset = pageEnd;
  }

  // Default to last page if offset exceeds document
  return document.pageCount;
}
