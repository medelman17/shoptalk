# ShopTalk - Task Completion Checklist

## Before Completing Any Task

### 1. Code Quality Checks
```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

### 2. Build Verification
```bash
# Ensure production build succeeds
pnpm build
```

### 3. Code Review Points
- [ ] No mock data used as workarounds
- [ ] All imports use `@/*` path aliases
- [ ] Server Components used by default; `"use client"` only when necessary
- [ ] Tailwind CSS used for styling (no inline styles)
- [ ] Zod schemas defined for any new tool inputs/outputs
- [ ] Database changes go through migrations

## For Database Changes

```bash
# Create migration
pnpm db:migrate <descriptive_name>

# Push to database
pnpm db:push

# Regenerate types
SUPABASE_PROJECT_ID=xxx pnpm db:generate-types
```

## For New Components

- Place UI primitives in `src/components/ui/`
- Place AI visualization in `src/components/ai-elements/`
- Use `cn()` for conditional classes
- Follow cva pattern for variants

## For New Agents/Tools (Mastra)

- Place agents in `src/mastra/agents/`
- Place tools in `src/mastra/tools/`
- Define Zod schemas for inputs/outputs
- Register in `src/mastra/index.ts`

## For RAG/Document Changes

- Update document manifest in `src/lib/documents/manifest.ts`
- Re-run ingestion if content changed:
  ```bash
  pnpm tsx scripts/ingest-contracts.ts --id <document_id>
  ```

## Git Workflow

```bash
# Check status
git status

# Stage changes
git add <files>

# Commit with descriptive message
git commit -m "feat/fix/refactor: description"

# Push changes
git push
```

## Notes
- The project runs on macOS (Darwin)
- Uses pnpm as package manager
- ESLint excludes `src/components/ai-elements/` due to pre-existing issues
- Mastra framework is in beta - expect API changes
