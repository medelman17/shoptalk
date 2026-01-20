/**
 * Answer Extraction Logic
 *
 * Processes Reddit comments to extract high-quality answers
 * for the evaluation dataset.
 */

import type { RedditComment, EvalAnswer } from "./types";
import { hasContractCitation } from "./question-detector";

/**
 * Answer quality thresholds.
 */
const ANSWER_CONFIG = {
  minScore: 3, // Minimum upvote score
  minLength: 50, // Minimum character length
  maxAnswers: 5, // Maximum answers per question
  excludeAuthors: ["AutoModerator", "[deleted]", "[removed]"],
};

/**
 * Filter and extract quality answers from comments.
 */
export function extractAnswers(comments: RedditComment[]): EvalAnswer[] {
  // Filter to quality answers
  const qualityComments = comments.filter((comment) => {
    // Exclude deleted/removed and bots
    if (ANSWER_CONFIG.excludeAuthors.includes(comment.author)) {
      return false;
    }

    // Check minimum score
    if (comment.score < ANSWER_CONFIG.minScore) {
      return false;
    }

    // Check minimum length (substantive answers)
    if (comment.body.length < ANSWER_CONFIG.minLength) {
      return false;
    }

    // Exclude stickied comments (usually mod messages)
    if (comment.stickied) {
      return false;
    }

    return true;
  });

  // Sort by score descending
  qualityComments.sort((a, b) => b.score - a.score);

  // Take top N answers
  const topAnswers = qualityComments.slice(0, ANSWER_CONFIG.maxAnswers);

  // Transform to EvalAnswer format
  return topAnswers.map((comment) => ({
    id: comment.id,
    text: cleanAnswerText(comment.body),
    author: comment.author,
    score: comment.score,
    created_at: new Date(comment.created_utc * 1000).toISOString(),
    is_submitter: comment.is_submitter,
    has_citation: hasContractCitation(comment.body),
  }));
}

/**
 * Clean answer text for storage.
 */
function cleanAnswerText(text: string): string {
  return text
    // Remove excessive Reddit formatting
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    // Remove edit notices
    .replace(/edit:\s*.*/gi, "")
    .replace(/edit\s*\d*:\s*.*/gi, "")
    // Normalize whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Statistics for answer extraction.
 */
export interface AnswerStats {
  totalComments: number;
  filteredByScore: number;
  filteredByLength: number;
  filteredByAuthor: number;
  qualityAnswers: number;
  answersWithCitations: number;
}

/**
 * Get detailed statistics about answer extraction.
 */
export function getAnswerStats(comments: RedditComment[]): AnswerStats {
  let filteredByScore = 0;
  let filteredByLength = 0;
  let filteredByAuthor = 0;
  let qualityAnswers = 0;
  let answersWithCitations = 0;

  for (const comment of comments) {
    // Check filters
    if (ANSWER_CONFIG.excludeAuthors.includes(comment.author)) {
      filteredByAuthor++;
      continue;
    }

    if (comment.score < ANSWER_CONFIG.minScore) {
      filteredByScore++;
      continue;
    }

    if (comment.body.length < ANSWER_CONFIG.minLength) {
      filteredByLength++;
      continue;
    }

    qualityAnswers++;

    if (hasContractCitation(comment.body)) {
      answersWithCitations++;
    }
  }

  return {
    totalComments: comments.length,
    filteredByScore,
    filteredByLength,
    filteredByAuthor,
    qualityAnswers,
    answersWithCitations,
  };
}

/**
 * Check if a post has enough quality answers to be useful.
 */
export function hasQualityAnswers(comments: RedditComment[]): boolean {
  const answers = extractAnswers(comments);
  return answers.length >= 1;
}

/**
 * Find OP (original poster) replies in comments.
 */
export function findOpReplies(comments: RedditComment[]): RedditComment[] {
  return comments.filter(
    (comment) =>
      comment.is_submitter &&
      comment.body.length >= 20 &&
      !ANSWER_CONFIG.excludeAuthors.includes(comment.author)
  );
}

/**
 * Analyze if OP confirmed an answer (simple heuristic).
 */
export function opConfirmedAnswer(opReplies: RedditComment[]): boolean {
  const confirmationPhrases = [
    "thank you",
    "thanks",
    "that helps",
    "that makes sense",
    "got it",
    "appreciate it",
    "perfect",
    "exactly what i needed",
    "this is what i was looking for",
  ];

  for (const reply of opReplies) {
    const text = reply.body.toLowerCase();
    if (confirmationPhrases.some((phrase) => text.includes(phrase))) {
      return true;
    }
  }

  return false;
}
