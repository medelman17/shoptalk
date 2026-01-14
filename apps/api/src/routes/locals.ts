import { Hono } from "hono";
import { createDb, locals, localDocuments, documents } from "@shoptalk/db";
import { eq, ilike, or } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import type { Env, AuthUser } from "../types";

type Variables = {
  user: AuthUser;
};

export const localsRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

localsRoutes.use("*", requireAuth);

// Search/list locals (for autocomplete)
localsRoutes.get("/", async (c) => {
  const search = c.req.query("search");
  const limit = parseInt(c.req.query("limit") ?? "20");
  const db = createDb(c.env.DATABASE_URL);

  let allLocals;

  if (search) {
    // Search by local number or name/city
    const searchPattern = `%${search}%`;
    allLocals = await db.query.locals.findMany({
      where: or(
        ilike(locals.name, searchPattern),
        ilike(locals.city, searchPattern),
        ilike(locals.state, searchPattern),
        // For numeric search (local number)
        eq(locals.localNumber, parseInt(search) || 0)
      ),
      limit,
      orderBy: (locals, { asc }) => [asc(locals.localNumber)],
    });
  } else {
    allLocals = await db.query.locals.findMany({
      limit,
      orderBy: (locals, { asc }) => [asc(locals.localNumber)],
    });
  }

  return c.json(allLocals);
});

// Get local by number with applicable documents
localsRoutes.get("/:number", async (c) => {
  const localNumber = parseInt(c.req.param("number"));
  const db = createDb(c.env.DATABASE_URL);

  if (isNaN(localNumber)) {
    return c.json({ error: "Invalid local number" }, 400);
  }

  const local = await db.query.locals.findFirst({
    where: eq(locals.localNumber, localNumber),
  });

  if (!local) {
    return c.json({ error: "Local not found" }, 404);
  }

  // Get applicable documents
  const applicableDocuments = await db
    .select({
      id: documents.id,
      title: documents.title,
      type: documents.type,
      region: documents.region,
      effectiveDate: documents.effectiveDate,
      priority: localDocuments.priority,
    })
    .from(localDocuments)
    .innerJoin(documents, eq(localDocuments.documentId, documents.id))
    .where(eq(localDocuments.localNumber, localNumber))
    .orderBy(localDocuments.priority);

  return c.json({
    ...local,
    documents: applicableDocuments,
  });
});
