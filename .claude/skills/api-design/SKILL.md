---
name: api-design
description: API route design patterns with Zod validation and error handling. Auto-applies when creating API routes, designing endpoints, adding request validation, or handling API errors.
---

# API Design Patterns

## Route Structure

```
src/app/api/
├── chat/
│   └── route.ts           # POST /api/chat
├── agents/
│   ├── route.ts           # GET, POST /api/agents
│   └── [id]/
│       └── route.ts       # GET, PUT, DELETE /api/agents/[id]
└── workflows/
    └── [name]/
        └── trigger/
            └── route.ts   # POST /api/workflows/[name]/trigger
```

## Standard Route Template

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schemas
const RequestSchema = z.object({
  // Request body schema
});

const ResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: unknown;
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    // Parse and validate request
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    // Implementation
    const result = await processRequest(validated);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: error.errors,
      },
      { status: 400 }
    );
  }

  console.error("API error:", error);
  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
    },
    { status: 500 }
  );
}
```

## Zod Schema Patterns

### Request Validation
```typescript
const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  instructions: z.string().min(10),
  model: z.enum(["claude-sonnet-4-5-20250929", "claude-haiku-3-5-20241022"]).default("claude-sonnet-4-5-20250929"),
  tools: z.array(z.string()).optional(),
});

type CreateAgentRequest = z.infer<typeof CreateAgentSchema>;
```

### Query Parameters
```typescript
const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = QuerySchema.parse(Object.fromEntries(searchParams));
  // ...
}
```

### Dynamic Route Parameters
```typescript
// src/app/api/agents/[id]/route.ts
const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = ParamsSchema.parse(await params);
  // ...
}
```

## Response Patterns

### Success Response
```typescript
return NextResponse.json({
  success: true,
  data: {
    id: "123",
    name: "Agent",
    createdAt: new Date().toISOString(),
  },
});
```

### Error Response
```typescript
return NextResponse.json(
  {
    success: false,
    error: "Agent not found",
  },
  { status: 404 }
);
```

### Streaming Response (for AI)
```typescript
import { mastra } from "@/mastra";

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  const agent = mastra.getAgent("chat-agent");
  const stream = await agent.stream(message);

  return new Response(stream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

## HTTP Methods

| Method | Use Case | Status Codes |
|--------|----------|--------------|
| GET | Retrieve resources | 200, 404 |
| POST | Create resource | 201, 400 |
| PUT | Replace resource | 200, 404 |
| PATCH | Partial update | 200, 404 |
| DELETE | Remove resource | 204, 404 |

## Error Handling

### Custom Error Classes
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

class ValidationError extends ApiError {
  constructor(details: unknown) {
    super("Validation failed", 400, details);
  }
}
```

### Centralized Error Handler
```typescript
function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: error.errors },
      { status: 400 }
    );
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
```

## Authentication (placeholder)

```typescript
async function requireAuth(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  // Verify token and return user
  const user = await verifyToken(token);
  return user;
}

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  // Authenticated route logic
}
```

## Rate Limiting (placeholder)

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // Continue with request
}
```
