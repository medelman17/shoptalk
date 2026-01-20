/**
 * PDF viewer toolbar with navigation and zoom controls.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface PdfToolbarProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Current zoom level (1 = 100%) */
  zoom: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when zoom changes */
  onZoomChange: (zoom: number) => void;
  /** Optional class name */
  className?: string;
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function PdfToolbar({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomChange,
  className,
}: PdfToolbarProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));

  // Sync input with current page when it changes externally
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      // Reset to current page if invalid
      setPageInput(String(currentPage));
    }
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    const nextIndex = Math.min(currentIndex + 1, ZOOM_LEVELS.length - 1);
    onZoomChange(ZOOM_LEVELS[nextIndex] ?? zoom);
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.findIndex((z) => z >= zoom);
    const prevIndex = Math.max(currentIndex - 1, 0);
    onZoomChange(ZOOM_LEVELS[prevIndex] ?? zoom);
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in the input
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goToPreviousPage();
          break;
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          goToNextPage();
          break;
        case "Home":
          e.preventDefault();
          onPageChange(1);
          break;
        case "End":
          e.preventDefault();
          onPageChange(totalPages);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPreviousPage, goToNextPage, onPageChange, totalPages]);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur",
        className
      )}
    >
      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
          <Input
            type="text"
            inputMode="numeric"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            className="h-8 w-14 text-center text-sm"
            aria-label="Page number"
          />
          <span className="text-sm text-muted-foreground">of {totalPages}</span>
        </form>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_LEVELS[0]}
          aria-label="Zoom out"
        >
          <ZoomOutIcon className="h-4 w-4" />
        </Button>

        <span className="min-w-[4rem] text-center text-sm text-muted-foreground">
          {zoomPercent}%
        </span>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
          aria-label="Zoom in"
        >
          <ZoomInIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomReset}
          disabled={zoom === 1}
          aria-label="Reset zoom"
        >
          <RotateCcwIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
