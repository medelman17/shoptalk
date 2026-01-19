# ShopTalk - AI-Powered Contract Retrieval

## Quick Context
Next.js 16 app with Mastra AI framework for building conversational agents. Uses Claude AI via Anthropic API.

## Critical Rules
- Never use mock data as a workaround (use real API calls or proper error states)
- Always use `@/*` path aliases for imports (not relative paths)
- Use Server Components by default; add `"use client"` only when needed

## Code Conventions

### Components
- UI primitives go in `src/components/ui/` (shadcn pattern)
- AI visualization components go in `src/components/ai-elements/`
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- Follow class-variance-authority (cva) pattern for component variants

### AI Agents (Mastra)
- Agent definitions go in `src/mastra/agents/`
- Workflows go in `src/mastra/workflows/`
- Tools go in `src/mastra/tools/`
- Always use Zod schemas for tool inputs/outputs
- Prefer streaming responses for user-facing agent output

### Styling
- Tailwind CSS v4 with CSS variables for theming
- Dark mode uses CSS custom properties (--background, --foreground, etc.)
- Never use inline styles; use Tailwind utilities

## Architecture

```
src/
├── app/           # Next.js routes (App Router)
├── components/
│   ├── ui/        # Reusable UI primitives
│   └── ai-elements/  # AI output visualizations
├── lib/           # Utilities and helpers
└── mastra/        # AI agents, tools, workflows
```

## Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Environment Variables
```
ANTHROPIC_API_KEY  # Required for Claude AI
```

## Testing
No test framework configured yet. When adding tests:
- Use Vitest for unit tests
- Use Playwright for E2E tests

<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_workflow_overview()` tool to load the tool-oriented overview (it lists the matching guide tools).

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and completion
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->
