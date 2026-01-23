# ShopTalk - Suggested Commands

## Development

```bash
# Start development server
pnpm dev

# Start both Next.js and Mastra dev servers
pnpm dev:all

# Production build
pnpm build

# Start production server
pnpm start
```

## Code Quality

```bash
# Run ESLint
pnpm lint

# Type checking (no emit)
pnpm type-check
```

## Database (Supabase)

```bash
# Create new migration
pnpm db:migrate <migration_name>

# Push migrations to remote
pnpm db:push

# Pull remote schema changes
pnpm db:pull

# Reset local database (requires Docker)
pnpm db:reset

# List migration status
pnpm db:status

# Generate TypeScript types from schema
SUPABASE_PROJECT_ID=xxx pnpm db:generate-types
```

## Document Ingestion (RAG)

```bash
# List available documents
pnpm tsx scripts/ingest-contracts.ts --list

# Create Pinecone index
pnpm tsx scripts/ingest-contracts.ts --setup

# Show index statistics
pnpm tsx scripts/ingest-contracts.ts --stats

# Ingest all documents
pnpm tsx scripts/ingest-contracts.ts

# Ingest single document
pnpm tsx scripts/ingest-contracts.ts --id <document_id>
```

## Evaluation Dataset (Reddit)

```bash
# Fetch Q&A data from r/UPSers
pnpm eval:fetch

# Test with single query
pnpm eval:fetch -q "grievance" -l 20

# Show dataset statistics
pnpm eval:stats

# Resume interrupted fetch
pnpm eval:fetch --resume

# Dry run (analyze without writing)
pnpm eval:fetch --dry-run
```

## Validation

```bash
# Validate contract mappings
pnpm validate:mappings
```

## System Utilities (macOS/Darwin)

```bash
# Git operations
git status
git add .
git commit -m "message"
git push

# File operations
ls -la
cd <directory>
cat <file>

# Search
grep -r "pattern" .
find . -name "*.ts"
```
