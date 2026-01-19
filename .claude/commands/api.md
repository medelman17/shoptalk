---
argument-hint: [route-path]
description: Create a Next.js API route with validation and error handling
---

Create a new Next.js API route at: $ARGUMENTS

## Instructions

1. Create the route file at `src/app/api/[route]/route.ts`

2. Follow this pattern:
   ```tsx
   import { NextRequest, NextResponse } from "next/server"
   import { z } from "zod"

   const RequestSchema = z.object({
     // Define request body schema
   })

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json()
       const validated = RequestSchema.parse(body)

       // Implementation

       return NextResponse.json({ success: true, data: result })
     } catch (error) {
       if (error instanceof z.ZodError) {
         return NextResponse.json(
           { success: false, error: "Validation failed", details: error.errors },
           { status: 400 }
         )
       }
       console.error("API error:", error)
       return NextResponse.json(
         { success: false, error: "Internal server error" },
         { status: 500 }
       )
     }
   }
   ```

3. Requirements:
   - Use Zod for request/response validation
   - Include proper error handling
   - Return consistent response shapes
   - Add appropriate HTTP methods (GET, POST, PUT, DELETE)

4. If integrating with Mastra, check existing patterns in the codebase.

Ask what HTTP methods and data shapes are needed before implementing.
