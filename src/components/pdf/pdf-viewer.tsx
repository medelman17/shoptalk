/**
 * PDF viewer component using react-pdf.
 *
 * Displays contract PDFs with page navigation and zoom controls.
 * Supports pinch-to-zoom on mobile devices.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { PdfToolbar } from "./pdf-toolbar";
import { PdfLoading } from "./pdf-loading";
import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  /** URL to the PDF document */
  url: string;
  /** Document title for display */
  title?: string;
  /** Initial page to display (1-indexed) */
  initialPage?: number;
  /** Optional class name */
  className?: string;
}

interface PdfLoadSuccess {
  numPages: number;
}

export function PdfViewer({
  url,
  title,
  initialPage = 1,
  className,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  // Handle document load success
  const handleLoadSuccess = useCallback(
    ({ numPages }: PdfLoadSuccess) => {
      setNumPages(numPages);
      setError(null);
      // Ensure initial page is within bounds
      if (initialPage > numPages) {
        setCurrentPage(numPages);
      } else if (initialPage < 1) {
        setCurrentPage(1);
      } else {
        setCurrentPage(initialPage);
      }
    },
    [initialPage]
  );

  // Handle document load error
  const handleLoadError = useCallback((error: Error) => {
    console.error("PDF load error:", error);
    setError("Failed to load document. Please try again.");
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (numPages && page >= 1 && page <= numPages) {
        setCurrentPage(page);
      }
    },
    [numPages]
  );

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  // Track container width for responsive sizing
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById("pdf-container");
      if (container) {
        // Account for padding (16px * 2 = 32px)
        setContainerWidth(container.clientWidth - 32);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Handle pinch-to-zoom on mobile
  useEffect(() => {
    let initialDistance: number | null = null;
    let initialZoom = zoom;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.hypot(dx, dy);
        initialZoom = zoom;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        const scale = distance / initialDistance;
        const newZoom = Math.min(Math.max(initialZoom * scale, 0.5), 2);
        setZoom(newZoom);
      }
    };

    const handleTouchEnd = () => {
      initialDistance = null;
    };

    const container = document.getElementById("pdf-container");
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [zoom]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header with title */}
      {title && (
        <div className="border-b px-4 py-3">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      )}

      {/* Toolbar - only show after document loads */}
      {numPages && (
        <PdfToolbar
          currentPage={currentPage}
          totalPages={numPages}
          zoom={zoom}
          onPageChange={handlePageChange}
          onZoomChange={handleZoomChange}
        />
      )}

      {/* Document container */}
      <div
        id="pdf-container"
        className="flex-1 overflow-auto bg-muted/30 p-4"
      >
        {error ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircleIcon className="h-12 w-12 text-destructive" />
              <div>
                <p className="font-medium text-destructive">{error}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The document may be unavailable or you may not have access.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={<PdfLoading />}
            className="flex justify-center"
          >
            <Page
              pageNumber={currentPage}
              width={containerWidth ? containerWidth * zoom : undefined}
              loading={<PdfLoading />}
              className="shadow-lg"
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>
        )}
      </div>

      {/* Footer with page indicator (mobile-friendly) */}
      {numPages && (
        <div className="border-t bg-background px-4 py-2 text-center text-sm text-muted-foreground md:hidden">
          Page {currentPage} of {numPages}
        </div>
      )}
    </div>
  );
}
