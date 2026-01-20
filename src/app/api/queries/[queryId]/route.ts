/**
 * Single query API route for viewing and updating queries.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getQueryById, updateQuery, deleteQuery } from "@/lib/db/queries";
import type { Citation } from "@/lib/supabase/types";

interface RouteParams {
  params: Promise<{ queryId: string }>;
}

/**
 * GET /api/queries/[queryId]
 *
 * Get a single query by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { queryId } = await params;

    // 1. Authenticate user
    const clerkId = await getClerkUserId();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user profile
    const profile = await getUserProfile(clerkId);
    if (!profile || !isOnboardingComplete(profile)) {
      return NextResponse.json(
        { error: "Onboarding required" },
        { status: 403 }
      );
    }

    // 3. Fetch query
    const query = await getQueryById(queryId);
    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    // 4. Verify ownership
    if (query.user_id !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ query });
  } catch (error) {
    console.error("GET /api/queries/[queryId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/queries/[queryId]
 *
 * Update a query with answer and citations.
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { queryId } = await params;

    // 1. Authenticate user
    const clerkId = await getClerkUserId();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user profile
    const profile = await getUserProfile(clerkId);
    if (!profile || !isOnboardingComplete(profile)) {
      return NextResponse.json(
        { error: "Onboarding required" },
        { status: 403 }
      );
    }

    // 3. Verify query exists and belongs to user
    const existingQuery = await getQueryById(queryId);
    if (!existingQuery) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    if (existingQuery.user_id !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Parse request body
    const body = await request.json();
    const { answer, citations } = body as {
      answer?: string;
      citations?: Citation[];
    };

    // 5. Update query
    const updatedQuery = await updateQuery(queryId, {
      answer,
      citations,
    });

    return NextResponse.json({ query: updatedQuery });
  } catch (error) {
    console.error("PATCH /api/queries/[queryId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/queries/[queryId]
 *
 * Delete a query from history.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { queryId } = await params;

    // 1. Authenticate user
    const clerkId = await getClerkUserId();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user profile
    const profile = await getUserProfile(clerkId);
    if (!profile || !isOnboardingComplete(profile)) {
      return NextResponse.json(
        { error: "Onboarding required" },
        { status: 403 }
      );
    }

    // 3. Verify query exists and belongs to user
    const existingQuery = await getQueryById(queryId);
    if (!existingQuery) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    if (existingQuery.user_id !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Delete query
    await deleteQuery(queryId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/queries/[queryId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
