import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { ChatClient } from "@/components/chat/chat-client";

export const metadata = {
  title: "New Chat - ShopTalk",
  description: "Start a new conversation about your UPS Teamster contract",
};

/**
 * New chat page - renders ChatClient without a conversation.
 *
 * The conversation will be created lazily when the user sends their
 * first message. This prevents empty conversations from accumulating
 * in the sidebar when users navigate away without sending a message.
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

  // Render ChatClient without conversationId - conversation created on first message
  return <ChatClient />;
}
