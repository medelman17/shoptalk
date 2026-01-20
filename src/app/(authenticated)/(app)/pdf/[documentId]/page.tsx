/**
 * PDF viewer page for contract documents.
 *
 * Redirects to chat with PDF panel open (split-view).
 * Preserves the document ID and page number in URL params.
 */

import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function PdfViewerPage({ params, searchParams }: PageProps) {
  const { documentId } = await params;
  const { page } = await searchParams;

  // Redirect to chat with PDF panel open via URL params
  const pageParam = page ? `&page=${page}` : "";
  redirect(`/chat?doc=${documentId}${pageParam}`);
}

export const metadata = {
  title: "Document | ShopTalk",
  description: "Contract document viewer",
};
