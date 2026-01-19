import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Create a Supabase client for use in Client Components.
 * Uses the anon key with RLS - safe for browser use.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
