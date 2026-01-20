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
  onboarding_completed_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast Clerk ID lookups
CREATE INDEX idx_user_profiles_clerk_id ON user_profiles(clerk_id);

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles synced from Clerk with union-specific settings';
```

### Queries Table (Legacy)

> **Note:** This table is kept for backward compatibility. New conversations use the `conversations` and `messages` tables below.

Stores single-turn query history.

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

### Conversations Table

Stores multi-turn conversation sessions.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user lookup
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Index for ordering by most recent
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- Add comment
COMMENT ON TABLE conversations IS 'Multi-turn conversation sessions';
```

### Messages Table

Stores individual messages within conversations.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast conversation message lookup
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- Add comment
COMMENT ON TABLE messages IS 'Individual messages within conversations';
```

## Row Level Security (RLS)

Enable RLS on all tables. The application uses `service_role` (admin client) which bypasses RLS, since Clerk auth doesn't create Supabase sessions.

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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

-- Conversations: Users can only access their own conversations
CREATE POLICY "Users can manage own conversations"
  ON conversations FOR ALL
  USING (true);  -- Actual filtering done in application code via user_id

-- Messages: Users can only access messages in their conversations
CREATE POLICY "Users can manage messages in own conversations"
  ON messages FOR ALL
  USING (true);  -- Actual filtering done in application code via conversation_id join
```

> **Note:** RLS policies are permissive (`USING (true)`) because the app uses `createAdminClient` which bypasses RLS. Authorization is enforced in application code by filtering on `user_id` from Clerk session.

## Column Descriptions

### user_profiles

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Internal primary key |
| `clerk_id` | TEXT | Clerk user ID (unique, used for auth lookup) |
| `email` | TEXT | User's primary email from Clerk |
| `local_number` | TEXT | Union local number (e.g., "396") |
| `classification` | TEXT | Job classification (e.g., "rpcd", "feeder", "pt-hub") |
| `supplement_ids` | TEXT[] | Array of supplement document IDs (e.g., `["master", "western", "southwest-package"]`) |
| `onboarding_completed_at` | TIMESTAMPTZ | When user completed onboarding (NULL if incomplete) |
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

### conversations

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Conversation primary key |
| `user_id` | UUID | References user_profiles.id |
| `title` | TEXT | Auto-generated from first message or user-set (nullable) |
| `created_at` | TIMESTAMPTZ | When conversation was started |
| `updated_at` | TIMESTAMPTZ | When last message was added |

### messages

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Message primary key |
| `conversation_id` | UUID | References conversations.id |
| `role` | TEXT | Either 'user' or 'assistant' |
| `content` | TEXT | Message text content |
| `citations` | JSONB | Array of citation objects (for assistant messages) |
| `created_at` | TIMESTAMPTZ | When message was sent |

### Citation Object Schema

```typescript
interface Citation {
  source: string;      // Document ID (e.g., "master", "western")
  text: string;        // Raw citation text
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
├── 20260119203957_initial_schema.sql           # user_profiles, queries tables + RLS
├── 20260119210000_add_onboarding_completed_at.sql  # Add onboarding timestamp column
└── 20260120_add_conversations.sql              # conversations, messages tables + RLS
```

## Classification Values

Valid job classification values stored in `user_profiles.classification`:

| Value | Display Name |
|-------|--------------|
| `rpcd` | Package Car Driver (RPCD) |
| `feeder` | Feeder Driver |
| `pt-hub` | Part-Time Hub/Sort |
| `22.3` | 22.3 Combination |
| `22.4` | 22.4 Driver |
| `air` | Air Driver |
| `automotive` | Automotive/Mechanic |
| `clerical` | Clerical |
| `other: <description>` | Other (with user-provided description) |

## Supplement IDs

The `supplement_ids` array contains document identifiers based on the user's Local union:

| ID | Document |
|----|----------|
| `master` | National Master UPS Agreement |
| `western` | Western Region Supplement |
| `central` | Central Region Supplement |
| `southern` | Southern Region Supplement |
| `atlantic` | Atlantic Area Supplement |
| `eastern` | Eastern Region Supplement |
| `local-804` | Local 804 Agreement (standalone) |
| `local-705` | Local 705 Agreement (standalone) |
| `local-710` | Local 710 Agreement (standalone) |
| `southwest-package` | Southwest Package Rider |
| `northern-california` | Northern California Rider |
| `southern-california` | Southern California Rider |
| `new-england` | New England Rider |
| `upstate-ny` | Upstate New York Rider |
| `texas` | Texas Rider |
| `ohio-valley` | Ohio Valley Rider |
| `michigan-indiana` | Michigan-Indiana Rider |

The mapping from Local number to supplement IDs is handled by `src/lib/union/mapping.ts`.
