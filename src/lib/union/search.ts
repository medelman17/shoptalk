import type { Local, LocalSearchResult } from "./types";
import { LOCALS, formatLocalDisplay } from "./locals";

/**
 * Normalize a string for search matching.
 * Removes accents, converts to lowercase, and trims.
 */
function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Calculate a simple match score for a Local against a query.
 * Higher scores indicate better matches.
 *
 * Scoring:
 * - Exact number match: 100
 * - Number starts with query: 80
 * - Number contains query: 60
 * - City starts with query: 50
 * - State exact match: 40
 * - City contains query: 30
 * - Name contains query: 20
 */
function calculateMatchScore(local: Local, query: string): number {
  const normalizedQuery = normalizeForSearch(query);

  // Empty query matches everything with base score
  if (!normalizedQuery) {
    return 1;
  }

  let score = 0;

  // Check if query is a number
  const queryNumber = parseInt(normalizedQuery, 10);
  const isNumericQuery = !isNaN(queryNumber);

  if (isNumericQuery) {
    const localNumberStr = local.number.toString();

    // Exact number match
    if (local.number === queryNumber) {
      score += 100;
    }
    // Number starts with query
    else if (localNumberStr.startsWith(normalizedQuery)) {
      score += 80;
    }
    // Number contains query
    else if (localNumberStr.includes(normalizedQuery)) {
      score += 60;
    }
  }

  const normalizedCity = normalizeForSearch(local.city);
  const normalizedState = normalizeForSearch(local.state);
  const normalizedName = normalizeForSearch(local.name);

  // City starts with query
  if (normalizedCity.startsWith(normalizedQuery)) {
    score += 50;
  }
  // City contains query
  else if (normalizedCity.includes(normalizedQuery)) {
    score += 30;
  }

  // State exact match (2-letter code)
  if (normalizedState === normalizedQuery) {
    score += 40;
  }

  // Name contains query
  if (normalizedName.includes(normalizedQuery)) {
    score += 20;
  }

  return score;
}

/**
 * Search Locals by query string.
 *
 * Searches across:
 * - Local number
 * - City name
 * - State abbreviation
 * - Local name
 *
 * @param query - The search query
 * @param limit - Maximum number of results (default: 10)
 * @returns Sorted array of matching Locals with scores
 */
export function searchLocals(query: string, limit: number = 10): LocalSearchResult[] {
  const results: LocalSearchResult[] = [];

  for (const local of LOCALS) {
    const matchScore = calculateMatchScore(local, query);

    if (matchScore > 0) {
      results.push({
        ...local,
        displayName: formatLocalDisplay(local),
        matchScore,
      });
    }
  }

  // Sort by score (descending), then by Local number (ascending)
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.number - b.number;
  });

  return results.slice(0, limit);
}

/**
 * Get all Locals for display (sorted by number).
 *
 * @param limit - Maximum number of results (default: all)
 * @returns Array of Locals with display names
 */
export function getAllLocalsForDisplay(limit?: number): LocalSearchResult[] {
  const results: LocalSearchResult[] = LOCALS.map((local) => ({
    ...local,
    displayName: formatLocalDisplay(local),
    matchScore: 1,
  })).sort((a, b) => a.number - b.number);

  return limit ? results.slice(0, limit) : results;
}

/**
 * Get suggested Locals based on common selections or regional popularity.
 * Useful for showing initial options before the user types.
 *
 * @param limit - Maximum number of suggestions (default: 6)
 * @returns Array of suggested Locals
 */
export function getSuggestedLocals(limit: number = 6): LocalSearchResult[] {
  // Common large Locals across different regions
  const suggestedNumbers = [396, 804, 705, 25, 177, 767, 104, 480];

  return suggestedNumbers
    .slice(0, limit)
    .map((num) => {
      const local = LOCALS.find((l) => l.number === num);
      if (!local) return null;
      return {
        ...local,
        displayName: formatLocalDisplay(local),
        matchScore: 1,
      };
    })
    .filter((l): l is LocalSearchResult => l !== null);
}

/**
 * Validate if a Local number exists in the dataset.
 *
 * @param localNumber - The Local number to validate
 * @returns True if the Local exists
 */
export function isValidLocalNumber(localNumber: number): boolean {
  return LOCALS.some((l) => l.number === localNumber);
}

/**
 * Get autocomplete suggestions for a partial input.
 * Optimized for fast typing with debounce-friendly results.
 *
 * @param input - The partial input string
 * @param maxResults - Maximum suggestions (default: 8)
 * @returns Array of autocomplete suggestions
 */
export function getAutocompleteSuggestions(
  input: string,
  maxResults: number = 8
): LocalSearchResult[] {
  const trimmedInput = input.trim();

  // Show suggested Locals for empty input
  if (!trimmedInput) {
    return getSuggestedLocals(maxResults);
  }

  return searchLocals(trimmedInput, maxResults);
}
