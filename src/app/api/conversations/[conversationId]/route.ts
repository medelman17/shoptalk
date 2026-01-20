/**
 * Conversation detail API route for getting, updating, and deleting a conversation.
 *
 * Uses Mastra Memory threads for storage when DATABASE_URL is set.
 */

import { toAISdkV5Messages } from "@mastra/ai-sdk/ui";
import type { Memory } from "@mastra/memory";
import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { mastra } from "@/mastra";

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

/**
 * GET /api/conversations/[conversationId]
 *
 * Get a conversation (thread) with its messages from Mastra Memory.
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

    // 3. Get memory from agent
    const agent = mastra.getAgent("contractAgent");
    const memory = await agent.getMemory();

    if (!memory) {
      return NextResponse.json(
        { error: "Memory not configured" },
        { status: 500 }
      );
    }

    // 4. Get thread by ID
    const thread = await memory.getThreadById({ threadId: conversationId });

    if (!thread) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 5. Check ownership (thread belongs to this user)
    if (thread.resourceId !== profile.id) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 6. Get messages from memory
    let messages: unknown[] = [];
    try {
      const response = await memory.recall({
        threadId: conversationId,
        resourceId: profile.id,
      });
      messages = toAISdkV5Messages(response?.messages || []);
    } catch {
      // No messages yet
    }

    // 7. Transform to expected format
    const conversation = {
      id: thread.id,
      user_id: thread.resourceId,
      title: thread.title ?? null,
      created_at: thread.createdAt instanceof Date
        ? thread.createdAt.toISOString()
        : thread.createdAt,
      updated_at: thread.updatedAt instanceof Date
        ? thread.updatedAt.toISOString()
        : thread.updatedAt,
    };

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
 * Note: Mastra Memory doesn't have a direct updateThread method,
 * so we update via the storage layer.
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

    // 3. Parse request body
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // 4. Get memory from agent (cast to Memory for full API access)
    const agent = mastra.getAgent("contractAgent");
    const memory = (await agent.getMemory()) as Memory | null;

    if (!memory) {
      return NextResponse.json(
        { error: "Memory not configured" },
        { status: 500 }
      );
    }

    // 5. Get thread to verify ownership
    const thread = await memory.getThreadById({ threadId: conversationId });

    if (!thread) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (thread.resourceId !== profile.id) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 6. Update thread title via Memory API
    await memory.updateThread({
      id: conversationId,
      title: title.trim(),
      metadata: (thread.metadata as Record<string, unknown>) || {},
    });

    // 7. Return updated conversation
    const conversation = {
      id: thread.id,
      user_id: thread.resourceId,
      title: title.trim(),
      created_at: thread.createdAt instanceof Date
        ? thread.createdAt.toISOString()
        : thread.createdAt,
      updated_at: new Date().toISOString(),
    };

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
 * Delete a conversation (thread) and all its messages from Mastra Memory.
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

    // 3. Get memory from agent (cast to Memory for full API access)
    const agent = mastra.getAgent("contractAgent");
    const memory = (await agent.getMemory()) as Memory | null;

    if (!memory) {
      return NextResponse.json(
        { error: "Memory not configured" },
        { status: 500 }
      );
    }

    // 4. Get thread to verify ownership
    const thread = await memory.getThreadById({ threadId: conversationId });

    if (!thread) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (thread.resourceId !== profile.id) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 5. Delete thread via Memory API
    await memory.deleteThread(conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/conversations/[conversationId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
