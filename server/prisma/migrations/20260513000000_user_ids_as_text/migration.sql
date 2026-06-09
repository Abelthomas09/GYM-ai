-- Neon Auth user IDs are opaque strings, not guaranteed PostgreSQL UUIDs.
ALTER TABLE "user_profiles"
  ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;

ALTER TABLE "training_plans"
  ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
