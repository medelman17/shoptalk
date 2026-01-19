import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for main app routes that require completed onboarding.
 *
 * This layout checks if the user has completed onboarding and
 * redirects to /onboarding if not. The onboarding page itself
 * is outside this route group to avoid redirect loops.
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

  return <>{children}</>;
}
