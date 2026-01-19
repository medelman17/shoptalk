import { requireAuth } from "@/lib/auth";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Base layout for all authenticated routes.
 *
 * This layout only ensures the user is authenticated.
 * Onboarding checks are handled by nested layouts to avoid
 * redirect loops on the onboarding page itself.
 *
 * Route structure:
 * - (authenticated)/onboarding - No onboarding check (user is completing it)
 * - (authenticated)/(app)/* - Requires completed onboarding
 */
export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // Ensure user is authenticated
  await requireAuth();

  return <>{children}</>;
}
