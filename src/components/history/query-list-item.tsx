/**
 * Query list item component.
 *
 * Displays a single query in the history list with question preview,
 * timestamp, and link to full details.
 */

"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquareIcon, ChevronRightIcon } from "lucide-react";
import type { Query } from "@/lib/supabase/types";

interface QueryListItemProps {
  query: Query;
  className?: string;
}

export function QueryListItem({ query, className }: QueryListItemProps) {
  // created_at is always set by the database, so we can safely use it
  const createdAt = query.created_at ? new Date(query.created_at) : new Date();
  const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  // Truncate question for preview
  const questionPreview =
    query.question.length > 100
      ? query.question.slice(0, 100) + "..."
      : query.question;

  // Check if answer is available
  const hasAnswer = query.answer && query.answer.trim().length > 0;

  return (
    <Link
      href={`/history/${query.id}`}
      className={cn(
        "group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50",
        className
      )}
    >
      {/* Icon */}
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <MessageSquareIcon className="h-4 w-4 text-primary" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium">{questionPreview}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{timeAgo}</span>
          {!hasAnswer && (
            <>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400">
                No answer yet
              </span>
            </>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
