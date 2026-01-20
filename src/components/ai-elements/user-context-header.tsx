"use client";

import { useMemo } from "react";
import { FileText } from "lucide-react";

/**
 * Mapping of contract display names to document IDs.
 */
const CONTRACT_NAME_TO_ID: Record<string, string> = {
  "Master Agreement": "master",
  "National Master Agreement": "master",
  "Western Supplement": "western",
  "Central Supplement": "central",
  "Southern Supplement": "southern",
  "Atlantic Supplement": "atlantic",
  "Eastern Supplement": "eastern",
  "Local 804 Agreement": "local-804",
  "Local 705 Agreement": "local-705",
  "Local 710 Agreement": "local-710",
  "NorCal Rider": "northern-california",
  "Northern California Rider": "northern-california",
  "SoCal Rider": "southern-california",
  "Southern California Rider": "southern-california",
  "SW Package Rider": "southwest-package",
  "Southwest Package Rider": "southwest-package",
  "New England Rider": "new-england",
  "Upstate NY Rider": "upstate-ny",
  "Upstate New York Rider": "upstate-ny",
  "Texas Rider": "texas",
  "Ohio Valley Rider": "ohio-valley",
  "MI-IN Rider": "michigan-indiana",
  "Michigan-Indiana Rider": "michigan-indiana",
};

interface ParsedContext {
  position: string | null;
  local: string | null;
  contracts: string[];
}

/**
 * Parse the user context from markdown content.
 * Looks for patterns like:
 * **Position:** Package Car Driver (RPCD)
 * **Local:** Teamsters Local 177
 * **Applicable Contracts:** Master Agreement → Atlantic Supplement
 */
function parseUserContext(content: string): ParsedContext | null {
  const positionMatch = content.match(/\*\*Position:\*\*\s*([^\n*]+)/);
  const localMatch = content.match(/\*\*Local:\*\*\s*([^\n*]+)/);
  const contractsMatch = content.match(/\*\*Applicable Contracts:\*\*\s*([^\n]+)/);

  if (!positionMatch && !localMatch && !contractsMatch) {
    return null;
  }

  const contracts = contractsMatch
    ? contractsMatch[1].split("→").map((c) => c.trim())
    : [];

  return {
    position: positionMatch ? positionMatch[1].trim() : null,
    local: localMatch ? localMatch[1].trim() : null,
    contracts,
  };
}

/**
 * Remove the user context header from content for separate rendering.
 */
export function stripUserContextHeader(content: string): string {
  // Remove the context header lines and the following ---
  return content
    .replace(/\*\*Position:\*\*\s*[^\n]+\n?/g, "")
    .replace(/\*\*Local:\*\*\s*[^\n]+\n?/g, "")
    .replace(/\*\*Applicable Contracts:\*\*\s*[^\n]+\n?/g, "")
    .replace(/^---\s*\n?/, "")
    .replace(/^\n+/, "")
    .trim();
}

interface UserContextHeaderProps {
  content: string;
  onContractClick?: (documentId: string) => void;
}

/**
 * Renders the user context header in a styled card format.
 */
export function UserContextHeader({ content, onContractClick }: UserContextHeaderProps) {
  const context = useMemo(() => parseUserContext(content), [content]);

  if (!context) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border bg-muted/30 p-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {context.position && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-muted-foreground">Position:</span>
            <span>{context.position}</span>
          </div>
        )}
        {context.local && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-muted-foreground">Local:</span>
            <span>{context.local}</span>
          </div>
        )}
      </div>
      {context.contracts.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Contracts:</span>
          {context.contracts.map((contract, idx) => {
            const docId = CONTRACT_NAME_TO_ID[contract];
            return (
              <span key={idx} className="flex items-center">
                {idx > 0 && <span className="mx-1 text-muted-foreground">→</span>}
                {docId && onContractClick ? (
                  <button
                    type="button"
                    onClick={() => onContractClick(docId)}
                    className="text-xs text-primary underline hover:text-primary/80"
                  >
                    {contract}
                  </button>
                ) : (
                  <span className="text-xs">{contract}</span>
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Check if content contains a user context header.
 */
export function hasUserContextHeader(content: string): boolean {
  return parseUserContext(content) !== null;
}
