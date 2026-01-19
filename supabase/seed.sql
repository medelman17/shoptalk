-- Seed data for local development
-- This file is run after migrations when using `supabase db reset`

-- Note: In production, user_profiles are created via Clerk webhook
-- This seed data is only for local testing without Clerk

-- Example test user (use a fake clerk_id for local dev)
INSERT INTO user_profiles (clerk_id, email, local_number, classification)
VALUES
  ('user_test_123', 'test@example.com', '804', 'Package Handler'),
  ('user_test_456', 'demo@example.com', '705', 'Driver')
ON CONFLICT (clerk_id) DO NOTHING;

-- Example queries for the test user
INSERT INTO queries (user_id, question, answer, citations)
SELECT
  id,
  'What is the overtime policy?',
  'According to Article 12 of the Master Agreement, overtime is paid at 1.5x the regular rate for hours worked beyond 8 hours per day or 40 hours per week.',
  '[{"source": "Master Agreement", "text": "Article 12 - Overtime", "page": 45}]'::jsonb
FROM user_profiles
WHERE clerk_id = 'user_test_123'
ON CONFLICT DO NOTHING;
