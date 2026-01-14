import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createDb, users, locals, localDocuments, documents } from "@shoptalk/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import type { Env, AuthUser } from "../types";

type Variables = {
  user: AuthUser;
};

export const userRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply auth middleware to all routes
userRoutes.use("*", requireAuth);

// Get current user profile
userRoutes.get("/profile", async (c) => {
  const { userId } = c.get("user");
  const db = createDb(c.env.DATABASE_URL);

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// Create/complete user profile (during onboarding)
const createProfileSchema = z.object({
  localNumber: z.number().int().positive(),
  classification: z.string().min(1),
});

userRoutes.post(
  "/profile",
  zValidator("json", createProfileSchema),
  async (c) => {
    const { userId } = c.get("user");
    const { localNumber, classification } = c.req.valid("json");
    const db = createDb(c.env.DATABASE_URL);

    // Verify local exists
    const local = await db.query.locals.findFirst({
      where: eq(locals.localNumber, localNumber),
    });

    if (!local) {
      return c.json({ error: "Invalid local number" }, 400);
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (existingUser) {
      return c.json({ error: "Profile already exists" }, 409);
    }

    // Create user profile
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        localNumber,
        classification,
      })
      .returning();

    return c.json(newUser, 201);
  }
);

// Update user profile
const updateProfileSchema = z.object({
  localNumber: z.number().int().positive().optional(),
  classification: z.string().min(1).optional(),
  hubId: z.string().nullable().optional(),
  shift: z.string().nullable().optional(),
  seniorityDate: z.string().nullable().optional(),
});

userRoutes.patch(
  "/profile",
  zValidator("json", updateProfileSchema),
  async (c) => {
    const { userId } = c.get("user");
    const updates = c.req.valid("json");
    const db = createDb(c.env.DATABASE_URL);

    // If updating local, verify it exists
    if (updates.localNumber) {
      const local = await db.query.locals.findFirst({
        where: eq(locals.localNumber, updates.localNumber),
      });

      if (!local) {
        return c.json({ error: "Invalid local number" }, 400);
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(updatedUser);
  }
);

// Get user's applicable documents based on their local
userRoutes.get("/documents", async (c) => {
  const { userId } = c.get("user");
  const db = createDb(c.env.DATABASE_URL);

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get documents for user's local
  const userDocuments = await db
    .select({
      id: documents.id,
      title: documents.title,
      type: documents.type,
      region: documents.region,
      effectiveDate: documents.effectiveDate,
      pdfPath: documents.pdfPath,
      pageCount: documents.pageCount,
      priority: localDocuments.priority,
    })
    .from(localDocuments)
    .innerJoin(documents, eq(localDocuments.documentId, documents.id))
    .where(eq(localDocuments.localNumber, user.localNumber))
    .orderBy(localDocuments.priority);

  return c.json(userDocuments);
});
