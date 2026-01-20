"use client";

import { useMemo } from "react";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "./pdf-viewer";
import { DOCUMENT_MANIFEST } from "@/lib/documents/manifest";

interface PdfPanelProps {
  documentId: string;
  page?: number;
  onClose?: () => void;
  className?: string;
}

export function PdfPanel({
  documentId,
  page = 1,
  onClose,
  className,
}: PdfPanelProps) {
  // Look up document metadata from manifest (synchronous)
  const { document, error } = useMemo(() => {
    const doc = DOCUMENT_MANIFEST.find((d) => d.id === documentId);
    if (doc) {
      return { document: doc, error: null };
    }
    return { document: null, error: `Document "${documentId}" not found` };
  }, [documentId]);

  // Build the PDF URL (served via API route)
  const pdfUrl = document ? `/api/pdf/${documentId}` : null;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex-1 min-w-0">
          <h2 className="truncate text-sm font-semibold">
            {document?.title ?? "Loading..."}
          </h2>
          {document?.type && (
            <p className="text-xs text-muted-foreground">
              {document.type === "master"
                ? "Master Agreement"
                : document.type === "supplement"
                ? "Supplement"
                : "Rider"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Open in new tab */}
          {pdfUrl && (
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`/pdf/${documentId}?page=${page}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
                <span className="sr-only">Open in new tab</span>
              </Link>
            </Button>
          )}
          {/* Close button */}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
              <span className="sr-only">Close PDF</span>
            </Button>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <p className="text-destructive font-medium">{error}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The document may have been moved or deleted.
              </p>
            </div>
          </div>
        ) : pdfUrl ? (
          <PdfViewer
            url={pdfUrl}
            initialPage={page}
            className="h-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        )}
      </div>
    </div>
  );
}
