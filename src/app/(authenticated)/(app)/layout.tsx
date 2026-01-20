import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getUserConversations } from "@/lib/db/conversations";
import { AppShell } from "@/components/layout";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for main app routes that require completed onboarding.
 *
 * This layout:
 * - Checks authentication and onboarding status
 * - Fetches user's conversations for the sidebar
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

  // Fetch user's conversations for the sidebar
  const conversations = profile
    ? await getUserConversations(profile.id, 50)
    : [];

  return (
    <AppShell conversations={conversations}>
      {children}
    </AppShell>
  );
}
