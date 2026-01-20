"use client";

import { useChat, Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo } from "react";
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

  const { messages, sendMessage, status, error } = useChat({ chat });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const handleCitationClick = (citation: Citation) => {
    // Future: Could open a modal with the full source text
    // or navigate to a document viewer
    console.log("Citation clicked:", citation);
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;
    setInput("");
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
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                Something went wrong. Please try again.
              </p>
            </div>
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
            />
            <PromptInputFooter>
              <div className="text-xs text-muted-foreground">
                Press Enter to send
              </div>
              <PromptInputSubmit
                status={status}
                disabled={isLoading || !input.trim()}
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
