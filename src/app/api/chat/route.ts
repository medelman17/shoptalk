/**
 * Chat API route for contract Q&A.
 *
 * Handles streaming conversations with the contract agent, enforcing
 * document scope based on the user's Local union number.
 */

import { handleChatStream } from "@mastra/ai-sdk";
import { RequestContext } from "@mastra/core/request-context";
import { createUIMessageStreamResponse } from "ai";
import type { UIMessage } from "ai";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getDocumentScope } from "@/lib/union";
import { mastra } from "@/mastra";

/**
 * Request body expected from the client (useChat hook).
 */
interface ChatRequestBody {
  messages: UIMessage[];
}

/**
 * POST /api/chat
 *
 * Streams contract Q&A responses with RAG-based retrieval.
 * Requires authentication and completed onboarding.
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
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request: messages required", { status: 400 });
    }

    // 4. Determine document scope based on user's Local
    const localNumber = profile.local_number
      ? parseInt(profile.local_number, 10)
      : null;

    const documentIds = localNumber
      ? getDocumentScope(localNumber)
      : ["master"]; // Fallback to master only

    // 5. Build request context for the contract query tool
    const requestContext = new RequestContext<{ documentIds: string[] }>([
      ["documentIds", documentIds],
    ]);

    // 6. Stream the response using Mastra's AI SDK integration
    const stream = await handleChatStream({
      mastra,
      agentId: "contract-agent",
      params: {
        messages,
        requestContext: requestContext as RequestContext,
      },
      sendStart: true,
      sendFinish: true,
      sendReasoning: false,
      sendSources: false, // We handle citations in the message text
    });

    // 7. Return streaming response
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
