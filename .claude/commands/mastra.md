---
argument-hint: [agent|tool|workflow] [name]
description: Scaffold Mastra agents, tools, or workflows
---

Create a new Mastra $ARGUMENTS following the existing patterns in this codebase.

## Instructions

1. First, examine the existing patterns in `src/mastra/` to understand the conventions:
   - Check `src/mastra/agents/` for agent patterns
   - Check `src/mastra/tools/` for tool patterns
   - Check `src/mastra/workflows/` for workflow patterns

2. Create the new component following these requirements:
   - Use Zod schemas for all inputs and outputs
   - Include proper TypeScript types
   - Follow the streaming response pattern for agents
   - Export from `src/mastra/index.ts` if needed

3. Provide a usage example after creation.

If only a type is provided without a name, ask for the name before proceeding.
