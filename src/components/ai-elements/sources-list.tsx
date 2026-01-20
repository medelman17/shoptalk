"use client";

import { cn } from "@/lib/utils";
import type { Citation, UniqueSource } from "@/lib/citations";
import { formatCitation } from "@/lib/citations";
import { FileTextIcon } from "lucide-react";
import type { ComponentProps } from "react";

/**
 * Document display names for user-friendly presentation.
 */
const DOCUMENT_NAMES: Record<string, string> = {
  master: "National Master Agreement",
  western: "Western Region Supplement",
  central: "Central Region Supplement",
  southern: "Southern Region Supplement",
  atlantic: "Atlantic Area Supplement",
  eastern: "Eastern Region Supplement",
  "local-804": "Local 804 Agreement",
  "local-705": "Local 705 Agreement",
  "local-710": "Local 710 Agreement",
  "northern-california": "Northern California Rider",
  "southern-california": "Southern California Rider",
  "southwest-package": "Southwest Package Rider",
  "new-england": "New England Rider",
  "upstate-ny": "Upstate NY Rider",
  texas: "Texas Rider",
  "ohio-valley": "Ohio Valley Rider",
  "michigan-indiana": "Michigan-Indiana Rider",
};

function getDocumentName(documentId: string): string {
  return (
    DOCUMENT_NAMES[documentId] ||
    documentId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export interface SourcesListProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** Unique sources to display */
  sources: UniqueSource[];
  /** Callback when a source is clicked */
  onSourceClick?: (citation: Citation) => void;
}

/**
 * Displays a list of citation sources at the end of a message.
 *
 * Shows deduplicated sources with footnote numbers, document names,
 * and article/section references. Each source is clickable.
 */
export function SourcesList({
  sources,
  onSourceClick,
  className,
  ...props
}: SourcesListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("mt-4 border-t border-border/50 pt-3", className)}
      {...props}
    >
      <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Sources
      </p>
      <ol className="space-y-1.5 list-none p-0 m-0">
        {sources.map((source) => (
          <li key={source.footnoteNumber} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-4 text-xs font-medium text-muted-foreground tabular-nums">
              {source.footnoteNumber}.
            </span>
            <button
              type="button"
              onClick={() => onSourceClick?.(source.citation)}
              className={cn(
                "flex items-start gap-1.5 text-left text-sm",
                "text-foreground/80 hover:text-foreground",
                "transition-colors cursor-pointer",
                "focus:outline-none focus-visible:underline",
              )}
            >
              <FileTextIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <span>
                <span className="font-medium">
                  {getDocumentName(source.citation.documentId)}
                </span>
                {source.citation.article && (
                  <span className="text-muted-foreground">
                    {", "}Art. {source.citation.article}
                    {source.citation.section &&
                      `, Sec. ${source.citation.section}`}
                  </span>
                )}
                {source.citation.page && (
                  <span className="text-muted-foreground">
                    {" "}
                    (p. {source.citation.page})
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
