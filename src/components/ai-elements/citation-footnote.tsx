"use client";

import { cn } from "@/lib/utils";
import type { Citation } from "@/lib/citations";
import type { ComponentProps } from "react";

export interface CitationFootnoteProps extends Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> {
  /** Footnote number to display */
  footnoteNumber: number;
  /** The citation data (for click handling) */
  citation: Citation;
  /** Callback when footnote is clicked */
  onClick?: (citation: Citation) => void;
}

/**
 * Superscript footnote number for inline citations.
 *
 * Renders as a small, clickable superscript (like ¹²³) that
 * can trigger PDF navigation or scroll to sources.
 */
export function CitationFootnote({
  footnoteNumber,
  citation,
  onClick,
  className,
  ...props
}: CitationFootnoteProps) {
  const handleClick = () => {
    onClick?.(citation);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative -top-1 inline-flex h-4 min-w-4 items-center justify-center",
        "rounded px-0.5 text-[10px] font-medium leading-none",
        "text-primary/80 hover:text-primary",
        "hover:bg-primary/10 transition-colors",
        "cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
        className,
      )}
      title={`Source ${footnoteNumber}`}
      {...props}
    >
      {footnoteNumber}
    </button>
  );
}
