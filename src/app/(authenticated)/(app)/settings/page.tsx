import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getUserProfile } from "@/lib/db/user-profile";
import { SettingsForm } from "@/components/onboarding/settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Settings - ShopTalk",
  description: "Manage your union profile settings",
};

/**
 * Settings page for users to update their union profile.
 *
 * Allows changing:
 * - Local union number
 * - Job classification
 *
 * Updates are reflected in contract document scope.
 */
export default async function SettingsPage() {
  // Get authenticated user
  const clerkId = await requireAuth();

  // Fetch user profile
  const profile = await getUserProfile(clerkId);

  // This should not happen as layout ensures onboarding is complete,
  // but handle it gracefully
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Unable to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Profile Settings
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Update your union profile to change which contract documents apply
            to you.
          </p>
        </div>

        {/* Settings form card */}
        <Card>
          <CardHeader>
            <CardTitle>Union Profile</CardTitle>
            <CardDescription>
              Changes to your Local will update the contract documents used for
              your queries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm
              initialValues={{
                localNumber: profile.local_number ?? "",
                classification: profile.classification ?? "",
              }}
            />
          </CardContent>
        </Card>

        {/* Account info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Email
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {profile.email ?? "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Member since
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
