/**
 * Loading skeleton for PDF viewer.
 *
 * Displays while the PDF document is being loaded.
 */

import { cn } from "@/lib/utils";

interface PdfLoadingProps {
  className?: string;
}

export function PdfLoading({ className }: PdfLoadingProps) {
  return (
    <div className={cn("flex h-full items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated document icon */}
        <div className="relative">
          <div className="h-16 w-12 rounded border-2 border-muted-foreground/30 bg-muted/30">
            <div className="absolute left-0 right-0 top-0 h-3 border-b-2 border-muted-foreground/30" />
            {/* Animated loading lines */}
            <div className="mt-5 space-y-2 px-2">
              <div className="h-1.5 w-full animate-pulse rounded bg-muted-foreground/20" />
              <div className="h-1.5 w-3/4 animate-pulse rounded bg-muted-foreground/20" />
              <div className="h-1.5 w-full animate-pulse rounded bg-muted-foreground/20" />
              <div className="h-1.5 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
            </div>
          </div>
          {/* Corner fold */}
          <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-bl border-b-2 border-l-2 border-muted-foreground/30 bg-background" />
        </div>
        <div className="text-sm text-muted-foreground">Loading document...</div>
      </div>
    </div>
  );
}
