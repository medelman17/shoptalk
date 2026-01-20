/**
 * PDF viewer page for contract documents.
 *
 * Renders a full-screen PDF viewer with navigation controls.
 * Supports deep linking to specific pages via ?page=N query param.
 */

import { notFound, redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getDocumentScope } from "@/lib/union";
import { getDocumentById } from "@/lib/documents/manifest";
import { PdfViewerClient } from "./pdf-viewer-client";

interface PageProps {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function PdfViewerPage({ params, searchParams }: PageProps) {
  // 1. Authenticate user
  const userId = await getClerkUserId();
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Get user profile and validate onboarding
  const profile = await getUserProfile(userId);
  if (!profile || !isOnboardingComplete(profile)) {
    redirect("/onboarding");
  }

  // 3. Get params
  const { documentId } = await params;
  const { page } = await searchParams;

  // 4. Validate document exists
  const document = getDocumentById(documentId);
  if (!document) {
    notFound();
  }

  // 5. Check document access
  const localNumber = profile.local_number
    ? parseInt(profile.local_number, 10)
    : null;

  const allowedDocs = localNumber
    ? getDocumentScope(localNumber)
    : ["master"];

  if (!allowedDocs.includes(documentId)) {
    // User doesn't have access to this document
    notFound();
  }

  // 6. Parse initial page number
  const initialPage = page ? Math.max(1, parseInt(page, 10) || 1) : 1;

  // 7. Build PDF URL
  const pdfUrl = `/api/pdf/${documentId}`;

  return (
    <div className="h-full">
      <PdfViewerClient
        url={pdfUrl}
        title={document.shortTitle}
        initialPage={initialPage}
        documentId={documentId}
      />
    </div>
  );
}

/**
 * Generate static params for common documents.
 * This helps with build-time optimization.
 */
export async function generateMetadata({ params }: PageProps) {
  const { documentId } = await params;
  const document = getDocumentById(documentId);

  return {
    title: document ? `${document.shortTitle} | ShopTalk` : "Document | ShopTalk",
    description: document?.title ?? "Contract document viewer",
  };
}
