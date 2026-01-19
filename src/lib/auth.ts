import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current user's Clerk ID from the session.
 * Must be called from a Server Component or Route Handler.
 *
 * @returns The Clerk user ID or null if not authenticated
 */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication and return the Clerk user ID.
 * Throws if the user is not authenticated.
 *
 * @returns The Clerk user ID
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<string> {
  const userId = await getClerkUserId();
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

/**
 * Get the current user's email address.
 *
 * @returns The primary email or null if not available
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const user = await currentUser();
  return user?.primaryEmailAddress?.emailAddress ?? null;
}

/**
 * Get basic user info for display purposes.
 *
 * @returns User display info or null if not authenticated
 */
export async function getCurrentUserInfo() {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
}
