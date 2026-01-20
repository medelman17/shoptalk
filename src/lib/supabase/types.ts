/**
 * Supabase type definitions.
 *
 * This file re-exports the auto-generated types from database.types.ts
 * and provides convenience type aliases for common use cases.
 *
 * To regenerate types after schema changes:
 * SUPABASE_PROJECT_ID=xxx pnpm db:generate-types
 */

export type {
  Database,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.types";

import type { Tables, TablesInsert, TablesUpdate, Json } from "./database.types";

// Convenience types for user_profiles table
export type UserProfile = Tables<"user_profiles">;
export type UserProfileInsert = TablesInsert<"user_profiles">;
export type UserProfileUpdate = TablesUpdate<"user_profiles">;

// Convenience types for queries table
export type Query = Tables<"queries">;
export type QueryInsert = TablesInsert<"queries">;
export type QueryUpdate = TablesUpdate<"queries">;

// Citation type for query history
export type Citation = {
  source: string;
  text: string;
  page?: number;
  section?: string;
};

// Convenience types for conversations table
// Note: These are manually defined until types are regenerated after migration
export type Conversation = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
};
export type ConversationInsert = {
  user_id: string;
  title?: string | null;
};
export type ConversationUpdate = {
  title?: string | null;
};

// Convenience types for messages table
// Note: These are manually defined until types are regenerated after migration
export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  citations: Json | null;
  created_at: string;
};
export type MessageInsert = {
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Json | null;
};
export type MessageUpdate = {
  content?: string;
  citations?: Json | null;
};
