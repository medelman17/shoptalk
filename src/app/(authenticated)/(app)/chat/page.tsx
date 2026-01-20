import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { createConversation } from "@/lib/db/conversations";

export const metadata = {
  title: "New Chat - ShopTalk",
  description: "Start a new conversation about your UPS Teamster contract",
};

/**
 * New chat page - creates a conversation and redirects.
 *
 * This page creates a new conversation for the user and redirects
 * to the conversation page. This enables the "New Chat" button pattern.
 */
export default async function NewChatPage() {
  // Get authenticated user
  const clerkId = await requireAuth();

  // Fetch user profile
  const profile = await getUserProfile(clerkId);

  // Redirect to onboarding if not completed
  if (!isOnboardingComplete(profile)) {
    redirect("/onboarding");
  }

  // Create a new conversation
  let conversationId: string;
  try {
    const conversation = await createConversation(profile!.id);
    conversationId = conversation.id;
  } catch (error) {
    // If conversation creation fails (e.g., table doesn't exist yet),
    // show a fallback chat interface
    console.error("Failed to create conversation:", error);

    // Return a client-side component that handles the legacy flow
    const { LegacyChatPage } = await import("./legacy-chat");
    return <LegacyChatPage />;
  }

  // Redirect to the new conversation
  redirect(`/chat/${conversationId}`);
}
