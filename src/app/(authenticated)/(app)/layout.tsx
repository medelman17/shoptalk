import type { Memory } from "@mastra/memory";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { mastra } from "@/mastra";
import { AppShell } from "@/components/layout";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for main app routes that require completed onboarding.
 *
 * This layout:
 * - Checks authentication and onboarding status
 * - Fetches user's conversations (threads) from Mastra Memory for the sidebar
 * - Provides the app shell with sidebar and split-view support
 */
export default async function AppLayout({ children }: AppLayoutProps) {
  // Get authenticated user
  const clerkId = await requireAuth();

  // Fetch user profile
  const profile = await getUserProfile(clerkId);

  // Redirect to onboarding if not completed
  if (!isOnboardingComplete(profile)) {
    redirect("/onboarding");
  }

  // Fetch user's conversations (threads) from Mastra Memory
  let conversations: Array<{
    id: string;
    title: string | null;
    updated_at: string;
  }> = [];

  if (profile) {
    try {
      const agent = mastra.getAgent("contractAgent");
      const memory = (await agent.getMemory()) as Memory | null;

      if (memory) {
        const result = await memory.listThreads({
          filter: { resourceId: profile.id },
          page: 0,
          perPage: 50,
          orderBy: {
            field: "updatedAt",
            direction: "DESC",
          },
        });

        conversations = result.threads.map((thread) => ({
          id: thread.id,
          title: thread.title ?? null,
          updated_at:
            thread.updatedAt instanceof Date
              ? thread.updatedAt.toISOString()
              : String(thread.updatedAt),
        }));
      }
    } catch (error) {
      // Memory not configured or error - that's fine, show empty sidebar
      console.error("Error loading conversations:", error);
    }
  }

  return <AppShell conversations={conversations}>{children}</AppShell>;
}
