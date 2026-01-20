/**
 * Conversations API route for listing and creating conversations.
 *
 * Uses Mastra Memory threads for storage when DATABASE_URL is set.
 * Falls back gracefully when memory is not configured.
 */

import type { Memory } from "@mastra/memory";
import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { mastra } from "@/mastra";

/**
 * Generate a title from the first message content.
 * Truncates to first 50 chars and adds ellipsis if needed.
 */
function generateTitleFromMessage(content: string): string {
  const cleaned = content.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 50) {
    return cleaned;
  }
  return cleaned.substring(0, 47) + "...";
}

/**
 * GET /api/conversations
 *
 * List conversations (threads) for the current user from Mastra Memory.
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

    // 4. Get memory from agent (cast to Memory for full API access)
    const agent = mastra.getAgent("contractAgent");
    const memory = (await agent.getMemory()) as Memory | null;

    if (!memory) {
      // Memory not configured - return empty array
      return NextResponse.json({ conversations: [] });
    }

    // 5. List threads from Mastra Memory
    const result = await memory.listThreads({
      filter: { resourceId: profile.id },
      page: 0,
      perPage: limit,
      orderBy: {
        field: "updatedAt",
        direction: "DESC",
      },
    });

    // 6. Transform to conversation format expected by frontend
    const conversations = result.threads.map((thread) => ({
      id: thread.id,
      user_id: thread.resourceId,
      title: thread.title ?? null,
      created_at: thread.createdAt instanceof Date
        ? thread.createdAt.toISOString()
        : thread.createdAt,
      updated_at: thread.updatedAt instanceof Date
        ? thread.updatedAt.toISOString()
        : thread.updatedAt,
    }));

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
 * Create a new conversation (thread) in Mastra Memory.
 * The initial message is NOT saved here - it will be saved automatically
 * when the chat is sent via the /api/chat route with memory enabled.
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

    // 5. Get memory from agent (cast to Memory for full API access)
    const agent = mastra.getAgent("contractAgent");
    const memory = (await agent.getMemory()) as Memory | null;

    if (!memory) {
      // Memory not configured - return a generated ID
      // The chat will work without persistence
      const generatedId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return NextResponse.json(
        {
          conversation: {
            id: generatedId,
            user_id: profile.id,
            title: conversationTitle,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          message: null,
        },
        { status: 201 }
      );
    }

    // 6. Create thread in Mastra Memory
    const thread = await memory.createThread({
      resourceId: profile.id,
      title: conversationTitle ?? undefined,
      metadata: {
        createdVia: "api",
      },
    });

    // 7. Return the created conversation
    // Note: Initial message is NOT saved here - it will be saved when chat is sent
    return NextResponse.json(
      {
        conversation: {
          id: thread.id,
          user_id: thread.resourceId,
          title: thread.title ?? null,
          created_at: thread.createdAt instanceof Date
            ? thread.createdAt.toISOString()
            : thread.createdAt,
          updated_at: thread.updatedAt instanceof Date
            ? thread.updatedAt.toISOString()
            : thread.updatedAt,
        },
        message: null, // Message will be saved via /api/chat with memory
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/conversations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
