-- AddEventLocationFields
-- Add new location fields to Event model for user-friendly address input

ALTER TABLE "events" ADD COLUMN "streetAddress" TEXT;
ALTER TABLE "events" ADD COLUMN "city" TEXT;
ALTER TABLE "events" ADD COLUMN "country" TEXT;
ALTER TABLE "events" ADD COLUMN "postalCode" TEXT;
