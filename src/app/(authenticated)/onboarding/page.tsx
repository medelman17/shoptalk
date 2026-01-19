import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Complete Your Profile - ShopTalk",
  description: "Set up your union profile to get personalized contract information",
};

/**
 * Onboarding page for new users to set up their union profile.
 *
 * Captures:
 * - Local union number
 * - Job classification
 *
 * Determines applicable contract documents based on Local number.
 */
export default async function OnboardingPage() {
  // Get authenticated user
  const clerkId = await requireAuth();

  // Fetch user profile
  const profile = await getUserProfile(clerkId);

  // If already completed onboarding, redirect to main app
  if (isOnboardingComplete(profile)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to ShopTalk
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Let&apos;s set up your profile so we can show you the contract
            documents that apply to your Local.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Union Profile</CardTitle>
            <CardDescription>
              This information helps us find the right contract language for
              your questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          You can change these settings later in your profile.
        </p>
      </div>
    </div>
  );
}
