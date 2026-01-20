"use client";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import type { Citation } from "@/lib/citations";
import { formatCitation } from "@/lib/citations";
import { FileTextIcon } from "lucide-react";
import type { ComponentProps } from "react";

export interface ContractCitationProps
  extends Omit<ComponentProps<typeof Badge>, "children" | "onClick"> {
  /** The parsed citation data */
  citation: Citation;
  /** Callback when citation is clicked */
  onClick?: (citation: Citation) => void;
}

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

/**
 * Get human-readable document name.
 */
function getDocumentName(documentId: string): string {
  return (
    DOCUMENT_NAMES[documentId] ||
    documentId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

/**
 * Clickable citation badge for contract document references.
 *
 * Shows a compact reference that expands on hover to show full details.
 */
export function ContractCitation({
  citation,
  onClick,
  className,
  ...props
}: ContractCitationProps) {
  const shortLabel = formatCitation(citation, "short");
  const fullDocName = getDocumentName(citation.documentId);

  const handleClick = () => {
    onClick?.(citation);
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Badge
          variant="secondary"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            "transition-colors hover:bg-accent hover:text-accent-foreground",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          <FileTextIcon className="h-3 w-3" />
          <span>{shortLabel}</span>
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <FileTextIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-tight">{fullDocName}</p>
              {citation.article && (
                <p className="text-sm text-muted-foreground">
                  Article {citation.article}
                  {citation.section && `, Section ${citation.section}`}
                </p>
              )}
              {citation.page && (
                <p className="text-xs text-muted-foreground">
                  Page {citation.page}
                </p>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export type { Citation };
