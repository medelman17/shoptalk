"use client";

import {
  memo,
  useMemo,
  useCallback,
  type ComponentProps,
  type AnchorHTMLAttributes,
  type ReactNode,
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
  /** Callback when a contract link is clicked */
  onContractClick?: (documentId: string) => void;
  /** Whether the message is still streaming */
  isStreaming?: boolean;
}

/**
 * Contract link pattern: [[contract:documentId:Document Name]]
 */
const CONTRACT_LINK_PATTERN = /\[\[contract:([^:]+):([^\]]+)\]\]/g;

/**
 * Transform contract link markers into clickable spans.
 * Returns the transformed markdown with contract links as special markers.
 */
function transformContractLinks(
  content: string,
  onContractClick?: (documentId: string) => void,
): { markdown: string; contractLinks: Map<string, { id: string; name: string }> } {
  const contractLinks = new Map<string, { id: string; name: string }>();
  let linkIndex = 0;

  const markdown = content.replace(CONTRACT_LINK_PATTERN, (_, docId, docName) => {
    const key = `__CONTRACT_LINK_${linkIndex++}__`;
    contractLinks.set(key, { id: docId, name: docName });
    // Return a styled link that we'll make clickable
    return `[${docName}](#contract-${docId})`;
  });

  return { markdown, contractLinks };
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
    onContractClick,
    isStreaming = false,
    className,
    ...props
  }: MessageWithCitationsProps) {
    // First transform contract links, then citations
    const { markdown: contractTransformed } = useMemo(
      () => transformContractLinks(content),
      [content],
    );

    // Transform citations to native markdown footnotes
    const { markdown, citationMap } = useMemo(
      () => transformToMarkdownFootnotesWithMap(contractTransformed),
      [contractTransformed],
    );

    // Custom anchor component to intercept footnote and contract link clicks
    const CustomAnchor = useCallback(
      ({
        href,
        children,
        ...anchorProps
      }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
        // Check if this is a contract link
        const contractMatch = href?.match(/^#contract-(.+)$/);
        if (contractMatch && onContractClick) {
          const documentId = contractMatch[1];
          return (
            <a
              {...anchorProps}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onContractClick(documentId);
              }}
              className="cursor-pointer text-primary underline hover:text-primary/80"
            >
              {children}
            </a>
          );
        }

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
      [citationMap, onCitationClick, onContractClick],
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
