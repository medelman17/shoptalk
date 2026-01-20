"use client";

import { memo, useMemo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { parseFootnoteCitations, type Citation } from "@/lib/citations";
import { CitationFootnote } from "./citation-footnote";
import { SourcesList } from "./sources-list";

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
 * Message component that parses and renders footnote-style citations.
 *
 * Detects citation markers like `[Doc: master, Art: 6, Page: 45]` and
 * replaces them with superscript footnote numbers (¹²³), showing a
 * deduplicated sources list at the end of the message.
 */
export const MessageWithCitations = memo(
  function MessageWithCitations({
    content,
    onCitationClick,
    isStreaming = false,
    className,
    ...props
  }: MessageWithCitationsProps) {
    // Parse the content for footnote-style citations
    const parsed = useMemo(() => parseFootnoteCitations(content), [content]);

    // If no citations, render as plain markdown
    if (parsed.sources.length === 0) {
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

    // Render with footnote-style citations
    return (
      <div
        className={cn("prose prose-sm dark:prose-invert", className)}
        {...props}
      >
        <div>
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

            // Footnote segment - render as superscript number
            return (
              <CitationFootnote
                key={`fn-${index}`}
                footnoteNumber={segment.footnoteNumber}
                citation={segment.citation}
                onClick={onCitationClick}
              />
            );
          })}
        </div>

        {/* Sources list at the end - only show when not streaming */}
        {!isStreaming && (
          <SourcesList
            sources={parsed.sources}
            onSourceClick={onCitationClick}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming,
);

export type { Citation };
