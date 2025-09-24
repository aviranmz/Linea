-- Extend enum WaitlistStatus with APPROVED, REJECTED, ARRIVED
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = 'WaitlistStatus') THEN
    -- enum will be created by Prisma if missing
    RAISE NOTICE 'WaitlistStatus enum not found; will be created by Prisma migrations.';
  END IF;
END $$;

-- Add values if not present
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'WaitlistStatus' AND e.enumlabel = 'APPROVED') THEN
    ALTER TYPE "WaitlistStatus" ADD VALUE 'APPROVED';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'WaitlistStatus' AND e.enumlabel = 'REJECTED') THEN
    ALTER TYPE "WaitlistStatus" ADD VALUE 'REJECTED';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'WaitlistStatus' AND e.enumlabel = 'ARRIVED') THEN
    ALTER TYPE "WaitlistStatus" ADD VALUE 'ARRIVED';
  END IF;
END $$;


