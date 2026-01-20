/**
 * Question Detection Logic
 *
 * Identifies whether a Reddit post is asking a question and whether
 * it's related to contract/union topics.
 */

import type { RedditPost, ContractTopic } from "./types";
import { CONTRACT_TOPICS } from "./types";

/**
 * Question detection patterns and signals.
 */
const QUESTION_PATTERNS = {
  // Direct question markers
  endsWithQuestionMark: /\?$/,

  // Question words at start
  startsWithQuestionWord: /^(what|how|why|when|where|who|which|can|does|is|are|should|would|could|will|do|has|have|was|were|am|did)\b/i,

  // Common question phrases
  questionPhrases: [
    /anyone know/i,
    /does anyone/i,
    /has anyone/i,
    /can anyone/i,
    /question about/i,
    /quick question/i,
    /wondering if/i,
    /curious if/i,
    /is it true/i,
    /is this true/i,
    /am i right/i,
    /is that right/i,
    /what happens if/i,
    /how do i/i,
    /how can i/i,
    /what should i/i,
    /need help/i,
    /need advice/i,
    /looking for advice/i,
    /help me understand/i,
    /explain.*to me/i,
    /eli5/i,
    /newbie question/i,
    /stupid question/i,
    /new hire.*question/i,
  ],

  // Negative signals (not questions)
  notQuestionPatterns: [
    /^rant:/i,
    /^psa:/i,
    /^update:/i,
    /^discussion:/i,
    /just wanted to share/i,
    /sharing my experience/i,
    /i just got/i,
    /i finally/i,
    /^rip\b/i,
    /^fired today/i,
    /^quit today/i,
  ],
};

/**
 * Contract-related keywords for filtering.
 */
const CONTRACT_KEYWORDS = [
  // Direct contract terms
  "contract",
  "master agreement",
  "supplement",
  "article",
  "section",
  "language",
  "rider",

  // Union/labor terms
  "grievance",
  "steward",
  "union",
  "teamsters",
  "local",
  "ba",
  "business agent",
  "arbitration",
  "panel",

  // Specific contract provisions
  "seniority",
  "9.5",
  "nine five",
  "8 hour request",
  "8hr request",
  "22.4",
  "22.3",
  "rpcd",
  "feeder",
  "progression",
  "top rate",
  "bid",
  "route",
  "package driver",
  "combo",
  "air driver",
  "part time",
  "full time",

  // Work conditions
  "overtime",
  "forced overtime",
  "mandatory",
  "sixth punch",
  "sixth day",
  "guarantee",
  "guaranteed hours",
  "start time",
  "start times",

  // Benefits
  "pension",
  "health insurance",
  "benefits",
  "teamcare",
  "vacation",
  "option day",
  "personal day",
  "sick day",

  // Discipline
  "warning letter",
  "suspension",
  "termination",
  "discharge",
  "cardinal sin",
  "progressive discipline",

  // Pay
  "pay rate",
  "wage",
  "retro",
  "backpay",
  "time and a half",
  "double time",
];

interface QuestionAnalysis {
  isQuestion: boolean;
  isContractRelated: boolean;
  confidence: number;
  topics: ContractTopic[];
  signals: string[];
}

/**
 * Analyze a post to determine if it's a question.
 */
export function analyzePost(post: RedditPost): QuestionAnalysis {
  const title = post.title.toLowerCase().trim();
  const body = (post.selftext || "").toLowerCase().trim();
  const fullText = `${title} ${body}`;

  const signals: string[] = [];
  let questionScore = 0;
  let contractScore = 0;

  // Check for question mark
  if (QUESTION_PATTERNS.endsWithQuestionMark.test(post.title.trim())) {
    questionScore += 3;
    signals.push("ends_with_?");
  }

  // Check for question words
  if (QUESTION_PATTERNS.startsWithQuestionWord.test(title)) {
    questionScore += 2;
    signals.push("starts_with_question_word");
  }

  // Check for question phrases
  for (const pattern of QUESTION_PATTERNS.questionPhrases) {
    if (pattern.test(fullText)) {
      questionScore += 2;
      signals.push(`phrase:${pattern.source.slice(0, 20)}`);
      break; // Only count once
    }
  }

  // Check for negative signals
  for (const pattern of QUESTION_PATTERNS.notQuestionPatterns) {
    if (pattern.test(fullText)) {
      questionScore -= 2;
      signals.push(`negative:${pattern.source.slice(0, 20)}`);
    }
  }

  // Boost for flair indicating question
  if (post.link_flair_text) {
    const flair = post.link_flair_text.toLowerCase();
    if (flair.includes("question") || flair.includes("help") || flair.includes("advice")) {
      questionScore += 2;
      signals.push("flair:question");
    }
  }

  // Check for contract-related keywords
  for (const keyword of CONTRACT_KEYWORDS) {
    if (fullText.includes(keyword)) {
      contractScore += 1;
      if (contractScore <= 3) {
        signals.push(`keyword:${keyword}`);
      }
    }
  }

  // Detect topics
  const topics = detectTopics(fullText);

  // Calculate confidence (0-1)
  const isQuestion = questionScore >= 2;
  const isContractRelated = contractScore >= 1 || topics.length > 0;

  // Normalize confidence
  const maxQuestionScore = 7;
  const maxContractScore = 5;
  const questionConfidence = Math.min(1, Math.max(0, questionScore / maxQuestionScore));
  const contractConfidence = Math.min(1, Math.max(0, contractScore / maxContractScore));
  const confidence = (questionConfidence + contractConfidence) / 2;

  return {
    isQuestion,
    isContractRelated,
    confidence,
    topics,
    signals,
  };
}

/**
 * Detect contract topics from text.
 */
function detectTopics(text: string): ContractTopic[] {
  const found: ContractTopic[] = [];

  for (const [topic, keywords] of Object.entries(CONTRACT_TOPICS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        found.push(topic as ContractTopic);
        break;
      }
    }
  }

  return found;
}

/**
 * Normalize question text by combining title and body.
 */
export function normalizeQuestionText(post: RedditPost): string {
  let text = post.title.trim();

  // If title seems truncated (ends with ...) or is short, include body
  if (post.selftext && post.selftext.length > 0) {
    const body = cleanRedditFormatting(post.selftext);
    if (body.length > 20) {
      // Only append body if it adds meaningful content
      text = `${text}\n\n${body}`;
    }
  }

  return text;
}

/**
 * Extract context from post (job type, location, etc.).
 */
export function extractContext(post: RedditPost): string | null {
  const text = `${post.title} ${post.selftext || ""}`.toLowerCase();

  const contextParts: string[] = [];

  // Job classifications
  if (text.includes("22.4")) contextParts.push("22.4 driver");
  else if (text.includes("rpcd")) contextParts.push("RPCD");
  else if (text.includes("feeder")) contextParts.push("feeder driver");
  else if (text.includes("package driver")) contextParts.push("package driver");
  else if (text.includes("pt") || text.includes("part time") || text.includes("part-time")) {
    contextParts.push("part-time");
  }
  else if (text.includes("combo") || text.includes("22.3")) contextParts.push("combo/22.3");

  // Experience level
  if (text.includes("new hire") || text.includes("newbie") || text.includes("just started")) {
    contextParts.push("new hire");
  }
  else if (text.includes("peak") || text.includes("seasonal")) {
    contextParts.push("seasonal");
  }

  // Location/local
  const localMatch = text.match(/local\s*(\d{2,4})/i);
  if (localMatch) {
    contextParts.push(`Local ${localMatch[1]}`);
  }

  // Hub type
  if (text.includes("hub")) contextParts.push("hub");
  if (text.includes("center")) contextParts.push("center");

  return contextParts.length > 0 ? contextParts.join(", ") : null;
}

/**
 * Clean Reddit formatting from text.
 */
function cleanRedditFormatting(text: string): string {
  return text
    // Remove subreddit references
    .replace(/r\/\w+/g, "")
    // Remove user mentions
    .replace(/u\/\w+/g, "")
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove bold/italic
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, "$1")
    // Remove blockquotes
    .replace(/^>\s*/gm, "")
    // Remove horizontal rules
    .replace(/^---+$/gm, "")
    // Normalize whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Check if an answer text contains contract citations.
 */
export function hasContractCitation(text: string): boolean {
  const citationPatterns = [
    /article\s+\d+/i,
    /section\s+\d+/i,
    /art\.?\s*\d+/i,
    /sec\.?\s*\d+/i,
    /\(\d+\)\s*\(\w\)/i, // (1)(a) style
    /master agreement/i,
    /supplement/i,
    /rider/i,
    /contract says/i,
    /per the contract/i,
    /according to the contract/i,
    /in the contract/i,
  ];

  return citationPatterns.some((pattern) => pattern.test(text));
}
