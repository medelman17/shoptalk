"use client";

import {
  memo,
  useMemo,
  useCallback,
  type ComponentProps,
  type AnchorHTMLAttributes,
} from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import {
  transformToMarkdownFootnotesWithMap,
  type Citation,
} from "@/lib/citations";

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
 * Extract footnote number from a footnote href.
 * Footnote refs look like "#user-content-fn-1" or "#fn-1"
 * Footnote back-refs look like "#user-content-fnref-1" or "#fnref-1"
 */
function extractFootnoteNumber(href: string): number | null {
  // Match patterns like #user-content-fn-1, #fn-1, #user-content-fnref-1, #fnref-1
  const match = href.match(/fn(?:ref)?-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Message component that transforms citations into native markdown footnotes.
 *
 * Detects citation markers like `[Doc: master, Art: 6, Page: 45]` and
 * converts them to markdown footnote syntax `[^1]` with definitions
 * at the end, letting the markdown renderer handle display.
 *
 * Footnote superscripts are clickable and trigger onCitationClick.
 */
export const MessageWithCitations = memo(
  function MessageWithCitations({
    content,
    onCitationClick,
    isStreaming = false,
    className,
    ...props
  }: MessageWithCitationsProps) {
    // Transform citations to native markdown footnotes
    const { markdown, citationMap } = useMemo(
      () => transformToMarkdownFootnotesWithMap(content),
      [content],
    );

    // Custom anchor component to intercept footnote clicks
    const CustomAnchor = useCallback(
      ({
        href,
        children,
        ...anchorProps
      }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
        // Check if this is a footnote link
        const footnoteNumber = href ? extractFootnoteNumber(href) : null;
        const citation = footnoteNumber
          ? citationMap.get(footnoteNumber)
          : null;

        // If it's a footnote ref (not back-ref) and we have citation data
        const isFootnoteRef = href?.includes("fn-") && !href?.includes("fnref");

        if (isFootnoteRef && citation && onCitationClick) {
          return (
            <a
              {...anchorProps}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onCitationClick(citation);
              }}
              className="cursor-pointer no-underline"
            >
              {children}
            </a>
          );
        }

        // Regular link or back-ref - render normally
        return (
          <a {...anchorProps} href={href}>
            {children}
          </a>
        );
      },
      [citationMap, onCitationClick],
    );

    return (
      <div
        className={cn("prose prose-sm dark:prose-invert", className)}
        {...props}
      >
        <Streamdown
          mode={isStreaming ? "streaming" : "static"}
          components={{ a: CustomAnchor }}
        >
          {markdown}
        </Streamdown>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming,
);

export type { Citation };
