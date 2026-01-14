# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ShopTalk is a UPS Teamster contract assistant mobile app. It uses RAG (Retrieval-Augmented Generation) to help workers find contract language quickly using natural language queries with cited responses.

## Commands

```bash
# Install dependencies
pnpm install

# Development (runs all apps in parallel)
pnpm dev

# Type checking across all packages
pnpm type-check

# Database operations
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio

# Run specific workspace
pnpm --filter @shoptalk/api dev      # API only
pnpm --filter @shoptalk/mobile start  # Mobile only

# Document ingestion
pnpm --filter @shoptalk/ingest seed:locals  # Seed locals data
pnpm --filter @shoptalk/ingest ingest       # Process PDFs into Pinecone
```

## Architecture

### Monorepo Structure (Turborepo + pnpm workspaces)

- **apps/mobile** - Expo React Native app with Expo Router (file-based routing)
- **apps/api** - Hono API server deployed to Cloudflare Workers
- **packages/db** - Drizzle ORM schema and Neon database client
- **packages/shared** - Shared TypeScript types and constants
- **tools/ingest** - PDF processing pipeline for document ingestion

### Data Flow

1. User authenticates via Clerk magic links (phone/email)
2. Onboarding captures Local union number → determines applicable contract documents
3. Query submitted → API generates embedding → Pinecone hybrid search (filtered by user's documents)
4. Top chunks passed to Claude → generates cited response
5. Citations link to PDF pages in Supabase Storage

### Key Patterns

**Mobile Navigation** (`apps/mobile/app/`):
- `(auth)/` - Sign-in flow screens
- `(onboarding)/` - Local selection, classification, confirmation
- `(main)/` - Tab navigator (Ask, History, Settings)
- `document/[id].tsx` - PDF viewer

**API Routes** (`apps/api/src/routes/`):
- All routes use `requireAuth` middleware for Clerk JWT validation
- Query endpoint implements full RAG pipeline with citation parsing
- Clerk webhook syncs user contact info changes

**Database Schema** (`packages/db/src/schema.ts`):
- `users` - Linked to Clerk ID, stores Local number and classification
- `locals` - Local-to-supplement mapping with region info
- `documents` - Contract PDFs with metadata
- `localDocuments` - Many-to-many linking locals to applicable documents
- `queries` - Query history with citations stored as JSONB

**State Management** (mobile):
- Zustand stores in `apps/mobile/stores/`
- `useUserStore` - Profile with AsyncStorage persistence
- `useOnboardingStore` - Temporary onboarding state

### External Services

| Service | Purpose |
|---------|---------|
| Clerk | Authentication (magic links) |
| Supabase | Postgres database + PDF storage |
| Pinecone | Vector database for document chunks |
| OpenAI | text-embedding-3-large for embeddings |
| Anthropic | Claude for response generation |
| PostHog | Analytics |
| Sentry | Error tracking |

## Code Conventions

- All responses from the query endpoint must include inline citations in `[Article X, Section Y, Page Z]` format
- Contract responses must end with the legal disclaimer
- User's applicable documents are determined by their Local number, not manually selected
- Never use mock data as workarounds

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
