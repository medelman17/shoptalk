"use client";

import { memo, useMemo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import {
  parseFootnoteCitations,
  stripCitations,
  type Citation,
} from "@/lib/citations";
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
 * Message component that extracts citations and displays them as a sources list.
 *
 * Detects citation markers like `[Doc: master, Art: 6, Page: 45]`,
 * strips them from the content for clean reading, and shows a
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
    // Parse citations and get clean content
    const { cleanContent, sources } = useMemo(() => {
      const parsed = parseFootnoteCitations(content);
      return {
        cleanContent: stripCitations(content),
        sources: parsed.sources,
      };
    }, [content]);

    return (
      <div
        className={cn("prose prose-sm dark:prose-invert", className)}
        {...props}
      >
        <Streamdown mode={isStreaming ? "streaming" : "static"}>
          {cleanContent}
        </Streamdown>

        {/* Sources list at the end - only show when not streaming and has sources */}
        {!isStreaming && sources.length > 0 && (
          <SourcesList sources={sources} onSourceClick={onCitationClick} />
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming,
);

export type { Citation };
