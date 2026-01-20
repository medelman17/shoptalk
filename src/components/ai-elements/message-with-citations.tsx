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
 * Mapping of contract display names to document IDs.
 * Used to detect and linkify contract names in plain text.
 */
const CONTRACT_NAME_TO_ID: Record<string, string> = {
  // Master Agreement
  "Master Agreement": "master",
  "National Master Agreement": "master",
  // Regional Supplements
  "Western Supplement": "western",
  "Central Supplement": "central",
  "Southern Supplement": "southern",
  "Atlantic Supplement": "atlantic",
  "Eastern Supplement": "eastern",
  // Standalone Locals
  "Local 804 Agreement": "local-804",
  "Local 705 Agreement": "local-705",
  "Local 710 Agreement": "local-710",
  // Riders
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

/**
 * Build regex pattern to match all known contract names.
 * Sorts by length descending to match longer names first.
 */
const CONTRACT_NAMES_PATTERN = new RegExp(
  `(${Object.keys(CONTRACT_NAME_TO_ID)
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g"
);

/**
 * Transform plain text contract names into clickable links.
 */
function transformContractLinks(content: string): string {
  return content.replace(CONTRACT_NAMES_PATTERN, (match) => {
    const docId = CONTRACT_NAME_TO_ID[match];
    if (docId) {
      return `[${match}](#contract-${docId})`;
    }
    return match;
  });
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
    // First transform contract names to links, then citations
    const contractTransformed = useMemo(
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
