---
name: mastra-patterns
description: Mastra AI framework patterns for agents, tools, and workflows. Auto-applies when building AI agents, creating Mastra tools, designing workflows, or integrating Claude AI into features. Use this knowledge for any Mastra-related development.
---

# Mastra Development Patterns

## Project Structure

```
src/mastra/
├── index.ts          # Core Mastra instance and exports
├── agents/           # Agent definitions
├── tools/            # Tool definitions
└── workflows/        # Workflow definitions
```

## Agent Patterns

### Basic Agent Structure
```typescript
import { Agent } from "@mastra/core";
import { z } from "zod";

export const myAgent = new Agent({
  name: "MyAgent",
  instructions: `You are a helpful assistant that...`,
  model: {
    provider: "ANTHROPIC",
    name: "claude-sonnet-4-5-20250929",
  },
  tools: { /* tool definitions */ },
});
```

### Key Principles
- Always define clear, focused instructions
- Use streaming responses for user-facing output
- Include error handling in agent logic
- Keep agents single-purpose

## Tool Patterns

### Tool Definition
```typescript
import { createTool } from "@mastra/core";
import { z } from "zod";

export const myTool = createTool({
  id: "my-tool",
  description: "Clear description of what this tool does",
  inputSchema: z.object({
    param: z.string().describe("What this parameter is for"),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ context }) => {
    // Implementation
    return { result: "..." };
  },
});
```

### Tool Guidelines
- Descriptions are critical - Claude uses them to decide when to call the tool
- Always use Zod schemas for input/output validation
- Keep tools focused on single actions
- Handle errors gracefully and return meaningful messages

## Workflow Patterns

### Basic Workflow
```typescript
import { Workflow, Step } from "@mastra/core";
import { z } from "zod";

const stepOne = new Step({
  id: "step-one",
  execute: async ({ context }) => {
    return { data: "result" };
  },
});

export const myWorkflow = new Workflow({
  name: "my-workflow",
  triggerSchema: z.object({
    input: z.string(),
  }),
})
  .step(stepOne)
  .commit();
```

### Workflow Guidelines
- Break complex processes into discrete steps
- Use triggerSchema to validate workflow inputs
- Chain steps with `.then()` for sequential execution
- Use `.parallel()` for concurrent steps

## Integration with Next.js

### API Route Integration
```typescript
// src/app/api/agent/route.ts
import { mastra } from "@/mastra";

export async function POST(request: Request) {
  const { message } = await request.json();

  const agent = mastra.getAgent("my-agent");
  const response = await agent.stream(message);

  return new Response(response.body, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

## Common Patterns

1. **Streaming responses** - Always use `.stream()` for user-facing agents
2. **Memory integration** - Use `@mastra/memory` for conversation history
3. **Observability** - Enable tracing with `@mastra/observability`
4. **Error boundaries** - Wrap agent calls in try/catch with user-friendly errors

## Anti-patterns to Avoid

- Don't create monolithic agents - split into focused agents
- Don't skip Zod schemas - they're essential for type safety
- Don't hardcode API keys - use environment variables
- Don't ignore tool descriptions - they determine when tools are called
