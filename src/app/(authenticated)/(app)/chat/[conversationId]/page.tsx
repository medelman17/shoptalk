import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getConversation, userOwnsConversation } from "@/lib/db/conversations";
import { getMessages } from "@/lib/db/messages";
import { ChatClient } from "@/components/chat";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export async function generateMetadata({ params }: ConversationPageProps) {
  const { conversationId } = await params;

  try {
    const conversation = await getConversation(conversationId);
    return {
      title: conversation?.title
        ? `${conversation.title} - ShopTalk`
        : "Chat - ShopTalk",
      description: "Continue your conversation about your UPS Teamster contract",
    };
  } catch {
    return {
      title: "Chat - ShopTalk",
      description: "Chat with ShopTalk about your UPS Teamster contract",
    };
  }
}

/**
 * Conversation page - displays an existing conversation.
 *
 * Loads the conversation and its messages from the database,
 * then renders the ChatClient component for continued interaction.
 */
export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;

  // Get authenticated user
  const clerkId = await requireAuth();

  // Fetch user profile
  const profile = await getUserProfile(clerkId);

  // Redirect to onboarding if not completed
  if (!isOnboardingComplete(profile)) {
    redirect("/onboarding");
  }

  // Verify conversation ownership
  let conversation;
  let messages;

  try {
    const owns = await userOwnsConversation(conversationId, profile!.id);
    if (!owns) {
      notFound();
    }

    // Fetch conversation and messages
    [conversation, messages] = await Promise.all([
      getConversation(conversationId),
      getMessages(conversationId),
    ]);
  } catch (error) {
    // If tables don't exist yet, redirect to chat
    console.error("Error loading conversation:", error);
    redirect("/chat");
  }

  if (!conversation) {
    notFound();
  }

  // Convert messages to the format expected by ChatClient
  const initialMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
  }));

  return (
    <ChatClient
      conversationId={conversationId}
      conversationTitle={conversation.title}
      initialMessages={initialMessages}
    />
  );
}
