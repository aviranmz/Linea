-- Add optional JSONB theme settings to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "theme" JSONB;


