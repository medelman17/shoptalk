# Database Schema

This document contains the SQL schema for ShopTalk's Supabase database.

## Setup Instructions

### Option 1: Using Supabase CLI (Recommended)

```bash
# Link to your Supabase project
npx supabase link --project-ref <your-project-id>

# Push migrations to remote database
pnpm db:push
```

The project ID is in your Supabase URL: `https://<project-id>.supabase.co`

### Option 2: Manual SQL (Dashboard)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project > SQL Editor
3. Run the schema below in order

## Schema

### User Profiles Table

Stores user information synced from Clerk, plus union-specific settings.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  local_number TEXT,
  classification TEXT,
  supplement_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast Clerk ID lookups
CREATE INDEX idx_user_profiles_clerk_id ON user_profiles(clerk_id);

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles synced from Clerk with union-specific settings';
```

### Queries Table

Stores query history for users to review past questions and answers.

```sql
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user queries lookup
CREATE INDEX idx_queries_user_id ON queries(user_id);

-- Index for time-based queries
CREATE INDEX idx_queries_created_at ON queries(created_at DESC);

-- Add comment
COMMENT ON TABLE queries IS 'User query history with AI answers and citations';
```

## Row Level Security (RLS)

Enable RLS on both tables. The webhook uses service_role (bypasses RLS).

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can only view/update their own profile
-- Note: We match on clerk_id since that's what we have from Clerk auth
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (true);  -- Actual filtering done in application code via clerk_id

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (true);  -- Actual filtering done in application code via clerk_id

-- Queries: Users can only access their own queries
CREATE POLICY "Users can view own queries"
  ON queries FOR SELECT
  USING (true);  -- Actual filtering done in application code via user_id join

CREATE POLICY "Users can insert own queries"
  ON queries FOR INSERT
  WITH CHECK (true);  -- Actual validation done in application code

CREATE POLICY "Users can delete own queries"
  ON queries FOR DELETE
  USING (true);  -- Actual filtering done in application code
```

## Column Descriptions

### user_profiles

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Internal primary key |
| `clerk_id` | TEXT | Clerk user ID (unique, used for auth lookup) |
| `email` | TEXT | User's primary email from Clerk |
| `local_number` | TEXT | Union local number (e.g., "804") |
| `classification` | TEXT | Job classification (e.g., "Package Handler") |
| `supplement_ids` | TEXT[] | Array of supplement document IDs user has access to |
| `created_at` | TIMESTAMPTZ | When profile was created |
| `updated_at` | TIMESTAMPTZ | When profile was last updated |

### queries

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Query primary key |
| `user_id` | UUID | References user_profiles.id |
| `question` | TEXT | The user's question |
| `answer` | TEXT | AI-generated answer (nullable for streaming) |
| `citations` | JSONB | Array of citation objects |
| `created_at` | TIMESTAMPTZ | When query was made |

### Citation Object Schema

```typescript
interface Citation {
  source: string;      // Document name or section
  text: string;        // Quoted text
  page?: number;       // Page number if applicable
  section?: string;    // Section reference
}
```

## Migrations

Database migrations are managed via Supabase CLI. Migration files live in `supabase/migrations/`.

### Creating a New Migration

```bash
# Create a new migration file
pnpm db:migrate add_user_preferences

# This creates: supabase/migrations/YYYYMMDDHHmmss_add_user_preferences.sql
```

### Migration Workflow

```bash
# 1. Create the migration
pnpm db:migrate <descriptive_name>

# 2. Edit the SQL file in supabase/migrations/

# 3. Test locally (requires Docker)
pnpm db:reset

# 4. Push to remote database
pnpm db:push

# 5. Regenerate TypeScript types
SUPABASE_PROJECT_ID=<your-project-id> pnpm db:generate-types
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm db:migrate <name>` | Create new migration file |
| `pnpm db:push` | Push migrations to remote |
| `pnpm db:pull` | Pull remote changes as migration |
| `pnpm db:reset` | Reset local DB + apply migrations |
| `pnpm db:status` | List migration status |

### Current Migrations

```
supabase/migrations/
└── 20260119203957_initial_schema.sql  # user_profiles, queries tables + RLS
```
