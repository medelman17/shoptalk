import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { Button } from "@/components/ui/button";

/**
 * Home page - handles routing based on auth state.
 *
 * - Not authenticated: Show landing page with sign-in CTA
 * - Authenticated, no onboarding: Redirect to /onboarding
 * - Authenticated, onboarding complete: Redirect to /chat
 */
export default async function Home() {
  const { userId } = await auth();

  // Not authenticated - show landing page
  if (!userId) {
    return <LandingPage />;
  }

  // Authenticated - check onboarding status
  const profile = await getUserProfile(userId);

  if (!isOnboardingComplete(profile)) {
    redirect("/onboarding");
  }

  // Onboarding complete - redirect to chat
  redirect("/chat");
}

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          ShopTalk
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          AI-powered contract assistant for UPS Teamsters. Get instant answers
          to your contract questions.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          Find contract language fast. Know your rights.
        </p>
      </div>
    </div>
  );
}
