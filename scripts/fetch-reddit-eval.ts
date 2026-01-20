#!/usr/bin/env tsx
/**
 * Reddit Eval Dataset Builder
 *
 * Fetches Q&A data from r/UPSers to build an evaluation dataset
 * for testing ShopTalk's contract Q&A capabilities.
 *
 * Uses Reddit's public .json endpoints (no API credentials required).
 *
 * Usage:
 *   pnpm eval:fetch                          # Fetch all data
 *   pnpm eval:fetch --query "grievance" --limit 20   # Single query test
 *   pnpm eval:stats                          # Show statistics
 *   pnpm eval:fetch --resume                 # Resume interrupted fetch
 *   pnpm eval:fetch --dry-run                # Dry run (no file writes)
 *
 * Note: Uses conservative rate limiting (~10 req/min) to avoid 429 errors.
 * A full fetch takes approximately 30-45 minutes.
 */

import {
  RedditClient,
  ALL_SEARCH_QUERIES,
} from "./lib/reddit/client";
import { analyzePost } from "./lib/reddit/question-detector";
import {
  getDatasetPaths,
  ensureDatasetDirs,
  loadExistingEntries,
  createDatasetEntry,
  appendEntries,
  saveMetadata,
  loadMetadata,
  saveRawBatch,
  calculateTopicDistribution,
  printTopicDistribution,
  getStatsSummary,
} from "./lib/reddit/dataset-writer";
import type { RedditPost, EvalDatasetEntry, ProcessedBatch } from "./lib/reddit/types";

const ROOT_DIR = process.cwd();

interface CLIArgs {
  query?: string;
  limit?: number;
  resume?: boolean;
  dryRun?: boolean;
  stats?: boolean;
  help?: boolean;
}

/**
 * Parse command line arguments.
 */
function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--query":
      case "-q":
        result.query = args[++i];
        break;
      case "--limit":
      case "-l":
        result.limit = parseInt(args[++i], 10);
        break;
      case "--resume":
      case "-r":
        result.resume = true;
        break;
      case "--dry-run":
      case "-d":
        result.dryRun = true;
        break;
      case "--stats":
      case "-s":
        result.stats = true;
        break;
      case "--help":
      case "-h":
        result.help = true;
        break;
    }
  }

  return result;
}

/**
 * Print help message.
 */
function printHelp(): void {
  console.log(`
Reddit Eval Dataset Builder

Fetches Q&A data from r/UPSers to build an evaluation dataset
for testing ShopTalk's contract Q&A capabilities.

Uses Reddit's public .json endpoints - no API credentials required.

USAGE:
  pnpm eval:fetch [OPTIONS]

OPTIONS:
  -q, --query <query>    Fetch posts matching a single query
  -l, --limit <n>        Limit posts per query (default: 100)
  -r, --resume           Resume from last checkpoint
  -d, --dry-run          Analyze without writing files
  -s, --stats            Show dataset statistics
  -h, --help             Show this help message

EXAMPLES:
  pnpm eval:fetch                     # Fetch all data (~30-45 min)
  pnpm eval:fetch -q grievance -l 20  # Test with single query
  pnpm eval:stats                     # View current stats

NOTE:
  Uses conservative rate limiting (~10 requests/min) to avoid
  being blocked by Reddit. A full fetch takes approximately
  30-45 minutes depending on the number of posts found.
`);
}

/**
 * Show dataset statistics.
 */
function showStats(): void {
  const paths = getDatasetPaths(ROOT_DIR);
  const metadata = loadMetadata(paths);
  const entries = Array.from(loadExistingEntries(paths).values());

  console.log("\n=== Reddit Eval Dataset Statistics ===\n");

  if (!metadata && entries.length === 0) {
    console.log("No dataset found. Run 'pnpm eval:fetch' to create one.\n");
    return;
  }

  const stats = getStatsSummary(entries);

  console.log("Dataset:");
  console.log(`  Version: ${metadata?.version || "unknown"}`);
  console.log(`  Created: ${metadata?.createdAt || "unknown"}`);
  console.log(`  Updated: ${metadata?.updatedAt || "unknown"}`);

  console.log("\nPosts:");
  console.log(`  Total posts: ${stats.total}`);
  console.log(`  Questions: ${stats.questions} (${Math.round((stats.questions / stats.total) * 100)}%)`);
  console.log(`  Contract-related: ${stats.contractRelated} (${Math.round((stats.contractRelated / stats.total) * 100)}%)`);

  console.log("\nAnswers:");
  console.log(`  Posts with answers: ${stats.withAnswers}`);
  console.log(`  Total answers: ${stats.totalAnswers}`);
  console.log(`  Avg per question: ${stats.avgAnswers}`);
  console.log(`  With citations: ${stats.answersWithCitations}`);

  if (entries.length > 0) {
    const contractRelated = entries.filter((e) => e.classification.isContractRelated);
    const distribution = calculateTopicDistribution(contractRelated);
    printTopicDistribution(distribution, contractRelated.length);
  }

  console.log();
}

/**
 * Deduplicate posts by ID.
 */
function deduplicatePosts(
  newPosts: RedditPost[],
  existingIds: Set<string>
): RedditPost[] {
  const seen = new Set<string>(existingIds);
  const unique: RedditPost[] = [];

  for (const post of newPosts) {
    if (!seen.has(post.id)) {
      seen.add(post.id);
      unique.push(post);
    }
  }

  return unique;
}

/**
 * Format duration in human-readable form.
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

/**
 * Main fetch operation.
 */
async function fetchData(args: CLIArgs): Promise<void> {
  const startTime = Date.now();
  const paths = getDatasetPaths(ROOT_DIR);

  console.log("\n=== Reddit Eval Dataset Builder ===\n");
  console.log("Using public .json endpoints (no credentials required)");
  console.log("Rate limit: ~10 requests/minute\n");

  if (args.dryRun) {
    console.log("DRY RUN MODE - No files will be written\n");
  }

  // Ensure directories exist
  if (!args.dryRun) {
    ensureDatasetDirs(paths);
  }

  const client = new RedditClient();

  // Load existing entries for deduplication
  const existingEntries = args.resume ? loadExistingEntries(paths) : new Map();
  const existingIds = new Set(existingEntries.keys());

  console.log(`Existing entries: ${existingIds.size}`);

  // Determine queries to run
  const queries = args.query ? [args.query] : ALL_SEARCH_QUERIES;
  const limit = args.limit || 100;

  console.log(`\nFetching posts from r/UPSers...`);
  console.log(`  Queries: ${queries.length}`);
  console.log(`  Limit per query: ${limit}`);
  console.log(`  Estimated time: ${formatDuration(queries.length * 6 + 12)}\n`);

  // Fetch posts from search queries
  const allPosts: RedditPost[] = [];

  for (const query of queries) {
    process.stdout.write(`  Query: "${query}" - `);

    try {
      const { posts } = await client.searchSubreddit("UPSers", {
        q: query,
        sort: "relevance",
        t: "all",
        limit,
      });

      const newPosts = deduplicatePosts(posts, existingIds);
      allPosts.push(...newPosts);
      posts.forEach((p) => existingIds.add(p.id));

      console.log(`${posts.length} posts (${newPosts.length} new)`);

      // Save raw batch
      if (!args.dryRun && posts.length > 0) {
        const batch: ProcessedBatch = {
          timestamp: new Date().toISOString().replace(/[:.]/g, "-"),
          query,
          posts,
          nextAfter: null,
        };
        saveRawBatch(paths, batch);
      }
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
      if (client.getConsecutiveErrors() >= 3) {
        console.error("\n  Too many consecutive errors. Stopping to avoid being blocked.");
        break;
      }
    }
  }

  // Also fetch from /new and /top if doing full fetch
  if (!args.query) {
    console.log("\n  Fetching from /new...");
    try {
      const { posts } = await client.getNewPosts("UPSers", limit);
      const newPosts = deduplicatePosts(posts, existingIds);
      allPosts.push(...newPosts);
      console.log(`    ${posts.length} posts (${newPosts.length} new)`);
    } catch (error) {
      console.error(`    Error: ${error instanceof Error ? error.message : "Unknown"}`);
    }

    console.log("  Fetching from /top (all time)...");
    try {
      const { posts } = await client.getTopPosts("UPSers", "all", limit);
      const newPosts = deduplicatePosts(posts, existingIds);
      allPosts.push(...newPosts);
      console.log(`    ${posts.length} posts (${newPosts.length} new)`);
    } catch (error) {
      console.error(`    Error: ${error instanceof Error ? error.message : "Unknown"}`);
    }
  }

  console.log(`\n  Total unique posts: ${allPosts.length}`);

  // Process posts
  console.log("\nProcessing posts...");

  // Analyze all posts for question detection
  const analyzed = allPosts.map((post) => ({
    post,
    analysis: analyzePost(post),
  }));

  const questions = analyzed.filter((a) => a.analysis.isQuestion);
  const contractRelated = analyzed.filter((a) => a.analysis.isContractRelated);
  const targetPosts = analyzed.filter(
    (a) => a.analysis.isQuestion && a.analysis.isContractRelated
  );

  console.log(`  Questions identified: ${questions.length} (${Math.round((questions.length / allPosts.length) * 100) || 0}%)`);
  console.log(`  Contract-related: ${contractRelated.length} (${Math.round((contractRelated.length / allPosts.length) * 100) || 0}%)`);
  console.log(`  Target (both): ${targetPosts.length}`);

  if (targetPosts.length === 0) {
    console.log("\nNo target posts found. Exiting.");
    return;
  }

  // Fetch comments for target posts
  const estimatedCommentTime = targetPosts.length * 6;
  console.log(`\nFetching comments for ${targetPosts.length} posts...`);
  console.log(`  Estimated time: ${formatDuration(estimatedCommentTime)}`);

  const entries: EvalDatasetEntry[] = [];
  let processedCount = 0;
  let totalAnswers = 0;
  let errorCount = 0;

  for (const { post } of targetPosts) {
    processedCount++;

    // Progress update
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const remaining = Math.round((targetPosts.length - processedCount) * 6);
    process.stdout.write(
      `\r  Progress: ${processedCount}/${targetPosts.length} | Elapsed: ${formatDuration(elapsed)} | ETA: ${formatDuration(remaining)}   `
    );

    try {
      const comments = await client.getPostComments("UPSers", post.id, 50);
      const entry = createDatasetEntry(post, comments);
      entries.push(entry);
      totalAnswers += entry.answers.length;
    } catch (error) {
      errorCount++;
      // Skip posts with comment fetch errors but continue
      if (client.getConsecutiveErrors() >= 5) {
        console.error("\n\n  Too many consecutive errors. Stopping.");
        break;
      }
    }
  }

  console.log("\n");

  if (errorCount > 0) {
    console.log(`  Skipped ${errorCount} posts due to errors`);
  }

  // Write dataset
  if (!args.dryRun && entries.length > 0) {
    console.log("Writing dataset...");

    // Combine with existing entries if resuming
    const finalEntries = args.resume
      ? [...Array.from(existingEntries.values()), ...entries]
      : entries;

    // Write new entries only (existing entries already in file)
    appendEntries(paths, entries);

    // Save metadata
    const duration = Math.round((Date.now() - startTime) / 1000);
    saveMetadata(paths, finalEntries, queries, duration);

    console.log(`  Output: ${paths.questionsFile}`);
    console.log(`  Entries: ${finalEntries.length}`);
    console.log(`  New entries: ${entries.length}`);
  }

  // Print summary
  const duration = Math.round((Date.now() - startTime) / 1000);
  const avgAnswers = entries.length > 0 ? (totalAnswers / entries.length).toFixed(1) : "0";

  console.log("\n=== Summary ===");
  console.log(`  API requests: ${client.getRequestCount()}`);
  console.log(`  Duration: ${formatDuration(duration)}`);
  console.log(`  Entries created: ${entries.length}`);
  console.log(`  Total answers: ${totalAnswers}`);
  console.log(`  Avg answers/question: ${avgAnswers}`);

  // Topic distribution
  if (entries.length > 0) {
    const distribution = calculateTopicDistribution(entries);
    printTopicDistribution(distribution, entries.length);
  }

  console.log();
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    return;
  }

  if (args.stats) {
    showStats();
    return;
  }

  await fetchData(args);
}

main().catch((error) => {
  console.error("\nFatal error:", error);
  process.exit(1);
});
