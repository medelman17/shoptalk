# ShopTalk - Code Conventions & Style

## TypeScript Configuration
- **Strict mode** enabled
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path aliases**: `@/*` maps to `./src/*`

## Import Conventions
- Always use `@/*` path aliases (not relative paths like `../../`)
- Example: `import { Button } from "@/components/ui/button"`

## Component Conventions

### File Organization
- UI primitives: `src/components/ui/` (shadcn pattern)
- AI visualization: `src/components/ai-elements/`
- Feature components: `src/components/<feature>/`

### Component Pattern
- Use Server Components by default
- Add `"use client"` only when client interactivity is needed
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes

### Styling
- Use Tailwind CSS utilities (never inline styles)
- Dark mode via CSS custom properties (--background, --foreground, etc.)
- Use class-variance-authority (cva) for component variants

## AI/Agent Conventions (Mastra)

### Directory Structure
- Agent definitions: `src/mastra/agents/`
- Workflows: `src/mastra/workflows/`
- Tools: `src/mastra/tools/`

### Tool Patterns
- Always use Zod schemas for tool inputs/outputs
- Prefer streaming responses for user-facing agents

## Database Conventions

### Schema Changes
- Always use migrations (never modify schema directly)
- Migrations in `supabase/migrations/`

### Data Access
- Use `createAdminClient` for server-side operations (Clerk auth doesn't have Supabase session)
- Data access layer in `src/lib/db/`

## Code Quality Rules
- Never use mock data as workarounds
- Use real API calls or proper error states
- No emojis in code unless explicitly requested

## ESLint Configuration
- Uses eslint-config-next (core-web-vitals + typescript)
- `src/components/ai-elements/` is excluded from linting (pre-existing issues)
