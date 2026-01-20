/**
 * Conversation detail API route for getting, updating, and deleting a conversation.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import {
  getConversation,
  updateConversationTitle,
  deleteConversation,
  userOwnsConversation,
} from "@/lib/db/conversations";
import { getMessages } from "@/lib/db/messages";

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

/**
 * GET /api/conversations/[conversationId]
 *
 * Get a conversation with its messages.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // 4. Fetch conversation and messages
    const [conversation, messages] = await Promise.all([
      getConversation(conversationId),
      getMessages(conversationId),
    ]);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation, messages });
  } catch (error) {
    console.error("GET /api/conversations/[conversationId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conversations/[conversationId]
 *
 * Update a conversation's title.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const { title } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // 5. Update conversation
    const conversation = await updateConversationTitle(
      conversationId,
      title.trim()
    );

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("PATCH /api/conversations/[conversationId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations/[conversationId]
 *
 * Delete a conversation and all its messages.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // 4. Delete conversation
    await deleteConversation(conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/conversations/[conversationId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
