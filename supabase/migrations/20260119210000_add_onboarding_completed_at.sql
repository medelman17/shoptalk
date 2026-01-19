-- Add onboarding_completed_at column to track when users completed onboarding
-- Using a timestamp instead of boolean allows for analytics and audit trails

ALTER TABLE user_profiles
ADD COLUMN onboarding_completed_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN user_profiles.onboarding_completed_at IS 'Timestamp when user completed onboarding, NULL if not completed';
