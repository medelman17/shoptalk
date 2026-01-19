import { createClient } from "@/lib/supabase/server";
import type { Query, Citation, Json } from "@/lib/supabase/types";

/**
 * Save a new query to the history.
 *
 * @param userId - The internal user profile UUID
 * @param question - The user's question
 * @param answer - The AI-generated answer (optional if streaming)
 * @param citations - Array of citations for the answer
 * @returns The created query record
 */
export async function saveQuery(
  userId: string,
  question: string,
  answer?: string,
  citations?: Citation[]
): Promise<Query> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("queries")
    .insert({
      user_id: userId,
      question,
      answer: answer ?? null,
      citations: (citations ?? []) as Json,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving query:", error);
    throw error;
  }

  return data;
}

/**
 * Update an existing query (e.g., to add the answer after streaming completes).
 *
 * @param queryId - The query UUID
 * @param updates - The fields to update
 * @returns The updated query
 */
export async function updateQuery(
  queryId: string,
  updates: { answer?: string; citations?: Citation[] }
): Promise<Query> {
  const supabase = await createClient();

  const dbUpdates: { answer?: string; citations?: Json } = {};
  if (updates.answer !== undefined) {
    dbUpdates.answer = updates.answer;
  }
  if (updates.citations !== undefined) {
    dbUpdates.citations = updates.citations as Json;
  }

  const { data, error } = await supabase
    .from("queries")
    .update(dbUpdates)
    .eq("id", queryId)
    .select()
    .single();

  if (error) {
    console.error("Error updating query:", error);
    throw error;
  }

  return data;
}

/**
 * Get recent queries for a user.
 *
 * @param userId - The internal user profile UUID
 * @param limit - Maximum number of queries to return (default: 20)
 * @returns Array of queries, most recent first
 */
export async function getRecentQueries(
  userId: string,
  limit: number = 20
): Promise<Query[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent queries:", error);
    throw error;
  }

  return data;
}

/**
 * Get a single query by ID.
 *
 * @param queryId - The query UUID
 * @returns The query or null if not found
 */
export async function getQueryById(queryId: string): Promise<Query | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .eq("id", queryId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching query:", error);
    throw error;
  }

  return data;
}

/**
 * Search queries by question text.
 *
 * @param userId - The internal user profile UUID
 * @param searchText - Text to search for in questions
 * @param limit - Maximum results (default: 10)
 * @returns Matching queries
 */
export async function searchQueries(
  userId: string,
  searchText: string,
  limit: number = 10
): Promise<Query[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .eq("user_id", userId)
    .ilike("question", `%${searchText}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error searching queries:", error);
    throw error;
  }

  return data;
}

/**
 * Delete a query from history.
 *
 * @param queryId - The query UUID
 */
export async function deleteQuery(queryId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("queries").delete().eq("id", queryId);

  if (error) {
    console.error("Error deleting query:", error);
    throw error;
  }
}
