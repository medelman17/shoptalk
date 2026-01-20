-- Add conversations and messages tables for multi-turn chat support
-- Conversations group related messages together
-- Messages store individual user/assistant turns with citations

-- =============================================================================
-- CONVERSATIONS TABLE
-- Groups related messages into a single conversation thread
-- =============================================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT, -- Auto-generated from first message or user-set
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

COMMENT ON TABLE conversations IS 'Chat conversation threads for users';

-- =============================================================================
-- MESSAGES TABLE
-- Stores individual messages within a conversation
-- =============================================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient conversation message lookups
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at ASC);

COMMENT ON TABLE messages IS 'Individual messages within a conversation';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Application code filters by user_id through conversation ownership
-- =============================================================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
-- Note: Actual authorization is done in application code via user_id matching
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (true);

-- Messages policies
-- Note: Access control enforced through conversation ownership in app code
CREATE POLICY "Users can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update messages"
  ON messages FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete messages"
  ON messages FOR DELETE
  USING (true);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- Automatically update the updated_at timestamp when conversation is modified
-- =============================================================================

CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_updated_at();

-- Also update conversation's updated_at when a message is added
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();
