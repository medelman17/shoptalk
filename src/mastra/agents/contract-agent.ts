/**
 * Contract Q&A agent for UPS Teamster contract retrieval.
 *
 * This agent answers questions about union contracts using RAG,
 * providing responses with inline citations to source documents.
 *
 * Uses Mastra Memory for:
 * - Automatic message persistence (PostgreSQL via Supabase)
 * - Semantic recall (find relevant past Q&A across conversations)
 * - Working memory (persistent user profiles with local union, preferences)
 */

import { Agent } from "@mastra/core/agent";
import type { MastraStorage } from "@mastra/core/storage";
import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { gateway } from "ai";
import { contractQueryTool } from "../tools/contract-query";

/**
 * Create memory configuration for the contract agent.
 *
 * Uses PostgreSQL (Supabase) for storage and vector search.
 * Requires POSTGRES_URL environment variable.
 */
function createContractMemory(): Memory | undefined {
  // Use POSTGRES_PRISMA_URL which includes proper SSL config for serverless
  let connectionString =
    process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    console.warn(
      "POSTGRES_PRISMA_URL/POSTGRES_URL not set - Memory features disabled. " +
        "Set a PostgreSQL connection string to enable conversation persistence, semantic recall, and working memory.",
    );
    return undefined;
  }

  // Handle connection parameters for PostgreSQL
  // - Use sslmode=no-verify to bypass certificate validation
  //   (Supabase pooler uses SSL but the certificate chain can't be verified by Node.js)
  // - Production also needs pgbouncer=true for Supabase pooler compatibility

  // Force sslmode=no-verify - Supabase pooler's cert chain triggers
  // "self-signed certificate in certificate chain" error with other modes
  connectionString = connectionString.replace(
    /sslmode=[^&]+/,
    "sslmode=no-verify",
  );
  if (!connectionString.includes("sslmode=")) {
    const separator = connectionString.includes("?") ? "&" : "?";
    connectionString = `${connectionString}${separator}sslmode=no-verify`;
  }

  const params: string[] = [];

  // Add pgbouncer=true for Supabase connection pooler compatibility
  // This disables prepared statements which aren't supported by PgBouncer
  if (
    !connectionString.includes("pgbouncer=") &&
    process.env.NODE_ENV !== "development"
  ) {
    params.push("pgbouncer=true");
  }

  if (params.length > 0) {
    const separator = connectionString.includes("?") ? "&" : "?";
    connectionString = `${connectionString}${separator}${params.join("&")}`;
  }

  // Log connection setup (without exposing credentials)
  const urlObj = new URL(connectionString);
  console.log(
    `[MastraMemory] Connecting to ${urlObj.host}${urlObj.pathname} with params: ${urlObj.searchParams.toString()}`,
  );

  // PostgresStore extends MastraCompositeStore which implements MastraStorage at runtime
  // but TypeScript types don't reflect this, so we cast it
  const storage = new PostgresStore({
    id: "shoptalk-storage",
    connectionString,
  }) as unknown as MastraStorage;

  return new Memory({
    storage,
    vector: new PgVector({
      id: "shoptalk-vector",
      connectionString,
    }),
    embedder: gateway.embeddingModel("openai/text-embedding-3-small"),
    options: {
      // Keep last 20 messages in context (prevents context overflow)
      lastMessages: 20,

      // Semantic recall - find relevant past Q&A across conversations
      semanticRecall: {
        topK: 3,
        messageRange: { before: 2, after: 1 },
        scope: "resource", // Search across all user's conversations
      },

      // Working memory - persistent user profile across all conversations
      // TEMPORARILY DISABLED - set enabled: true to re-enable
      workingMemory: {
        enabled: false,
        scope: "resource", // Persists across all user threads
        template: `# Teamster Profile
- **Name**:
- **Local Union**:
- **Region**:
- **Job Classification**:
- **Years of Service**:

## Preferences
- **Topics of Interest**: [overtime, seniority, grievances, benefits, etc.]
- **Communication Style**: [detailed citations vs concise answers]

## Context
- **Recent Questions**:
- **Ongoing Issues**:
`,
      },

      // Auto-generate thread titles from first message
      generateTitle: true,
    },
  });
}

/**
 * System prompt for the contract agent.
 *
 * Key elements:
 * - Defines the exact citation format for parsing
 * - Instructs to cite every factual claim
 * - Limits answers to retrieved content (no hallucination)
 * - Includes required disclaimer
 */
const CONTRACT_AGENT_INSTRUCTIONS = `You are a knowledgeable assistant helping UPS Teamsters understand their union contracts. You have access to the National Master Agreement, regional supplements, and local riders.

## Your Role
- Answer questions about wages, benefits, working conditions, grievance procedures, seniority, overtime, vacations, holidays, and other contract topics
- Provide accurate, helpful information based on the actual contract text
- Help workers understand their rights and protections under the collective bargaining agreement

## CRITICAL: User Context Header
You will receive a USER CONTEXT system message with the user's position and applicable contracts.
You MUST start EVERY response with this context formatted as a header block:

**Position:** [their position]
**Local:** [their local union]
**Applicable Contracts:** [clickable contract links]

---

Include this header EXACTLY as provided at the start of every response, followed by a horizontal rule, then your answer.
The contracts are markdown links in the format [Contract Name](?doc=documentId) - preserve these links exactly as provided so users can click to open the PDF viewer.

## CRITICAL: Response Format
- DO NOT output your thinking process, planning, or search narration
- DO NOT say things like "Let me search..." or "I'll look for..." or "Based on what I found..."
- ONLY output the final answer directly to the user
- After the context header, provide the actual answer content without meta-commentary

## Using the Contract Query Tool
When answering questions:
1. ALWAYS use the contract-query tool to search for relevant information
2. Search with specific, relevant terms from the user's question
3. If initial results are insufficient, try rephrasing the query with different contract terminology
4. For complex questions, make multiple queries to gather comprehensive information
5. Do all searching silently - the user should only see the final answer

## Citation Format
CRITICAL: You MUST cite every factual claim using this exact format:
[Doc: {documentId}, Art: {article}, Sec: {section}, Page: {pageStart}]

Examples:
- [Doc: master, Art: 6, Sec: 2, Page: 45]
- [Doc: western, Art: 3, Page: 12]
- [Doc: northern-california, Page: 8]

Rules for citations:
- Include the documentId (required), article (if available), section (if available), and page (required)
- Place citations immediately after the claim they support
- If a claim spans multiple sources, include all relevant citations
- Use the exact documentId, article, section, and pageStart values from the search results

## Response Guidelines
1. Answer based ONLY on the retrieved contract text - never invent or assume contract language
2. If the search returns no relevant results, say "I couldn't find specific information about that in your applicable contracts. Could you rephrase your question or ask about a related topic?"
3. If results are ambiguous or incomplete, acknowledge the limitation
4. Use clear, accessible language - explain contract terminology when needed
5. Structure longer answers with headings or bullet points for readability
6. When multiple documents address a topic, note any differences between them

## Required Disclaimer
End EVERY response with this disclaimer on its own line:

---
*This information is for educational purposes only and does not constitute legal advice. For specific situations, consult your union steward or business agent.*

## Example Response
"**Position:** Package Car Driver (RPCD)
**Local:** Teamsters Local 63
**Applicable Contracts:** [Master Agreement](?doc=master) → [Western Supplement](?doc=western) → [NorCal Rider](?doc=northern-california)

---

Under the Master Agreement, overtime pay is calculated at time-and-a-half for hours worked over 8 in a day or 40 in a week [Doc: master, Art: 12, Sec: 1, Page: 67]. Your Western Region Supplement provides additional protections, requiring overtime for any work on the sixth consecutive day [Doc: western, Art: 8, Page: 34].

---
*This information is for educational purposes only and does not constitute legal advice. For specific situations, consult your union steward or business agent.*"
`;

/**
 * Contract Q&A agent.
 *
 * Uses RAG to answer questions about UPS Teamster contracts with
 * inline citations to source documents.
 *
 * Memory features (when DATABASE_URL is set):
 * - Automatic message persistence to PostgreSQL
 * - Semantic recall finds relevant past conversations
 * - Working memory persists user profile across sessions
 */
export const contractAgent = new Agent({
  id: "contract-agent",
  name: "Contract Q&A Agent",
  instructions: CONTRACT_AGENT_INSTRUCTIONS,
  model: gateway.languageModel("anthropic/claude-sonnet-4-20250514"),
  tools: { contractQueryTool },
  memory: createContractMemory(),
});
