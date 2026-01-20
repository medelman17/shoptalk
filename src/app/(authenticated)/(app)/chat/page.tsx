"use client";

import { useChat, Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UIMessage } from "ai";
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
 * Contract Q&A chat page.
 *
 * Allows users to ask questions about their UPS Teamster contracts
 * and receive AI-generated responses with inline citations.
 */
export default function ChatPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const router = useRouter();

  // Track current query ID for saving answers
  const [currentQueryId, setCurrentQueryId] = useState<string | null>(null);
  const pendingQuestionRef = useRef<string | null>(null);

  // Create the chat instance with the API transport
  const chat = useMemo(
    () =>
      new Chat({
        transport: new DefaultChatTransport({
          api: "/api/chat",
        }),
      }),
    []
  );

  // Save query to history when response completes
  const saveAnswer = useCallback(
    async (answerText: string) => {
      const queryId = currentQueryId;
      if (!queryId) return;

      try {
        // Parse citations from the answer
        const parseResult = parseCitations(answerText);
        const citations = parseResult.citations.map((c) => ({
          source: c.documentId,
          text: c.raw,
          page: c.page,
          section: c.section,
        }));

        // Update query with answer
        await fetch(`/api/queries/${queryId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: answerText, citations }),
        });
      } catch (error) {
        console.error("Failed to save query answer:", error);
      } finally {
        setCurrentQueryId(null);
      }
    },
    [currentQueryId]
  );

  const { messages, sendMessage, status, error } = useChat({ chat });

  // Save answer when streaming completes
  useEffect(() => {
    if (status === "ready" && messages.length > 0 && currentQueryId) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        const answerText = lastMessage.parts
          .filter((part): part is { type: "text"; text: string } => part.type === "text")
          .map((part) => part.text)
          .join("");
        if (answerText) {
          saveAnswer(answerText);
        }
      }
    }
  }, [status, messages, currentQueryId, saveAnswer]);

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
      // Save query to history (question only)
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentQueryId(data.query.id);
        // Track query count for PWA install prompt
        incrementQueryCount();
      }
    } catch (error) {
      console.error("Failed to save query:", error);
    }

    // Send message regardless of save success
    await sendMessage({ text });
  };

  const handleCitationClick = (citation: Citation) => {
    // Navigate to PDF viewer with page number if available
    const pageParam = citation.page ? `?page=${citation.page}` : "";
    router.push(`/pdf/${citation.documentId}${pageParam}`);
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;
    setInput("");
    pendingQuestionRef.current = question;

    try {
      // Save query to history (question only)
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentQueryId(data.query.id);
        // Track query count for PWA install prompt
        incrementQueryCount();
      }
    } catch (error) {
      console.error("Failed to save query:", error);
    }

    await sendMessage({ text: question });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Contract Q&A</h1>
        <p className="text-sm text-muted-foreground">
          Ask questions about your UPS Teamster contract
        </p>
      </header>

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
          {messages.map((message: UIMessage, index: number) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.role === "user" ? (
                  // User messages are plain text
                  <p>{getMessageText(message)}</p>
                ) : (
                  // Assistant messages may have citations
                  <MessageWithCitations
                    content={getMessageText(message)}
                    onCitationClick={handleCitationClick}
                    isStreaming={
                      status === "streaming" &&
                      index === messages.length - 1
                    }
                  />
                )}
              </MessageContent>
            </Message>
          ))}

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
          <PromptInput
            onSubmit={handleSubmit}
          >
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
