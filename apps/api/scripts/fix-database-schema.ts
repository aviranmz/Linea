import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Fixing database schema issues...')

  try {
    // First, let's check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `
    console.log('📋 Existing tables:', tables)

    // Check if WaitlistEntry table exists
    const waitlistTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'waitlist_entries'
      )
    `
    console.log('🔍 WaitlistEntry table exists:', waitlistTableExists)

    // If WaitlistEntry table doesn't exist, create it
    if (!waitlistTableExists[0]?.exists) {
      console.log('🏗️  Creating WaitlistEntry table...')
      
      await prisma.$executeRaw`
        CREATE TABLE "waitlist_entries" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "eventId" TEXT NOT NULL,
          "userId" TEXT,
          "status" "WaitlistStatus" NOT NULL DEFAULT 'PENDING',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "deletedAt" TIMESTAMP(3),
          CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
        )
      `

      // Create indexes
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "waitlist_entries_email_eventId_key" ON "waitlist_entries"("email", "eventId")
      `
      await prisma.$executeRaw`
        CREATE INDEX "waitlist_entries_eventId_idx" ON "waitlist_entries"("eventId")
      `
      await prisma.$executeRaw`
        CREATE INDEX "waitlist_entries_email_idx" ON "waitlist_entries"("email")
      `

      // Create foreign key constraints
      await prisma.$executeRaw`
        ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_eventId_fkey" 
        FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `
      await prisma.$executeRaw`
        ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `

      console.log('✅ WaitlistEntry table created successfully')
    }

    // Check if we need to create the WaitlistStatus enum
    const enumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM pg_type 
        WHERE typname = 'WaitlistStatus'
      )
    `
    
    if (!enumExists[0]?.exists) {
      console.log('🏗️  Creating WaitlistStatus enum...')
      await prisma.$executeRaw`
        CREATE TYPE "WaitlistStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'APPROVED', 'REJECTED', 'ARRIVED')
      `
      console.log('✅ WaitlistStatus enum created successfully')
    }

    // Update the Prisma migration history to mark this as applied
    console.log('📝 Updating Prisma migration history...')
    
    // Check if _prisma_migrations table exists
    const migrationsTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      )
    `

    if (!migrationsTableExists[0]?.exists) {
      console.log('🏗️  Creating Prisma migrations table...')
      await prisma.$executeRaw`
        CREATE TABLE "_prisma_migrations" (
          "id" VARCHAR(36) NOT NULL,
          "checksum" VARCHAR(64) NOT NULL,
          "finished_at" TIMESTAMP(3),
          "migration_name" VARCHAR(255) NOT NULL,
          "logs" TEXT,
          "rolled_back_at" TIMESTAMP(3),
          "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
          CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
        )
      `
    }

    // Insert a baseline migration record
    const baselineMigration = {
      id: 'baseline-' + Date.now(),
      checksum: 'baseline',
      finished_at: new Date(),
      migration_name: 'baseline',
      logs: 'Database baseline - existing schema',
      started_at: new Date(),
      applied_steps_count: 1
    }

    await prisma.$executeRaw`
      INSERT INTO "_prisma_migrations" (
        "id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count"
      ) VALUES (
        ${baselineMigration.id},
        ${baselineMigration.checksum},
        ${baselineMigration.finished_at},
        ${baselineMigration.migration_name},
        ${baselineMigration.logs},
        ${baselineMigration.started_at},
        ${baselineMigration.applied_steps_count}
      ) ON CONFLICT (id) DO NOTHING
    `

    console.log('✅ Database schema fixed successfully!')
    console.log('🎉 You can now run migrations without issues')

  } catch (error) {
    console.error('❌ Error fixing database schema:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
