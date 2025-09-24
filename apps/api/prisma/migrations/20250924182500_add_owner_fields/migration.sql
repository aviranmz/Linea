-- Up: add optional owner profile fields to users table
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "businessName" TEXT,
  ADD COLUMN IF NOT EXISTS "website" TEXT,
  ADD COLUMN IF NOT EXISTS "address" TEXT,
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "country" TEXT;

-- Down: remove added columns
-- Note: Wrap in IF EXISTS to avoid errors if already dropped
ALTER TABLE "users"
  DROP COLUMN IF EXISTS "country",
  DROP COLUMN IF EXISTS "city",
  DROP COLUMN IF EXISTS "address",
  DROP COLUMN IF EXISTS "website",
  DROP COLUMN IF EXISTS "businessName",
  DROP COLUMN IF EXISTS "phone";

