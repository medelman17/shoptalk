# ShopTalk - AI-Powered Contract Retrieval

## Quick Context
Next.js 16 app with Mastra AI framework for building conversational agents. Uses Claude AI via Anthropic API, Clerk for authentication, and Supabase for database.

## Critical Rules
- Never use mock data as a workaround (use real API calls or proper error states)
- Always use `@/*` path aliases for imports (not relative paths)
- Use Server Components by default; add `"use client"` only when needed
- Database changes must go through migrations (never modify schema directly)

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

### Authentication (Clerk)
- Auth utilities in `src/lib/auth.ts`
- Route protection via `src/middleware.ts`
- Auth pages in `src/app/(auth)/`
- Webhook handler at `/api/webhooks/clerk`

### Database (Supabase)
- Supabase clients in `src/lib/supabase/` (client.ts, server.ts, admin.ts)
- Data access layer in `src/lib/db/`
- Types in `src/lib/supabase/types.ts`
- Migrations in `supabase/migrations/`

### Styling
- Tailwind CSS v4 with CSS variables for theming
- Dark mode uses CSS custom properties (--background, --foreground, etc.)
- Never use inline styles; use Tailwind utilities

## Architecture

```
src/
├── app/              # Next.js routes (App Router)
│   ├── (auth)/       # Auth pages (sign-in, sign-up)
│   └── api/webhooks/ # Webhook handlers
├── components/
│   ├── ui/           # Reusable UI primitives
│   └── ai-elements/  # AI output visualizations
├── lib/
│   ├── auth.ts       # Auth utilities
│   ├── supabase/     # Supabase clients
│   └── db/           # Data access layer
├── mastra/           # AI agents, tools, workflows
└── middleware.ts     # Route protection
supabase/
├── migrations/       # Database migrations
└── seed.sql          # Test data for local dev
```

## Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks

# Database (Supabase CLI)
pnpm db:migrate <name>  # Create new migration
pnpm db:push            # Push migrations to remote
pnpm db:pull            # Pull remote schema changes
pnpm db:reset           # Reset local DB (requires Docker)
pnpm db:status          # List migration status
pnpm db:generate-types  # Generate TypeScript types from schema
```

## Environment Variables
```
# AI
ANTHROPIC_API_KEY           # Required for Claude AI

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET        # For /api/webhooks/clerk

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # Server-side only, bypasses RLS
```

## Database Migrations

Always use migrations for schema changes:

```bash
# 1. Create a new migration
pnpm db:migrate add_new_table

# 2. Edit the file in supabase/migrations/

# 3. Push to remote database
pnpm db:push

# 4. Regenerate TypeScript types
SUPABASE_PROJECT_ID=xxx pnpm db:generate-types
```

See `docs/DATABASE.md` for schema documentation.

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
