"use client";

import { memo, useMemo, Fragment, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { parseCitations, type Citation } from "@/lib/citations";
import { ContractCitation } from "./contract-citation";

export interface MessageWithCitationsProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** The message content (may contain citation markers) */
  content: string;
  /** Callback when a citation is clicked */
  onCitationClick?: (citation: Citation) => void;
  /** Whether the message is still streaming */
  isStreaming?: boolean;
}

/**
 * Renders a text segment with markdown support.
 */
function TextSegment({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming?: boolean;
}) {
  // Use Streamdown for markdown rendering with streaming support
  // Note: Removed "inline" class - it was breaking block-level elements like lists
  // Citations are inline elements and will flow naturally within text
  return (
    <Streamdown
      className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      mode={isStreaming ? "streaming" : "static"}
    >
      {content}
    </Streamdown>
  );
}

/**
 * Message component that parses and renders inline citations.
 *
 * Detects citation markers like `[Doc: master, Art: 6, Page: 45]` and
 * replaces them with clickable citation badges while preserving the
 * surrounding markdown content.
 */
export const MessageWithCitations = memo(
  function MessageWithCitations({
    content,
    onCitationClick,
    isStreaming = false,
    className,
    ...props
  }: MessageWithCitationsProps) {
    // Parse the content for citations
    const parsed = useMemo(() => parseCitations(content), [content]);

    // If no citations, render as plain markdown
    if (parsed.citations.length === 0) {
      return (
        <div
          className={cn("prose prose-sm dark:prose-invert", className)}
          {...props}
        >
          <Streamdown mode={isStreaming ? "streaming" : "static"}>
            {content}
          </Streamdown>
        </div>
      );
    }

    // Render with inline citations
    return (
      <div
        className={cn("prose prose-sm dark:prose-invert", className)}
        {...props}
      >
        {parsed.segments.map((segment, index) => {
          if (segment.type === "text") {
            return (
              <TextSegment
                key={`text-${index}`}
                content={segment.content}
                isStreaming={isStreaming}
              />
            );
          }

          // Citation segment
          return (
            <ContractCitation
              key={`citation-${index}`}
              citation={segment.citation}
              onClick={onCitationClick}
            />
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming,
);

export type { Citation };
