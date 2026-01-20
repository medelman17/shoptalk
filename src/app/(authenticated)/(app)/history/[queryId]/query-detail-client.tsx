/**
 * Client component for query detail page.
 *
 * Renders the full question and answer with citations and navigation.
 */

"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { BackButton } from "@/components/ui/back-button";
import { MessageWithCitations } from "@/components/ai-elements/message-with-citations";
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { ShareIcon, TrashIcon } from "lucide-react";
import type { Query } from "@/lib/supabase/types";
import type { Citation } from "@/lib/citations";

interface QueryDetailClientProps {
  query: Query;
}

export function QueryDetailClient({ query }: QueryDetailClientProps) {
  const router = useRouter();

  const createdAt = query.created_at ? new Date(query.created_at) : new Date();
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  const formattedDate = format(createdAt, "PPP 'at' p");

  const handleCitationClick = (citation: Citation) => {
    // Navigate to PDF viewer with page number if available
    const pageParam = citation.page ? `?page=${citation.page}` : "";
    router.push(`/pdf/${citation.documentId}${pageParam}`);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "ShopTalk Query",
          text: query.question,
          url,
        });
      } catch {
        // User cancelled or share failed - copy to clipboard as fallback
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this query?")) {
      return;
    }

    try {
      const response = await fetch(`/api/queries/${query.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/history");
      }
    } catch (error) {
      console.error("Failed to delete query:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <BackButton fallbackHref="/history" label="Back" />
          <div className="h-5 w-px bg-border" />
          <div>
            <p className="text-sm text-muted-foreground" title={formattedDate}>
              {timeAgo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleShare}
            title="Share query"
          >
            <ShareIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            title="Delete query"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* User question */}
          <Message from="user">
            <MessageContent>
              <p>{query.question}</p>
            </MessageContent>
          </Message>

          {/* Assistant answer */}
          {query.answer ? (
            <Message from="assistant">
              <MessageContent>
                <MessageWithCitations
                  content={query.answer}
                  onCitationClick={handleCitationClick}
                  isStreaming={false}
                />
              </MessageContent>
            </Message>
          ) : (
            <Message from="assistant">
              <MessageContent>
                <p className="text-muted-foreground italic">
                  No answer was recorded for this query.
                </p>
              </MessageContent>
            </Message>
          )}
        </div>
      </div>
    </div>
  );
}
