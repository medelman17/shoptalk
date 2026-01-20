"use client";

import { type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePdfPanel } from "@/contexts/pdf-panel-context";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Dynamic import to avoid SSR issues with pdf.js (uses DOMMatrix)
const PdfPanel = dynamic(
  () => import("@/components/pdf/pdf-panel").then((mod) => mod.PdfPanel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading PDF viewer...</p>
      </div>
    ),
  }
);

interface SplitViewContainerProps {
  children: ReactNode;
}

export function SplitViewContainer({ children }: SplitViewContainerProps) {
  const { state, closePdf } = usePdfPanel();
  const isMobile = useIsMobile();

  // Mobile: Show PDF in a bottom sheet
  if (isMobile) {
    return (
      <>
        <div className="flex h-full flex-1 flex-col">{children}</div>
        <Sheet
          open={state.isOpen}
          onOpenChange={(open) => {
            if (!open) closePdf();
          }}
        >
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>PDF Viewer</SheetTitle>
            </SheetHeader>
            {state.documentId && (
              <PdfPanel
                documentId={state.documentId}
                page={state.page}
                onClose={closePdf}
              />
            )}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop: Show PDF in resizable split view
  if (!state.isOpen) {
    // No PDF panel - just show the main content
    return <div className="flex h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex h-full flex-col">{children}</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={35}>
        {state.documentId && (
          <PdfPanel
            documentId={state.documentId}
            page={state.page}
            onClose={closePdf}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
