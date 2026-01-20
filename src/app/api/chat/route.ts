/**
 * Chat API route for contract Q&A.
 *
 * Handles streaming conversations with the contract agent, enforcing
 * document scope based on the user's Local union number.
 *
 * Uses Mastra Memory for automatic message persistence:
 * - POST: Streams responses and auto-saves messages to PostgreSQL
 * - GET: Retrieves conversation history from memory
 */

import { handleChatStream } from "@mastra/ai-sdk";
import { toAISdkV5Messages } from "@mastra/ai-sdk/ui";
import { RequestContext } from "@mastra/core/request-context";
import type { Memory } from "@mastra/memory";
import { createUIMessageStreamResponse } from "ai";
import type { UIMessage } from "ai";
import { NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { buildContextHeader, getDocumentScope } from "@/lib/union";
import { mastra } from "@/mastra";

/**
 * Request body expected from the client (useChat hook).
 */
interface ChatRequestBody {
  messages: UIMessage[];
  conversationId?: string; // Thread ID for memory
}

/**
 * POST /api/chat
 *
 * Streams contract Q&A responses with RAG-based retrieval.
 * Requires authentication and completed onboarding.
 *
 * When memory is configured (DATABASE_URL set), messages are automatically
 * persisted to PostgreSQL via Mastra Memory.
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const userId = await getClerkUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Get user profile and validate onboarding
    const profile = await getUserProfile(userId);
    if (!profile || !isOnboardingComplete(profile)) {
      return new Response("Onboarding required", { status: 403 });
    }

    // 3. Parse request body
    const body = (await req.json()) as ChatRequestBody;
    const { messages, conversationId } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request: messages required", {
        status: 400,
      });
    }

    // 4. Determine document scope based on user's Local
    const localNumber = profile.local_number
      ? parseInt(profile.local_number, 10)
      : null;

    const documentIds = localNumber
      ? getDocumentScope(localNumber)
      : ["master"]; // Fallback to master only

    // 5. Build user context header for AI responses
    const userContextHeader = buildContextHeader(
      localNumber,
      profile.classification,
    );

    // 6. Build request context for the contract query tool
    const requestContext = new RequestContext<{
      documentIds: string[];
      userContextHeader: string;
    }>([
      ["documentIds", documentIds],
      ["userContextHeader", userContextHeader],
    ]);

    // 7. Add user context to the latest user message (hidden instruction)
    // The agent is instructed to start responses with this context header
    const lastUserMsgIdx = messages.findLastIndex((m) => m.role === "user");
    const messagesWithContext =
      lastUserMsgIdx >= 0
        ? messages.map((msg, idx) => {
            if (idx === lastUserMsgIdx) {
              const textPart = msg.parts.find((p) => p.type === "text");
              if (textPart && "text" in textPart) {
                return {
                  ...msg,
                  parts: msg.parts.map((p) =>
                    p === textPart
                      ? {
                          ...p,
                          text: `<user_context>\n${userContextHeader}\n</user_context>\n\n${textPart.text}`,
                        }
                      : p,
                  ),
                };
              }
            }
            return msg;
          })
        : messages;

    // 8. Stream the response using Mastra's AI SDK integration
    // Memory params enable automatic message persistence when DATABASE_URL is set
    const stream = await handleChatStream({
      mastra,
      agentId: "contract-agent",
      params: {
        messages: messagesWithContext,
        requestContext: requestContext as RequestContext,
        // Memory configuration for automatic persistence
        // thread = conversation ID, resource = user ID
        ...(conversationId && {
          memory: {
            thread: conversationId,
            resource: profile.id,
          },
        }),
      },
      sendStart: true,
      sendFinish: true,
      sendReasoning: false,
      sendSources: false, // We handle citations in the message text
    });

    // 9. Return streaming response
    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof Error) {
      // Don't expose internal error details to client
      return new Response("An error occurred while processing your request", {
        status: 500,
      });
    }

    return new Response("Internal server error", { status: 500 });
  }
}

/**
 * GET /api/chat
 *
 * Retrieves conversation history from Mastra Memory.
 * Used by the chat client to load previous messages.
 *
 * Query params:
 * - conversationId: The thread ID to retrieve messages for
 */
export async function GET(req: Request) {
  try {
    // 1. Authenticate user
    const userId = await getClerkUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user profile
    const profile = await getUserProfile(userId);
    if (!profile || !isOnboardingComplete(profile)) {
      return NextResponse.json(
        { error: "Onboarding required" },
        { status: 403 },
      );
    }

    // 3. Get conversation ID from query params
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 },
      );
    }

    // 4. Get memory from the agent (cast to Memory for full API access)
    // Note: mastra.getAgent() uses the object key from registration ("contractAgent")
    // while handleChatStream uses the agent's internal id ("contract-agent")
    const agent = mastra.getAgent("contractAgent");
    const memory = (await agent.getMemory()) as Memory | null;

    if (!memory) {
      // Memory not configured - return empty array
      // This happens when DATABASE_URL is not set
      return NextResponse.json([]);
    }

    // 5. Recall messages from memory
    let response = null;
    try {
      response = await memory.recall({
        threadId: conversationId,
        resourceId: profile.id,
      });
    } catch {
      console.log("No previous messages found for thread:", conversationId);
      return NextResponse.json([]);
    }

    // 6. Convert to UI message format
    const uiMessages = toAISdkV5Messages(response?.messages || []);

    return NextResponse.json(uiMessages);
  } catch (error) {
    console.error("GET /api/chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
