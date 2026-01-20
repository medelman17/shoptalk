/**
 * Query list component.
 *
 * Displays a list of queries with empty state handling.
 */

import { QueryListItem } from "./query-list-item";
import { cn } from "@/lib/utils";
import { HistoryIcon } from "lucide-react";
import type { Query } from "@/lib/supabase/types";

interface QueryListProps {
  queries: Query[];
  className?: string;
}

export function QueryList({ queries, className }: QueryListProps) {
  if (queries.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <div className="mb-4 rounded-full bg-muted p-4">
          <HistoryIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No queries yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          When you ask questions about your contract, they&apos;ll appear here
          for easy reference.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {queries.map((query) => (
        <QueryListItem key={query.id} query={query} />
      ))}
    </div>
  );
}
