/**
 * Dataset Writer
 *
 * Handles writing the evaluation dataset to JSONL format
 * with metadata tracking and resume support.
 */

import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { nanoid } from "nanoid";
import type {
  EvalDatasetEntry,
  DatasetMetadata,
  RedditPost,
  ProcessedBatch,
  ContractTopic,
} from "./types";
import { extractAnswers } from "./answer-extractor";
import { analyzePost, normalizeQuestionText, extractContext } from "./question-detector";
import type { RedditComment } from "./types";

const DATASET_VERSION = "1.0.0";

export interface DatasetPaths {
  root: string;
  rawDir: string;
  questionsFile: string;
  metadataFile: string;
  annotatedDir: string;
}

/**
 * Get standard paths for the dataset.
 */
export function getDatasetPaths(rootDir: string): DatasetPaths {
  const evalDir = join(rootDir, "data", "eval");
  return {
    root: evalDir,
    rawDir: join(evalDir, "reddit-raw"),
    questionsFile: join(evalDir, "reddit-questions.jsonl"),
    metadataFile: join(evalDir, "reddit-metadata.json"),
    annotatedDir: join(evalDir, "annotated"),
  };
}

/**
 * Ensure all dataset directories exist.
 */
export function ensureDatasetDirs(paths: DatasetPaths): void {
  [paths.root, paths.rawDir, paths.annotatedDir].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Save a raw batch of fetched posts.
 */
export function saveRawBatch(
  paths: DatasetPaths,
  batch: ProcessedBatch
): string {
  const filename = `batch-${batch.timestamp}.json`;
  const filepath = join(paths.rawDir, filename);
  writeFileSync(filepath, JSON.stringify(batch, null, 2));
  return filepath;
}

/**
 * Load existing entries from the questions file.
 */
export function loadExistingEntries(paths: DatasetPaths): Map<string, EvalDatasetEntry> {
  const entries = new Map<string, EvalDatasetEntry>();

  if (!existsSync(paths.questionsFile)) {
    return entries;
  }

  const content = readFileSync(paths.questionsFile, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    try {
      const entry = JSON.parse(line) as EvalDatasetEntry;
      entries.set(entry.redditPostId, entry);
    } catch {
      // Skip invalid lines
    }
  }

  return entries;
}

/**
 * Create an eval dataset entry from a post and its comments.
 */
export function createDatasetEntry(
  post: RedditPost,
  comments: RedditComment[]
): EvalDatasetEntry {
  const analysis = analyzePost(post);
  const answers = extractAnswers(comments);

  return {
    id: nanoid(12),
    redditPostId: post.id,

    question: {
      text: normalizeQuestionText(post),
      title: post.title,
      body: post.selftext || null,
      context: extractContext(post),
    },

    source: {
      subreddit: "UPSers",
      permalink: `https://reddit.com${post.permalink}`,
      author: post.author,
      created_at: new Date(post.created_utc * 1000).toISOString(),
      flair: post.link_flair_text,
      score: post.score,
      upvote_ratio: post.upvote_ratio,
      num_comments: post.num_comments,
    },

    answers,

    classification: {
      isQuestion: analysis.isQuestion,
      isContractRelated: analysis.isContractRelated,
      topics: analysis.topics,
      confidence: analysis.confidence,
    },

    groundTruth: {
      answer: null,
      citations: [],
      annotatedBy: null,
      annotatedAt: null,
    },

    fetchedAt: new Date().toISOString(),
    version: DATASET_VERSION,
  };
}

/**
 * Append entries to the JSONL file.
 */
export function appendEntries(
  paths: DatasetPaths,
  entries: EvalDatasetEntry[]
): void {
  if (entries.length === 0) return;

  const lines = entries.map((entry) => JSON.stringify(entry)).join("\n") + "\n";

  // Ensure directory exists
  const dir = dirname(paths.questionsFile);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  appendFileSync(paths.questionsFile, lines);
}

/**
 * Calculate topic distribution from entries.
 */
export function calculateTopicDistribution(
  entries: EvalDatasetEntry[]
): Record<string, number> {
  const distribution: Record<string, number> = {};

  for (const entry of entries) {
    for (const topic of entry.classification.topics) {
      distribution[topic] = (distribution[topic] || 0) + 1;
    }
  }

  // Sort by count descending
  return Object.fromEntries(
    Object.entries(distribution).sort(([, a], [, b]) => b - a)
  );
}

/**
 * Save dataset metadata.
 */
export function saveMetadata(
  paths: DatasetPaths,
  entries: EvalDatasetEntry[],
  searchQueries: string[],
  fetchDuration: number
): void {
  const contractRelated = entries.filter((e) => e.classification.isContractRelated);
  const totalAnswers = entries.reduce((sum, e) => sum + e.answers.length, 0);

  const metadata: DatasetMetadata = {
    version: DATASET_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalPosts: entries.length,
    totalQuestions: entries.filter((e) => e.classification.isQuestion).length,
    totalContractRelated: contractRelated.length,
    totalAnswers,
    avgAnswersPerQuestion:
      entries.length > 0 ? Math.round((totalAnswers / entries.length) * 10) / 10 : 0,
    topicDistribution: calculateTopicDistribution(contractRelated),
    searchQueries,
    fetchDuration,
  };

  writeFileSync(paths.metadataFile, JSON.stringify(metadata, null, 2));
}

/**
 * Load existing metadata if available.
 */
export function loadMetadata(paths: DatasetPaths): DatasetMetadata | null {
  if (!existsSync(paths.metadataFile)) {
    return null;
  }

  try {
    const content = readFileSync(paths.metadataFile, "utf-8");
    return JSON.parse(content) as DatasetMetadata;
  } catch {
    return null;
  }
}

/**
 * Print topic distribution in a formatted way.
 */
export function printTopicDistribution(
  distribution: Record<string, number>,
  total: number
): void {
  console.log("\nTopic Distribution:");

  for (const [topic, count] of Object.entries(distribution)) {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    const bar = "█".repeat(Math.ceil(percent / 5));
    console.log(`  ${topic.padEnd(15)} ${String(count).padStart(3)} (${percent}%) ${bar}`);
  }
}

/**
 * Get statistics summary for console output.
 */
export function getStatsSummary(entries: EvalDatasetEntry[]): {
  total: number;
  questions: number;
  contractRelated: number;
  withAnswers: number;
  totalAnswers: number;
  avgAnswers: number;
  answersWithCitations: number;
} {
  const questions = entries.filter((e) => e.classification.isQuestion);
  const contractRelated = entries.filter((e) => e.classification.isContractRelated);
  const withAnswers = entries.filter((e) => e.answers.length > 0);
  const totalAnswers = entries.reduce((sum, e) => sum + e.answers.length, 0);
  const answersWithCitations = entries.reduce(
    (sum, e) => sum + e.answers.filter((a) => a.has_citation).length,
    0
  );

  return {
    total: entries.length,
    questions: questions.length,
    contractRelated: contractRelated.length,
    withAnswers: withAnswers.length,
    totalAnswers,
    avgAnswers: entries.length > 0 ? Math.round((totalAnswers / entries.length) * 10) / 10 : 0,
    answersWithCitations,
  };
}
