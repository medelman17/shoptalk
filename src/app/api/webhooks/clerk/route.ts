import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Server configuration error", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;
  const supabase = createAdminClient();

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, primary_email_address_id } = evt.data;
        const primaryEmail = email_addresses.find(
          (e) => e.id === primary_email_address_id
        );

        const { error } = await supabase.from("user_profiles").insert({
          clerk_id: id,
          email: primaryEmail?.email_address ?? null,
        });

        if (error) {
          console.error("Failed to create user profile:", error);
          return new Response("Database error", { status: 500 });
        }

        console.log(`User profile created for Clerk ID: ${id}`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses, primary_email_address_id } = evt.data;
        const primaryEmail = email_addresses.find(
          (e) => e.id === primary_email_address_id
        );

        const { error } = await supabase
          .from("user_profiles")
          .update({
            email: primaryEmail?.email_address ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_id", id);

        if (error) {
          console.error("Failed to update user profile:", error);
          return new Response("Database error", { status: 500 });
        }

        console.log(`User profile updated for Clerk ID: ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (!id) {
          console.error("No user ID in delete event");
          return new Response("Invalid event data", { status: 400 });
        }

        const { error } = await supabase
          .from("user_profiles")
          .delete()
          .eq("clerk_id", id);

        if (error) {
          console.error("Failed to delete user profile:", error);
          return new Response("Database error", { status: 500 });
        }

        console.log(`User profile deleted for Clerk ID: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Internal error", { status: 500 });
  }
}
