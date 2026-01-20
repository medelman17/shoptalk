/**
 * Client component wrapper for the PDF viewer.
 *
 * Adds navigation header with back button on top of the PDF viewer.
 */

"use client";

import { PdfViewer } from "@/components/pdf";
import { BackButton } from "@/components/ui/back-button";

interface PdfViewerClientProps {
  url: string;
  title: string;
  initialPage: number;
  documentId: string;
}

export function PdfViewerClient({
  url,
  title,
  initialPage,
}: PdfViewerClientProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header with back navigation */}
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <BackButton fallbackHref="/chat" label="Back to Chat" />
        <div className="h-5 w-px bg-border" />
        <h1 className="truncate text-lg font-semibold">{title}</h1>
      </header>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <PdfViewer
          url={url}
          initialPage={initialPage}
          className="h-full"
        />
      </div>
    </div>
  );
}
