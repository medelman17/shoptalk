/**
 * Query detail page.
 *
 * Shows a single query with full question, answer, and citations.
 */

import { notFound, redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getQueryById } from "@/lib/db/queries";
import { QueryDetailClient } from "./query-detail-client";

interface PageProps {
  params: Promise<{ queryId: string }>;
}

export default async function QueryDetailPage({ params }: PageProps) {
  const { queryId } = await params;

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

  // 3. Fetch query
  const query = await getQueryById(queryId);
  if (!query) {
    notFound();
  }

  // 4. Verify ownership
  if (query.user_id !== profile.id) {
    notFound();
  }

  return <QueryDetailClient query={query} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { queryId } = await params;
  const query = await getQueryById(queryId);

  const title = query
    ? `${query.question.slice(0, 50)}${query.question.length > 50 ? "..." : ""}`
    : "Query";

  return {
    title: `${title} | ShopTalk`,
    description: "View question and answer details",
  };
}
