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
import { AppHeader } from "@/components/layout";

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
      <div className="flex h-full items-center justify-center">
        <p>Unable to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Settings" />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Page description */}
          <div className="mb-8">
            <p className="text-muted-foreground">
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
                <p className="text-sm font-medium">
                  Email
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.email ?? "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  Member since
                </p>
                <p className="text-sm text-muted-foreground">
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
    </div>
  );
}
