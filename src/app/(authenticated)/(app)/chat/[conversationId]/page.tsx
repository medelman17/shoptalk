import { toAISdkV5Messages } from "@mastra/ai-sdk/ui";
import type { Memory } from "@mastra/memory";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { mastra } from "@/mastra";
import { ChatClient } from "@/components/chat";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export async function generateMetadata({ params }: ConversationPageProps) {
  const { conversationId } = await params;

  try {
    const agent = mastra.getAgent("contractAgent");
    const memory = (await agent.getMemory()) as Memory | null;
    const thread = await memory?.getThreadById({ threadId: conversationId });

    return {
      title: thread?.title
        ? `${thread.title} - ShopTalk`
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
 * Loads the conversation (thread) and its messages from Mastra Memory,
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

  // Get memory from agent (cast to Memory for full API access)
  const agent = mastra.getAgent("contractAgent");
  const memory = (await agent.getMemory()) as Memory | null;

  if (!memory) {
    // Memory not configured - redirect to new chat
    redirect("/chat");
  }

  // Get thread from Mastra Memory
  let thread;
  try {
    thread = await memory.getThreadById({ threadId: conversationId });
  } catch (error) {
    console.error("Error loading conversation:", error);
    redirect("/chat");
  }

  if (!thread) {
    notFound();
  }

  // Verify ownership (thread belongs to this user)
  if (thread.resourceId !== profile!.id) {
    notFound();
  }

  // Get messages from Mastra Memory
  let initialMessages: unknown[] = [];
  try {
    const response = await memory.recall({
      threadId: conversationId,
      resourceId: profile!.id,
    });
    initialMessages = toAISdkV5Messages(response?.messages || []);
  } catch {
    // No messages yet - that's fine
  }

  return (
    <ChatClient
      conversationId={conversationId}
      conversationTitle={thread.title ?? null}
      initialMessages={initialMessages as import("ai").UIMessage[]}
    />
  );
}
