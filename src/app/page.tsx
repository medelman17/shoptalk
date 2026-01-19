import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { Button } from "@/components/ui/button";

/**
 * Home page - handles routing based on auth state.
 *
 * - Not authenticated: Show landing page with sign-in CTA
 * - Authenticated, no onboarding: Redirect to /onboarding
 * - Authenticated, onboarding complete: Show main app
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

  // Onboarding complete - show main app dashboard
  return <Dashboard profile={profile} />;
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

interface DashboardProps {
  profile: {
    local_number: string | null;
    classification: string | null;
    email: string | null;
  } | null;
}

function Dashboard({ profile }: DashboardProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b bg-white px-4 py-4 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            ShopTalk
          </h1>
          <Button asChild variant="ghost" size="sm">
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border bg-white p-6 dark:bg-zinc-900">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Welcome back!
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {profile?.local_number
                ? `Local ${profile.local_number} • ${profile.classification || "Member"}`
                : "Your profile is set up and ready."}
            </p>

            <div className="mt-6 rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Coming soon:</strong> The contract query interface is
                being built. You&apos;ll be able to ask questions about your
                contract and get cited answers.
              </p>
            </div>

            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/settings">View Your Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
