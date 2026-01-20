import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

/**
 * Citation type for messages
 */
export interface MessageCitation {
  source: string;
  text: string;
  page?: number;
  section?: string;
}


/**
 * Message type (will be added to types.ts after migration + type generation)
 */
export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  citations: MessageCitation[] | null;
  created_at: string;
}

export interface MessageInsert {
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  citations?: MessageCitation[] | null;
}

export interface MessageUpdate {
  content?: string;
  citations?: MessageCitation[] | null;
}

/**
 * Add a message to a conversation.
 *
 * @param conversationId - The conversation UUID
 * @param role - The message role ('user' or 'assistant')
 * @param content - The message content
 * @param citations - Optional array of citations
 * @returns The created message
 */
export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  citations?: MessageCitation[] | null
): Promise<Message> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
      citations: (citations ?? []) as unknown as Json,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding message:", error);
    throw error;
  }

  return {
    ...data,
    role: data.role as "user" | "assistant",
    citations: (data.citations as unknown as MessageCitation[]) ?? [],
  } as Message;
}

/**
 * Get all messages for a conversation, ordered by creation time.
 *
 * @param conversationId - The conversation UUID
 * @returns Array of messages, oldest first
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  return (data ?? []).map((msg) => ({
    ...msg,
    role: msg.role as "user" | "assistant",
    citations: (msg.citations as unknown as MessageCitation[]) ?? [],
  })) as Message[];
}

/**
 * Update a message's content and/or citations.
 *
 * @param messageId - The message UUID
 * @param updates - The fields to update
 * @returns The updated message
 */
export async function updateMessage(
  messageId: string,
  updates: MessageUpdate
): Promise<Message> {
  const supabase = createAdminClient();

  const dbUpdates: { content?: string; citations?: Json } = {};
  if (updates.content !== undefined) {
    dbUpdates.content = updates.content;
  }
  if (updates.citations !== undefined) {
    dbUpdates.citations = (updates.citations ?? []) as unknown as Json;
  }

  const { data, error } = await supabase
    .from("messages")
    .update(dbUpdates)
    .eq("id", messageId)
    .select()
    .single();

  if (error) {
    console.error("Error updating message:", error);
    throw error;
  }

  return {
    ...data,
    role: data.role as "user" | "assistant",
    citations: (data.citations as unknown as MessageCitation[]) ?? [],
  } as Message;
}

/**
 * Get the last message in a conversation.
 *
 * @param conversationId - The conversation UUID
 * @returns The last message or null if no messages
 */
export async function getLastMessage(
  conversationId: string
): Promise<Message | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching last message:", error);
    throw error;
  }

  return {
    ...data,
    role: data.role as "user" | "assistant",
    citations: (data.citations as unknown as MessageCitation[]) ?? [],
  } as Message;
}

/**
 * Delete a message.
 *
 * @param messageId - The message UUID
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

/**
 * Get the count of messages in a conversation.
 *
 * @param conversationId - The conversation UUID
 * @returns The message count
 */
export async function getMessageCount(conversationId: string): Promise<number> {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("conversation_id", conversationId);

  if (error) {
    console.error("Error counting messages:", error);
    throw error;
  }

  return count ?? 0;
}
