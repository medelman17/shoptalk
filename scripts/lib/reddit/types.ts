/**
 * Reddit API and Eval Dataset Types
 *
 * Type definitions for Reddit JSON endpoints and the evaluation dataset format.
 */

// ============================================================================
// Reddit API Types (Public JSON Endpoints)
// ============================================================================

export interface RedditPost {
  id: string;
  name: string; // Fullname (e.g., "t3_abc123")
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  permalink: string;
  link_flair_text: string | null;
  is_self: boolean;
  over_18: boolean;
  stickied: boolean;
  archived: boolean;
  locked: boolean;
}

export interface RedditComment {
  id: string;
  name: string; // Fullname (e.g., "t1_abc123")
  body: string;
  author: string;
  created_utc: number;
  score: number;
  is_submitter: boolean;
  parent_id: string;
  depth: number;
  stickied: boolean;
}

export interface RedditListingResponse<T> {
  kind: "Listing";
  data: {
    after: string | null;
    before: string | null;
    dist: number;
    modhash: string;
    geo_filter: string | null;
    children: Array<{
      kind: string;
      data: T;
    }>;
  };
}

// ============================================================================
// Eval Dataset Types
// ============================================================================

export interface EvalDatasetEntry {
  id: string;
  redditPostId: string;

  question: {
    text: string;
    title: string;
    body: string | null;
    context: string | null;
  };

  source: {
    subreddit: "UPSers";
    permalink: string;
    author: string;
    created_at: string;
    flair: string | null;
    score: number;
    upvote_ratio: number;
    num_comments: number;
  };

  answers: EvalAnswer[];

  classification: {
    isQuestion: boolean;
    isContractRelated: boolean;
    topics: string[];
    confidence: number;
  };

  groundTruth: {
    answer: string | null;
    citations: string[];
    annotatedBy: string | null;
    annotatedAt: string | null;
  };

  fetchedAt: string;
  version: string;
}

export interface EvalAnswer {
  id: string;
  text: string;
  author: string;
  score: number;
  created_at: string;
  is_submitter: boolean;
  has_citation: boolean;
}

export interface DatasetMetadata {
  version: string;
  createdAt: string;
  updatedAt: string;
  totalPosts: number;
  totalQuestions: number;
  totalContractRelated: number;
  totalAnswers: number;
  avgAnswersPerQuestion: number;
  topicDistribution: Record<string, number>;
  searchQueries: string[];
  fetchDuration: number;
}

// ============================================================================
// Topic Classification
// ============================================================================

export const CONTRACT_TOPICS = {
  seniority: ["seniority", "bid", "route", "pick", "preferred"],
  overtime: ["overtime", "ot", "9.5", "forced", "extra board", "mandatory"],
  grievance: ["grievance", "grieve", "file", "steward", "local", "protest"],
  wages: ["pay", "wage", "rate", "progression", "raise", "top rate", "salary"],
  benefits: ["insurance", "health", "pension", "401k", "benefit", "coverage"],
  classification: ["22.4", "rpcd", "feeder", "driver", "package", "pt", "ft", "combo"],
  vacation: ["vacation", "holiday", "personal day", "pto", "time off", "sick"],
  discipline: ["warning", "discipline", "termination", "discharge", "suspend"],
  hours: ["hours", "guarantee", "start time", "punch", "clock", "schedule"],
  safety: ["safety", "injury", "accident", "osha", "weather", "orion"],
} as const;

export type ContractTopic = keyof typeof CONTRACT_TOPICS;

// ============================================================================
// CLI Types
// ============================================================================

export interface FetchOptions {
  query?: string;
  limit?: number;
  resume?: boolean;
  dryRun?: boolean;
}

export interface ProcessedBatch {
  timestamp: string;
  query: string;
  posts: RedditPost[];
  nextAfter: string | null;
}
