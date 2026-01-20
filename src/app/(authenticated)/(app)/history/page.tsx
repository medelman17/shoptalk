/**
 * Query history page.
 *
 * Lists all past queries with links to view full details.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getRecentQueries } from "@/lib/db/queries";
import { QueryList } from "@/components/history";
import { Button } from "@/components/ui/button";
import { MessageSquarePlusIcon } from "lucide-react";

export const metadata = {
  title: "Query History | ShopTalk",
  description: "View your past contract questions and answers",
};

export default async function HistoryPage() {
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

  // 3. Fetch recent queries
  const queries = await getRecentQueries(profile.id, 50);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Query History</h1>
          <p className="text-sm text-muted-foreground">
            Your past questions and answers
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/chat">
            <MessageSquarePlusIcon className="h-4 w-4" />
            <span>New Question</span>
          </Link>
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <QueryList queries={queries} />
        </div>
      </div>
    </div>
  );
}
