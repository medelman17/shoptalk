/**
 * Queries API route for listing and creating queries.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { saveQuery, getRecentQueries } from "@/lib/db/queries";

/**
 * GET /api/queries
 *
 * List recent queries for the current user.
 */
export async function GET(request: NextRequest) {
  try {
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

    // 3. Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

    // 4. Fetch queries
    const queries = await getRecentQueries(profile.id, limit);

    return NextResponse.json({ queries });
  } catch (error) {
    console.error("GET /api/queries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/queries
 *
 * Create a new query (question only, answer added later via PATCH).
 */
export async function POST(request: NextRequest) {
  try {
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

    // 3. Parse request body
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // 4. Create query
    const query = await saveQuery(profile.id, question.trim());

    return NextResponse.json({ query }, { status: 201 });
  } catch (error) {
    console.error("POST /api/queries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
