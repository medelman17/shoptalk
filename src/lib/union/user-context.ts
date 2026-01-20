/**
 * User context formatting for AI responses.
 *
 * Formats the user's position and contract chain for display
 * at the beginning of every AI response.
 */

import type { Classification } from "./types";
import { getClassificationLabel } from "./classifications";
import { getApplicableDocuments } from "./mapping";
import { getLocalByNumber } from "./locals";

/**
 * Formatted user context for AI display.
 */
export interface UserContext {
  /** User's job classification label */
  position: string;
  /** Local union number */
  localNumber: number | null;
  /** Local union name (e.g., "Teamsters Local 63") */
  localName: string | null;
  /** List of applicable contract document names */
  contractChain: string[];
  /** Formatted string ready for AI to include in response */
  formatted: string;
}

/**
 * Parse classification from database format.
 * Handles both standard classifications and "other: custom text" format.
 */
function parseClassification(dbValue: string | null): string {
  if (!dbValue) return "Unknown Position";

  // Handle "other: custom text" format
  if (dbValue.startsWith("other:")) {
    const customText = dbValue.substring(6).trim();
    return customText || "Other";
  }

  // Standard classification
  return getClassificationLabel(dbValue as Classification);
}

/**
 * Contract info with both name and ID for linking.
 */
interface ContractInfo {
  id: string;
  name: string;
}

/**
 * Get the contract chain with both names and IDs.
 */
function getContractChainInfo(localNumber: number | null): ContractInfo[] {
  if (!localNumber) {
    return [{ id: "master", name: "National Master Agreement" }];
  }

  const docs = getApplicableDocuments(localNumber);
  return docs.all.map((doc) => ({
    id: doc.id,
    name: doc.shortName,
  }));
}

/**
 * Format the contract chain as plain text (for contractChain array).
 */
function formatContractChain(localNumber: number | null): string[] {
  return getContractChainInfo(localNumber).map((c) => c.name);
}

/**
 * Format the contract chain with custom link markers.
 * Uses format [[contract:documentId:Document Name]] which gets parsed client-side.
 * This avoids markdown link blocking issues with relative URLs.
 */
function formatContractChainWithLinks(localNumber: number | null): string {
  const contracts = getContractChainInfo(localNumber);
  return contracts
    .map((c) => `[[contract:${c.id}:${c.name}]]`)
    .join(" → ");
}

/**
 * Build formatted user context for AI responses.
 *
 * @param localNumber - User's Local union number (parsed as number or null)
 * @param classification - User's job classification from database
 * @returns Formatted user context object
 */
export function buildUserContext(
  localNumber: number | null,
  classification: string | null,
): UserContext {
  const position = parseClassification(classification);
  const contractChain = formatContractChain(localNumber);

  // Get local union info
  const local = localNumber ? getLocalByNumber(localNumber) : null;
  const localName = local ? `Teamsters Local ${local.number}` : null;

  // Build formatted string with clickable contract links
  const parts: string[] = [];

  // Position line
  parts.push(`**Position:** ${position}`);

  // Local union line
  if (localName) {
    parts.push(`**Local:** ${localName}`);
  }

  // Contract chain line with clickable links
  const contractLinks = formatContractChainWithLinks(localNumber);
  parts.push(`**Applicable Contracts:** ${contractLinks}`);

  const formatted = parts.join("\n");

  return {
    position,
    localNumber,
    localName,
    contractChain,
    formatted,
  };
}

/**
 * Build the context header string that the AI should include at the start of every response.
 *
 * @param localNumber - User's Local union number
 * @param classification - User's job classification from database
 * @returns Formatted context header string
 */
export function buildContextHeader(
  localNumber: number | null,
  classification: string | null,
): string {
  const ctx = buildUserContext(localNumber, classification);
  return ctx.formatted;
}
