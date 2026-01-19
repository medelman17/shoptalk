import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserProfileUpdate } from "@/lib/supabase/types";

/**
 * Get a user profile by Clerk ID.
 *
 * @param clerkId - The Clerk user ID
 * @returns The user profile or null if not found
 */
export async function getUserProfile(
  clerkId: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned - user not found
      return null;
    }
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
}

/**
 * Get a user profile by its internal UUID.
 *
 * @param id - The internal user profile UUID
 * @returns The user profile or null if not found
 */
export async function getUserProfileById(
  id: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching user profile by ID:", error);
    throw error;
  }

  return data;
}

/**
 * Update a user profile.
 *
 * @param clerkId - The Clerk user ID
 * @param updates - The fields to update
 * @returns The updated user profile
 */
export async function updateUserProfile(
  clerkId: string,
  updates: UserProfileUpdate
): Promise<UserProfile> {
  const supabase = await createClient();

  const updateData: UserProfileUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updateData)
    .eq("clerk_id", clerkId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}

/**
 * Update the user's union-specific settings.
 *
 * @param clerkId - The Clerk user ID
 * @param settings - Union settings to update
 */
export async function updateUserUnionSettings(
  clerkId: string,
  settings: {
    local_number?: string;
    classification?: string;
    supplement_ids?: string[];
  }
): Promise<UserProfile> {
  return updateUserProfile(clerkId, settings);
}
