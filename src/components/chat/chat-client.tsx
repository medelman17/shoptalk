"use client";

import { useChat, Chat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, getToolName } from "ai";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UIMessage, ToolUIPart, DynamicToolUIPart } from "ai";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message";
import { MessageWithCitations } from "@/components/ai-elements/message-with-citations";
import { Loader } from "@/components/ai-elements/loader";
import type { Citation } from "@/lib/citations";
import { parseCitations } from "@/lib/citations";
import { incrementQueryCount } from "@/lib/pwa/query-counter";
import { CharacterCounter, QUERY_MAX_LENGTH } from "@/components/chat";
import { ErrorDisplay } from "@/components/ui/error-display";
import { createAppError } from "@/lib/errors";
import { AppHeader } from "@/components/layout";
import { usePdfPanel } from "@/contexts/pdf-panel-context";

/**
 * Extract text content from UIMessage parts.
 */
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

/**
 * Extract tool calls from UIMessage parts for progress display.
 */
interface ToolCallInfo {
  toolName: string;
  input: unknown;
  state: string;
}

function getToolCalls(message: UIMessage): ToolCallInfo[] {
  return message.parts
    .filter((part): part is ToolUIPart | DynamicToolUIPart => isToolUIPart(part))
    .map((part) => ({
      toolName: getToolName(part),
      input: part.input,
      state: part.state,
    }));
}

/**
 * Progress indicator showing tool calls (persists after completion).
 */
function ToolCallProgress({ toolCalls, isStreaming }: { toolCalls: ToolCallInfo[]; isStreaming: boolean }) {
  if (toolCalls.length === 0) return null;

  return (
    <div className="mb-3 space-y-1.5 border-l-2 border-muted pl-3">
      {toolCalls.map((call, index) => {
        // Extract search query from input if available
        const input = call.input as Record<string, unknown> | undefined;
        const query = input?.query as string | undefined;
        const isActive = isStreaming && (call.state === "input-streaming" || call.state === "input-available");

        const label = call.toolName === "contractQueryTool"
          ? `Searched: "${query || "contracts"}"`
          : `Ran: ${call.toolName}`;

        return (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            {isActive ? (
              <Loader className="size-3" />
            ) : (
              <svg className="size-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span>{isActive ? label.replace("Searched:", "Searching:").replace("Ran:", "Running:") : label}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Convert database messages to UIMessage format for useChat
 */
interface DbMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function dbMessagesToUIMessages(messages: DbMessage[]): UIMessage[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: "text" as const, text: msg.content }],
    createdAt: new Date(),
  }));
}

interface ChatClientProps {
  conversationId: string;
  conversationTitle?: string | null;
  initialMessages?: DbMessage[];
}

/**
 * Chat client component for conversation Q&A.
 *
 * Handles:
 * - Displaying messages
 * - Sending new messages
 * - Streaming responses
 * - Saving messages to the conversation
 * - Citation click handling (opens PDF panel)
 */
export function ChatClient({
  conversationId,
  conversationTitle,
  initialMessages = [],
}: ChatClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const router = useRouter();
  const { openPdf } = usePdfPanel();

  // Track pending message ID for saving assistant response
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const pendingQuestionRef = useRef<string | null>(null);

  // Convert initial DB messages to UIMessage format
  const initialUIMessages = useMemo(
    () => dbMessagesToUIMessages(initialMessages),
    [initialMessages]
  );

  // Create the chat instance with the API transport and initial messages
  const chat = useMemo(
    () =>
      new Chat({
        transport: new DefaultChatTransport({
          api: "/api/chat",
          body: { conversationId },
        }),
        messages: initialUIMessages,
      }),
    [conversationId, initialUIMessages]
  );

  const { messages, sendMessage, status, error } = useChat({ chat });

  // Save assistant message when streaming completes
  const saveAssistantMessage = useCallback(
    async (answerText: string) => {
      try {
        // Parse citations from the answer
        const parseResult = parseCitations(answerText);
        const citations = parseResult.citations.map((c) => ({
          source: c.documentId,
          text: c.raw,
          page: c.page,
          section: c.section,
        }));

        // Save assistant message to conversation
        await fetch(`/api/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "assistant",
            content: answerText,
            citations,
          }),
        });

        // Refresh the page to update sidebar
        router.refresh();
      } catch (error) {
        console.error("Failed to save assistant message:", error);
      } finally {
        setPendingMessageId(null);
      }
    },
    [conversationId, router]
  );

  // Save answer when streaming completes
  useEffect(() => {
    if (status === "ready" && messages.length > 0 && pendingMessageId) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        const answerText = getMessageText(lastMessage);
        if (answerText) {
          saveAssistantMessage(answerText);
        }
      }
    }
  }, [status, messages, pendingMessageId, saveAssistantMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async () => {
    const text = input.trim();

    // Validate input
    if (!text || isLoading) return;
    if (text.length > QUERY_MAX_LENGTH) return;
    setInput("");
    pendingQuestionRef.current = text;

    try {
      // Save user message to conversation
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: text }),
      });

      if (response.ok) {
        const data = await response.json();
        setPendingMessageId(data.message.id);
        // Track query count for PWA install prompt
        incrementQueryCount();
      }
    } catch (error) {
      console.error("Failed to save user message:", error);
    }

    // Send message regardless of save success
    await sendMessage({ text });
  };

  const handleCitationClick = (citation: Citation) => {
    // Open PDF in the split-view panel instead of navigating
    openPdf(citation.documentId, citation.page ?? 1);
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;
    setInput("");
    pendingQuestionRef.current = question;

    try {
      // Save user message to conversation
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: question }),
      });

      if (response.ok) {
        const data = await response.json();
        setPendingMessageId(data.message.id);
        // Track query count for PWA install prompt
        incrementQueryCount();
      }
    } catch (error) {
      console.error("Failed to save user message:", error);
    }

    await sendMessage({ text: question });
  };

  const title = conversationTitle || "Contract Q&A";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <AppHeader title={title} />

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Welcome message if no conversation yet */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">
                What would you like to know?
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask about overtime, seniority, grievance procedures, benefits,
                or any other contract topic. I&apos;ll search your applicable
                contracts and provide answers with citations.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <SuggestedQuestion
                  question="What are my overtime rights?"
                  onSelect={handleSuggestedQuestion}
                />
                <SuggestedQuestion
                  question="How does seniority work?"
                  onSelect={handleSuggestedQuestion}
                />
                <SuggestedQuestion
                  question="What are the vacation policies?"
                  onSelect={handleSuggestedQuestion}
                />
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((message: UIMessage, index: number) => {
            const isLastMessage = index === messages.length - 1;
            const isStreaming = status === "streaming" && isLastMessage;
            const toolCalls = message.role === "assistant" ? getToolCalls(message) : [];
            const textContent = getMessageText(message);

            return (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === "user" ? (
                    // User messages are plain text
                    <p>{textContent}</p>
                  ) : (
                    // Assistant messages: show tool calls progress + content
                    <>
                      {/* Show tool calls (persists after completion) */}
                      <ToolCallProgress toolCalls={toolCalls} isStreaming={isStreaming} />

                      {/* Show message content (or placeholder if only tool calls so far) */}
                      {textContent ? (
                        <MessageWithCitations
                          content={textContent}
                          onCitationClick={handleCitationClick}
                          isStreaming={isStreaming}
                        />
                      ) : isStreaming && toolCalls.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader className="size-4" />
                          <span>Thinking...</span>
                        </div>
                      ) : null}
                    </>
                  )}
                </MessageContent>
              </Message>
            );
          })}

          {/* Loading indicator */}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <div className="flex items-center gap-2">
                  <Loader />
                  <span className="text-sm text-muted-foreground">
                    Searching contracts...
                  </span>
                </div>
              </MessageContent>
            </Message>
          )}

          {/* Error display */}
          {error && (
            <ErrorDisplay
              error={createAppError(error, {
                onRetry: () => {
                  // Retry the last question if available
                  const lastQuestion = pendingQuestionRef.current;
                  if (lastQuestion) {
                    sendMessage({ text: lastQuestion });
                  }
                },
              })}
            />
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your contract..."
              disabled={isLoading}
              maxLength={QUERY_MAX_LENGTH + 50} // Allow slight overflow for UX
            />
            <PromptInputFooter>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Press Enter to send
                </span>
                <CharacterCounter current={input.length} max={QUERY_MAX_LENGTH} />
              </div>
              <PromptInputSubmit
                status={status}
                disabled={isLoading || !input.trim() || input.length > QUERY_MAX_LENGTH}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

/**
 * Suggested question button for empty state.
 */
function SuggestedQuestion({
  question,
  onSelect,
}: {
  question: string;
  onSelect: (question: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(question)}
      className="rounded-full border bg-background px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {question}
    </button>
  );
}
