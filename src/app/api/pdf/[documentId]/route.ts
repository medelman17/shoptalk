/**
 * PDF API route for serving contract documents.
 *
 * Streams PDF files with authentication and document scope enforcement.
 * Users can only access documents that apply to their Local union.
 */

import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync, existsSync } from "fs";
import path from "path";
import { getClerkUserId } from "@/lib/auth";
import { getUserProfile, isOnboardingComplete } from "@/lib/db/user-profile";
import { getDocumentScope } from "@/lib/union";
import { getDocumentById } from "@/lib/documents/manifest";

interface RouteParams {
  params: Promise<{ documentId: string }>;
}

/**
 * GET /api/pdf/[documentId]
 *
 * Streams a contract PDF file if the user is authorized to access it.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { documentId } = await params;

    // 1. Authenticate user
    const userId = await getClerkUserId();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get user profile and validate onboarding
    const profile = await getUserProfile(userId);
    if (!profile || !isOnboardingComplete(profile)) {
      return new NextResponse("Onboarding required", { status: 403 });
    }

    // 3. Determine document scope based on user's Local
    const localNumber = profile.local_number
      ? parseInt(profile.local_number, 10)
      : null;

    const allowedDocs = localNumber
      ? getDocumentScope(localNumber)
      : ["master"]; // Fallback to master only

    // 4. Check if user has access to this document
    if (!allowedDocs.includes(documentId)) {
      return new NextResponse("Forbidden: Document not in your scope", {
        status: 403,
      });
    }

    // 5. Get document metadata
    const document = getDocumentById(documentId);
    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // 6. Resolve file path and check existence
    const filePath = path.resolve(process.cwd(), document.filePath);
    if (!existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`);
      return new NextResponse("Document file not found", { status: 404 });
    }

    // 7. Get file stats for Content-Length header
    const stats = statSync(filePath);
    const fileSize = stats.size;

    // 8. Create readable stream
    const stream = createReadStream(filePath);

    // 9. Convert Node.js stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (error) => {
          console.error("Stream error:", error);
          controller.error(error);
        });
      },
      cancel() {
        stream.destroy();
      },
    });

    // 10. Return streaming response with appropriate headers
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(fileSize),
        "Content-Disposition": `inline; filename="${documentId}.pdf"`,
        // Allow caching for 1 week (PDFs don't change often)
        "Cache-Control": "private, max-age=604800",
      },
    });
  } catch (error) {
    console.error("PDF API error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
