/**
 * Messages API route for adding messages to a conversation.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import {
  userOwnsConversation,
  updateConversationTitle,
  getConversation,
  generateTitleFromMessage,
} from "@/lib/db/conversations";
import { addMessage, getMessageCount, type MessageCitation } from "@/lib/db/messages";

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

/**
 * POST /api/conversations/[conversationId]/messages
 *
 * Add a message to a conversation.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params;

    // 1. Authenticate user
    const clerkId = await getClerkUserId();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user profile
    const profile = await getUserProfile(clerkId);
    if (!profile || !isOnboardingComplete(profile)) {
      return NextResponse.json(
        { error: "Onboarding required" },
        { status: 403 }
      );
    }

    // 3. Check ownership
    const owns = await userOwnsConversation(conversationId, profile.id);
    if (!owns) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 4. Parse request body
    const body = await request.json();
    const { role, content, citations } = body;

    // Validate role
    if (!role || !["user", "assistant"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    // Validate content
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Validate citations if provided
    let validatedCitations: MessageCitation[] | null = null;
    if (citations) {
      if (!Array.isArray(citations)) {
        return NextResponse.json(
          { error: "Citations must be an array" },
          { status: 400 }
        );
      }
      validatedCitations = citations as MessageCitation[];
    }

    // 5. Add message
    const message = await addMessage(
      conversationId,
      role,
      content.trim(),
      validatedCitations
    );

    // 6. Auto-generate title from first user message if conversation has no title
    if (role === "user") {
      const [conversation, messageCount] = await Promise.all([
        getConversation(conversationId),
        getMessageCount(conversationId),
      ]);

      // Only set title on first user message (conversation has no title yet)
      if (conversation && !conversation.title && messageCount <= 2) {
        const title = generateTitleFromMessage(content);
        await updateConversationTitle(conversationId, title);
      }
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error(
      "POST /api/conversations/[conversationId]/messages error:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
