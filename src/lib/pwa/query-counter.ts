/**
 * Query counter for triggering PWA install prompt.
 *
 * Tracks the number of queries made in the current session to determine
 * when to show the install prompt (after 3rd query).
 */

const STORAGE_KEY = "shoptalk-query-count";
const INSTALL_THRESHOLD = 3;

/**
 * Get the current query count from localStorage.
 */
export function getQueryCount(): number {
  if (typeof window === "undefined") return 0;

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

/**
 * Increment the query count.
 *
 * @returns The new count
 */
export function incrementQueryCount(): number {
  if (typeof window === "undefined") return 0;

  const current = getQueryCount();
  const newCount = current + 1;
  localStorage.setItem(STORAGE_KEY, String(newCount));
  return newCount;
}

/**
 * Check if the install prompt should be shown.
 *
 * Returns true after the user has made at least INSTALL_THRESHOLD queries.
 */
export function shouldShowInstallPrompt(): boolean {
  return getQueryCount() >= INSTALL_THRESHOLD;
}

/**
 * Reset the query count (e.g., after install).
 */
export function resetQueryCount(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if the user has dismissed the install prompt.
 */
export function hasUserDismissedPrompt(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("shoptalk-install-dismissed") === "true";
}

/**
 * Mark the install prompt as dismissed.
 */
export function dismissInstallPrompt(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("shoptalk-install-dismissed", "true");
}
