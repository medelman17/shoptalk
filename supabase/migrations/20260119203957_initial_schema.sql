-- Initial schema for ShopTalk
-- Creates user_profiles and queries tables with RLS policies
-- Uses gen_random_uuid() which is built into PostgreSQL 13+

-- =============================================================================
-- USER PROFILES TABLE
-- Stores user information synced from Clerk, plus union-specific settings
-- =============================================================================

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

-- Index for fast Clerk ID lookups (used by webhook and auth)
CREATE INDEX idx_user_profiles_clerk_id ON user_profiles(clerk_id);

COMMENT ON TABLE user_profiles IS 'User profiles synced from Clerk with union-specific settings';

-- =============================================================================
-- QUERIES TABLE
-- Stores query history for users to review past questions and answers
-- =============================================================================

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

-- Index for time-based queries (recent first)
CREATE INDEX idx_queries_created_at ON queries(created_at DESC);

COMMENT ON TABLE queries IS 'User query history with AI answers and citations';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- The Clerk webhook uses service_role key which bypasses RLS
-- Application code filters by clerk_id/user_id
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- User profiles policies
-- Note: Actual authorization is done in application code via clerk_id matching
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (true);

-- Queries policies
-- Note: Actual authorization is done in application code via user_id join
CREATE POLICY "Users can view own queries"
  ON queries FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own queries"
  ON queries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own queries"
  ON queries FOR DELETE
  USING (true);
