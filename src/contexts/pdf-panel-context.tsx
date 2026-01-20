"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PdfPanelState {
  documentId: string | null;
  page: number;
  isOpen: boolean;
}

interface PdfPanelContextValue {
  state: PdfPanelState;
  openPdf: (documentId: string, page?: number) => void;
  closePdf: () => void;
  setPage: (page: number) => void;
}

const PdfPanelContext = createContext<PdfPanelContextValue | null>(null);

export function usePdfPanel() {
  const context = useContext(PdfPanelContext);
  if (!context) {
    throw new Error("usePdfPanel must be used within a PdfPanelProvider");
  }
  return context;
}

interface PdfPanelProviderProps {
  children: ReactNode;
}

export function PdfPanelProvider({ children }: PdfPanelProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive state from URL params
  const state: PdfPanelState = useMemo(() => {
    const documentId = searchParams.get("doc");
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    return {
      documentId,
      page: isNaN(page) || page < 1 ? 1 : page,
      isOpen: !!documentId,
    };
  }, [searchParams]);

  // Open a PDF document (shallow navigation - preserves state)
  const openPdf = useCallback(
    (documentId: string, page: number = 1) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("doc", documentId);
      params.set("page", String(page));
      // Use replace with scroll:false for shallow update
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Close the PDF panel
  const closePdf = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Change the current page (without adding to history)
  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const value: PdfPanelContextValue = useMemo(
    () => ({
      state,
      openPdf,
      closePdf,
      setPage,
    }),
    [state, openPdf, closePdf, setPage]
  );

  return (
    <PdfPanelContext.Provider value={value}>
      {children}
    </PdfPanelContext.Provider>
  );
}
