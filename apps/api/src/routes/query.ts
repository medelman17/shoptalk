import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createDb, users, queries, localDocuments } from "@shoptalk/db";
import { eq, desc } from "drizzle-orm";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "../middleware/auth";
import type { Env, AuthUser } from "../types";
import type { CitationJson } from "@shoptalk/db/schema";

type Variables = {
  user: AuthUser;
};

export const queryRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

queryRoutes.use("*", requireAuth);

const SYSTEM_PROMPT = `You are a contract reference assistant for UPS Teamster workers. Your role is to help workers find and understand specific contract language from the National Master Agreement and their applicable supplements.

RULES:
1. Answer questions using ONLY the provided contract excerpts. Never invent or assume contract language.
2. Every factual claim MUST include an inline citation in this format: [Article X, Section Y, Page Z]
3. If the provided excerpts don't contain information to answer the question, say: "I couldn't find specific contract language addressing this question. Consider consulting your steward for guidance."
4. Be concise but thorough. Match response length to question complexity.
5. Use clear, accessible language while preserving legal precision.

IMPORTANT: Always end your response with this disclaimer on its own line:

---
*This is contract reference information, not legal advice. Consult your steward or Local union for guidance on specific situations.*`;

const querySchema = z.object({
  query: z.string().min(1).max(1000),
});

// Submit a contract query
queryRoutes.post("/", zValidator("json", querySchema), async (c) => {
  const startTime = Date.now();
  const { userId } = c.get("user");
  const { query } = c.req.valid("json");
  const db = createDb(c.env.DATABASE_URL);

  // Get user and their applicable documents
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get applicable document IDs for filtering
  const userDocs = await db
    .select({ documentId: localDocuments.documentId })
    .from(localDocuments)
    .where(eq(localDocuments.localNumber, user.localNumber));

  const applicableDocIds = userDocs.map((d) => d.documentId);

  if (applicableDocIds.length === 0) {
    return c.json(
      { error: "No documents configured for your local" },
      400
    );
  }

  // Initialize clients
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });
  const pinecone = new Pinecone({ apiKey: c.env.PINECONE_API_KEY });
  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });

  const index = pinecone.index(c.env.PINECONE_INDEX);

  // Generate query embedding
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Query Pinecone with document filter
  const searchResults = await index.query({
    vector: queryEmbedding,
    topK: 8,
    filter: {
      documentId: { $in: applicableDocIds },
    },
    includeMetadata: true,
  });

  // Build context from retrieved chunks
  const contextChunks = searchResults.matches
    .filter((match) => match.metadata)
    .map((match) => {
      const meta = match.metadata as {
        documentId: string;
        documentTitle: string;
        article?: string;
        section?: string;
        subsection?: string;
        pageNumber: number;
        text: string;
      };

      const location = [
        meta.article,
        meta.section,
        meta.subsection,
      ]
        .filter(Boolean)
        .join(", ");

      return `[${meta.documentTitle} - ${location || "General"}, Page ${meta.pageNumber}]
${meta.text}`;
    });

  const context = contextChunks.join("\n\n---\n\n");

  // Generate response with Claude
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Based on the following contract excerpts, answer this question: "${query}"

CONTRACT EXCERPTS:
${context}

Remember to cite your sources using [Article X, Section Y, Page Z] format.`,
      },
    ],
  });

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract citations from response and match to retrieved chunks
  const citations: CitationJson[] = searchResults.matches
    .filter((match) => match.metadata)
    .slice(0, 5) // Limit to top 5 sources
    .map((match) => {
      const meta = match.metadata as {
        documentId: string;
        documentTitle: string;
        article?: string;
        section?: string;
        subsection?: string;
        pageNumber: number;
        text: string;
      };

      return {
        documentId: meta.documentId,
        documentTitle: meta.documentTitle,
        article: meta.article ?? null,
        section: meta.section ?? null,
        subsection: meta.subsection ?? null,
        pageNumber: meta.pageNumber,
        excerpt: meta.text.slice(0, 200) + "...",
      };
    });

  const durationMs = Date.now() - startTime;

  // Save query to history
  const [savedQuery] = await db
    .insert(queries)
    .values({
      userId,
      queryText: query,
      responseText,
      citations,
      durationMs,
    })
    .returning();

  return c.json({
    id: savedQuery.id,
    query: savedQuery.queryText,
    response: responseText,
    citations,
    durationMs,
    createdAt: savedQuery.createdAt.toISOString(),
  });
});

// Get query history
queryRoutes.get("/history", async (c) => {
  const { userId } = c.get("user");
  const db = createDb(c.env.DATABASE_URL);

  const limit = parseInt(c.req.query("limit") ?? "20");
  const offset = parseInt(c.req.query("offset") ?? "0");

  const history = await db.query.queries.findMany({
    where: eq(queries.userId, userId),
    orderBy: [desc(queries.createdAt)],
    limit,
    offset,
  });

  return c.json(
    history.map((q) => ({
      id: q.id,
      query: q.queryText,
      responsePreview: q.responseText?.slice(0, 150) + "...",
      citationCount: (q.citations as CitationJson[] | null)?.length ?? 0,
      createdAt: q.createdAt.toISOString(),
    }))
  );
});

// Get specific query by ID
queryRoutes.get("/:id", async (c) => {
  const { userId } = c.get("user");
  const queryId = c.req.param("id");
  const db = createDb(c.env.DATABASE_URL);

  const query = await db.query.queries.findFirst({
    where: eq(queries.id, queryId),
  });

  if (!query) {
    return c.json({ error: "Query not found" }, 404);
  }

  // Ensure user owns this query
  if (query.userId !== userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  return c.json({
    id: query.id,
    query: query.queryText,
    response: query.responseText,
    citations: query.citations,
    durationMs: query.durationMs,
    createdAt: query.createdAt.toISOString(),
  });
});
