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

import type { Tables, TablesInsert, TablesUpdate } from "./database.types";

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
