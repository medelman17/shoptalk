import { Hono } from "hono";
import { Webhook } from "svix";
import { createDb, users } from "@shoptalk/db";
import { eq } from "drizzle-orm";
import type { Env } from "../types";

export const authRoutes = new Hono<{ Bindings: Env }>();

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    phone_numbers?: Array<{ phone_number: string }>;
    created_at?: number;
    updated_at?: number;
  };
}

// Clerk webhook handler for user sync
authRoutes.post("/webhook", async (c) => {
  const webhookSecret = c.env.CLERK_WEBHOOK_SECRET;

  // Get headers for verification
  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: "Missing svix headers" }, 400);
  }

  const body = await c.req.text();

  // Verify webhook signature
  const wh = new Webhook(webhookSecret);
  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return c.json({ error: "Invalid webhook signature" }, 400);
  }

  const db = createDb(c.env.DATABASE_URL);

  // Handle different event types
  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, phone_numbers } = event.data;

      const email = email_addresses?.[0]?.email_address ?? null;
      const phone = phone_numbers?.[0]?.phone_number ?? null;

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (existingUser) {
        // Update existing user's contact info
        await db
          .update(users)
          .set({
            email,
            phone,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));
      }
      // Note: New users are fully created during onboarding, not here
      // This webhook only syncs contact info changes

      break;
    }

    case "user.deleted": {
      const { id } = event.data;
      // Soft delete or handle as needed
      // For now, we'll leave the user data for audit purposes
      console.log(`User deleted from Clerk: ${id}`);
      break;
    }

    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }

  return c.json({ received: true });
});
