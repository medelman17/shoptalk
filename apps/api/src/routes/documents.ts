import { Hono } from "hono";
import { createDb, documents } from "@shoptalk/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import type { Env, AuthUser } from "../types";

type Variables = {
  user: AuthUser;
};

export const documentsRoutes = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>();

documentsRoutes.use("*", requireAuth);

// List all documents
documentsRoutes.get("/", async (c) => {
  const db = createDb(c.env.DATABASE_URL);

  const allDocuments = await db.query.documents.findMany({
    orderBy: (documents, { asc }) => [asc(documents.type), asc(documents.title)],
  });

  return c.json(allDocuments);
});

// Get document by ID
documentsRoutes.get("/:id", async (c) => {
  const documentId = c.req.param("id");
  const db = createDb(c.env.DATABASE_URL);

  const document = await db.query.documents.findFirst({
    where: eq(documents.id, documentId),
  });

  if (!document) {
    return c.json({ error: "Document not found" }, 404);
  }

  return c.json(document);
});

// Get signed URL for PDF
documentsRoutes.get("/:id/pdf", async (c) => {
  const documentId = c.req.param("id");
  const pageNumber = c.req.query("page");
  const db = createDb(c.env.DATABASE_URL);

  const document = await db.query.documents.findFirst({
    where: eq(documents.id, documentId),
  });

  if (!document) {
    return c.json({ error: "Document not found" }, 404);
  }

  // Generate Supabase signed URL
  // Note: In production, you'd use the Supabase client to generate a signed URL
  // For now, we return the storage path and let the client handle it
  const pdfUrl = `${c.env.SUPABASE_URL}/storage/v1/object/public/contracts/${document.pdfPath}`;

  return c.json({
    url: pdfUrl,
    pageNumber: pageNumber ? parseInt(pageNumber) : 1,
    pageCount: document.pageCount,
  });
});
