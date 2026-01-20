import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Conversation type (will be added to types.ts after migration + type generation)
 */
export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationInsert {
  user_id: string;
  title?: string | null;
}

export interface ConversationUpdate {
  title?: string | null;
}

/**
 * Create a new conversation for a user.
 *
 * @param userId - The internal user profile UUID
 * @param title - Optional title for the conversation
 * @returns The created conversation
 */
export async function createConversation(
  userId: string,
  title?: string | null
): Promise<Conversation> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      title: title ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }

  return data as Conversation;
}

/**
 * Get a conversation by ID.
 *
 * @param conversationId - The conversation UUID
 * @returns The conversation or null if not found
 */
export async function getConversation(
  conversationId: string
): Promise<Conversation | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching conversation:", error);
    throw error;
  }

  return data as Conversation;
}

/**
 * Get all conversations for a user, ordered by most recently updated.
 *
 * @param userId - The internal user profile UUID
 * @param limit - Maximum number of conversations to return (default: 50)
 * @returns Array of conversations, most recently updated first
 */
export async function getUserConversations(
  userId: string,
  limit: number = 50
): Promise<Conversation[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    // Handle table not existing (before migration is applied)
    if (error.code === "42P01" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
      console.warn("Conversations table not found - migration may not be applied yet");
      return [];
    }
    console.error("Error fetching user conversations:", error);
    throw error;
  }

  return (data ?? []) as Conversation[];
}

/**
 * Update a conversation's title.
 *
 * @param conversationId - The conversation UUID
 * @param title - The new title
 * @returns The updated conversation
 */
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<Conversation> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    console.error("Error updating conversation title:", error);
    throw error;
  }

  return data as Conversation;
}

/**
 * Delete a conversation and all its messages.
 *
 * @param conversationId - The conversation UUID
 */
export async function deleteConversation(
  conversationId: string
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
}

/**
 * Check if a user owns a conversation.
 *
 * @param conversationId - The conversation UUID
 * @param userId - The user profile UUID
 * @returns True if the user owns the conversation
 */
export async function userOwnsConversation(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return false;
    }
    console.error("Error checking conversation ownership:", error);
    throw error;
  }

  return !!data;
}

/**
 * Generate a title from the first message content.
 * Truncates to first 50 chars and adds ellipsis if needed.
 *
 * @param content - The message content
 * @returns A truncated title
 */
export function generateTitleFromMessage(content: string): string {
  const cleaned = content.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 50) {
    return cleaned;
  }
  return cleaned.substring(0, 47) + "...";
}
