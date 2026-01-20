"use client";

import { memo, useMemo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { transformToMarkdownFootnotes, type Citation } from "@/lib/citations";

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
 * Message component that transforms citations into native markdown footnotes.
 *
 * Detects citation markers like `[Doc: master, Art: 6, Page: 45]` and
 * converts them to markdown footnote syntax `[^1]` with definitions
 * at the end, letting the markdown renderer handle display.
 */
export const MessageWithCitations = memo(
  function MessageWithCitations({
    content,
    onCitationClick: _onCitationClick,
    isStreaming = false,
    className,
    ...props
  }: MessageWithCitationsProps) {
    // Transform citations to native markdown footnotes
    const markdownContent = useMemo(
      () => transformToMarkdownFootnotes(content),
      [content],
    );

    return (
      <div
        className={cn("prose prose-sm dark:prose-invert", className)}
        {...props}
      >
        <Streamdown mode={isStreaming ? "streaming" : "static"}>
          {markdownContent}
        </Streamdown>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming,
);

export type { Citation };
