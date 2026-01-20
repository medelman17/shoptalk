/**
 * Reddit Client using Public JSON Endpoints
 *
 * Uses Reddit's public .json endpoints which don't require authentication.
 * This approach works without API credentials but has stricter rate limits.
 *
 * Rate limit: ~10 requests per minute (unauthenticated)
 * We use 6-second delays between requests to stay well under the limit.
 */

import type {
  RedditPost,
  RedditComment,
  RedditListingResponse,
} from "./types";

const REDDIT_BASE = "https://www.reddit.com";
const OLD_REDDIT_BASE = "https://old.reddit.com";

// Conservative rate limiting: 6 seconds between requests (~10/min)
const RATE_LIMIT_DELAY = 6000;
const MAX_RETRIES = 5;
const RETRY_BACKOFF_BASE = 10000; // 10 seconds base for exponential backoff

// User agent is required - Reddit blocks requests without one
const USER_AGENT = "ShopTalk-EvalBuilder/1.0 (research project for UPS contract Q&A evaluation)";

export class RedditClient {
  private lastRequestTime = 0;
  private requestCount = 0;
  private consecutiveErrors = 0;

  /**
   * Wait to respect rate limits.
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Make a request to Reddit's public JSON endpoint.
   */
  private async request<T>(
    path: string,
    options: { retries?: number } = {}
  ): Promise<T> {
    const retries = options.retries ?? 0;

    await this.rateLimit();

    // Use old.reddit.com as it's more reliable for JSON endpoints
    const url = `${OLD_REDDIT_BASE}${path}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          "Accept": "application/json",
        },
      });

      // Handle rate limiting (429)
      if (response.status === 429) {
        this.consecutiveErrors++;
        if (retries < MAX_RETRIES) {
          const backoffTime = RETRY_BACKOFF_BASE * Math.pow(2, retries);
          console.warn(`\n  Rate limited (429). Waiting ${backoffTime / 1000}s before retry ${retries + 1}/${MAX_RETRIES}...`);
          await this.sleep(backoffTime);
          return this.request<T>(path, { retries: retries + 1 });
        }
        throw new Error("Rate limit exceeded after max retries");
      }

      // Handle other errors
      if (!response.ok) {
        this.consecutiveErrors++;
        if (response.status === 403 || response.status === 401) {
          throw new Error(`Access denied (${response.status}). Reddit may be blocking requests.`);
        }
        if (retries < MAX_RETRIES) {
          const backoffTime = RETRY_BACKOFF_BASE * Math.pow(1.5, retries);
          console.warn(`\n  Error ${response.status}. Waiting ${backoffTime / 1000}s before retry...`);
          await this.sleep(backoffTime);
          return this.request<T>(path, { retries: retries + 1 });
        }
        throw new Error(`Reddit request failed (${response.status})`);
      }

      // Success - reset error counter
      this.consecutiveErrors = 0;

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Rate limit")) {
        throw error;
      }

      // Network errors - retry with backoff
      this.consecutiveErrors++;
      if (retries < MAX_RETRIES) {
        const backoffTime = RETRY_BACKOFF_BASE * Math.pow(1.5, retries);
        console.warn(`\n  Network error. Waiting ${backoffTime / 1000}s before retry...`);
        await this.sleep(backoffTime);
        return this.request<T>(path, { retries: retries + 1 });
      }
      throw error;
    }
  }

  /**
   * Search for posts in a subreddit.
   */
  async searchSubreddit(
    subreddit: string,
    params: {
      q: string;
      sort?: "relevance" | "hot" | "top" | "new" | "comments";
      t?: "hour" | "day" | "week" | "month" | "year" | "all";
      limit?: number;
      after?: string;
    }
  ): Promise<{ posts: RedditPost[]; after: string | null }> {
    const query = new URLSearchParams({
      q: params.q,
      restrict_sr: "on",
      sort: params.sort || "relevance",
      t: params.t || "all",
      limit: String(params.limit || 100),
      raw_json: "1",
    });

    if (params.after) {
      query.set("after", params.after);
    }

    const response = await this.request<RedditListingResponse<RedditPost>>(
      `/r/${subreddit}/search.json?${query.toString()}`
    );

    const posts = response.data.children
      .map((child) => child.data)
      .filter((post) => post.is_self && !post.stickied && !post.over_18);

    return {
      posts,
      after: response.data.after,
    };
  }

  /**
   * Get new posts from a subreddit.
   */
  async getNewPosts(
    subreddit: string,
    limit = 100,
    after?: string
  ): Promise<{ posts: RedditPost[]; after: string | null }> {
    const query = new URLSearchParams({
      limit: String(limit),
      raw_json: "1",
    });

    if (after) {
      query.set("after", after);
    }

    const response = await this.request<RedditListingResponse<RedditPost>>(
      `/r/${subreddit}/new.json?${query.toString()}`
    );

    const posts = response.data.children
      .map((child) => child.data)
      .filter((post) => post.is_self && !post.stickied && !post.over_18);

    return {
      posts,
      after: response.data.after,
    };
  }

  /**
   * Get top posts from a subreddit.
   */
  async getTopPosts(
    subreddit: string,
    timeframe: "hour" | "day" | "week" | "month" | "year" | "all" = "all",
    limit = 100,
    after?: string
  ): Promise<{ posts: RedditPost[]; after: string | null }> {
    const query = new URLSearchParams({
      t: timeframe,
      limit: String(limit),
      raw_json: "1",
    });

    if (after) {
      query.set("after", after);
    }

    const response = await this.request<RedditListingResponse<RedditPost>>(
      `/r/${subreddit}/top.json?${query.toString()}`
    );

    const posts = response.data.children
      .map((child) => child.data)
      .filter((post) => post.is_self && !post.stickied && !post.over_18);

    return {
      posts,
      after: response.data.after,
    };
  }

  /**
   * Get comments for a post.
   * Returns only top-level comments.
   */
  async getPostComments(
    subreddit: string,
    postId: string,
    limit = 50
  ): Promise<RedditComment[]> {
    const query = new URLSearchParams({
      limit: String(limit),
      depth: "1",
      sort: "top",
      raw_json: "1",
    });

    // Reddit returns [post, comments] as a tuple
    const response = await this.request<
      [RedditListingResponse<RedditPost>, RedditListingResponse<RedditComment>]
    >(`/r/${subreddit}/comments/${postId}.json?${query.toString()}`);

    const commentListing = response[1];

    return commentListing.data.children
      .filter((child) => child.kind === "t1")
      .map((child) => child.data)
      .filter((comment) => !comment.stickied && comment.author !== "AutoModerator");
  }

  /**
   * Get the current request count (for statistics).
   */
  getRequestCount(): number {
    return this.requestCount;
  }

  /**
   * Get consecutive error count (for monitoring).
   */
  getConsecutiveErrors(): number {
    return this.consecutiveErrors;
  }
}

/**
 * Primary search queries for contract-related content.
 */
export const PRIMARY_SEARCH_QUERIES = [
  "contract",
  "master agreement",
  "supplement",
  "article",
  "grievance",
  "seniority",
  "9.5",
  "22.4",
  "RPCD",
];

/**
 * Secondary search queries for related topics.
 */
export const SECONDARY_SEARCH_QUERIES = [
  "overtime",
  "vacation",
  "progression",
  "bid",
  "steward",
  "union",
  "local",
  "pension",
  "feeder",
  "package driver",
  "top rate",
  "discipline",
];

/**
 * All search queries combined.
 */
export const ALL_SEARCH_QUERIES = [
  ...PRIMARY_SEARCH_QUERIES,
  ...SECONDARY_SEARCH_QUERIES,
];
