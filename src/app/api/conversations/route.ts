/**
 * Conversations API route for listing and creating conversations.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import {
  createConversation,
  getUserConversations,
  generateTitleFromMessage,
} from "@/lib/db/conversations";
import { addMessage } from "@/lib/db/messages";

/**
 * GET /api/conversations
 *
 * List conversations for the current user.
 */
export async function GET(request: NextRequest) {
  try {
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

    // 3. Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? "50", 10),
      100
    );

    // 4. Fetch conversations
    const conversations = await getUserConversations(profile.id, limit);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 *
 * Create a new conversation, optionally with an initial message.
 */
export async function POST(request: NextRequest) {
  try {
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

    // 3. Parse request body
    const body = await request.json();
    const { title, initialMessage } = body;

    // 4. Generate title from initial message if not provided
    let conversationTitle = title;
    if (!conversationTitle && initialMessage) {
      conversationTitle = generateTitleFromMessage(initialMessage);
    }

    // 5. Create conversation
    const conversation = await createConversation(profile.id, conversationTitle);

    // 6. Add initial message if provided
    if (initialMessage && typeof initialMessage === "string") {
      await addMessage(conversation.id, "user", initialMessage.trim());
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/conversations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
