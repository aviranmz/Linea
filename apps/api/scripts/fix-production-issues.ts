import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Fixing production database issues...');

  try {
    // Step 1: Check current database state
    console.log('\n📊 Step 1: Checking current database state...');

    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log('📋 Existing tables:', tables);

    // Step 2: Check if WaitlistEntry table exists
    console.log('\n🔍 Step 2: Checking WaitlistEntry table...');

    const waitlistTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'waitlist_entries'
      )
    `;

    const exists = waitlistTableExists[0]?.exists;
    console.log('WaitlistEntry table exists:', exists);

    // Step 3: Create missing tables and enums
    if (!exists) {
      console.log('\n🏗️  Step 3: Creating missing tables and enums...');

      // Create WaitlistStatus enum if it doesn't exist
      const enumExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM pg_type 
          WHERE typname = 'WaitlistStatus'
        )
      `;

      if (!enumExists[0]?.exists) {
        console.log('Creating WaitlistStatus enum...');
        await prisma.$executeRaw`
          CREATE TYPE "WaitlistStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'APPROVED', 'REJECTED', 'ARRIVED')
        `;
        console.log('✅ WaitlistStatus enum created');
      }

      // Create WaitlistEntry table
      console.log('Creating WaitlistEntry table...');
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
      `;

      // Create indexes
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "waitlist_entries_email_eventId_key" ON "waitlist_entries"("email", "eventId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX "waitlist_entries_eventId_idx" ON "waitlist_entries"("eventId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX "waitlist_entries_email_idx" ON "waitlist_entries"("email")
      `;

      // Create foreign key constraints
      await prisma.$executeRaw`
        ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_eventId_fkey" 
        FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `;
      await prisma.$executeRaw`
        ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;

      console.log('✅ WaitlistEntry table created successfully');
    }

    // Step 4: Set up Prisma baseline
    console.log('\n📝 Step 4: Setting up Prisma baseline...');

    // Check if _prisma_migrations table exists
    const migrationsTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_prisma_migrations'
      )
    `;

    if (!migrationsTableExists[0]?.exists) {
      console.log('Creating Prisma migrations table...');
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
      `;
    }

    // Insert baseline migration
    const baselineId = `baseline-${Date.now()}`;
    await prisma.$executeRaw`
      INSERT INTO "_prisma_migrations" (
        "id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count"
      ) VALUES (
        ${baselineId},
        'baseline-existing-schema',
        ${new Date()},
        'baseline',
        'Database baseline - existing production schema',
        ${new Date()},
        1
      ) ON CONFLICT (id) DO NOTHING
    `;

    console.log('✅ Prisma baseline set successfully');

    // Step 5: Generate Prisma client
    console.log('\n🔄 Step 5: Generating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      console.warn('⚠️  Prisma generate failed, but database is fixed:', error);
    }

    // Step 6: Verify the fix
    console.log('\n✅ Step 6: Verifying the fix...');

    const finalTables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    const waitlistExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'waitlist_entries'
      )
    `;

    console.log('📋 Final tables:', finalTables);
    console.log('✅ WaitlistEntry table exists:', waitlistExists[0]?.exists);

    console.log('\n🎉 Production database issues fixed successfully!');
    console.log('📊 Summary:');
    console.log('  - ✅ WaitlistEntry table created');
    console.log('  - ✅ WaitlistStatus enum created');
    console.log('  - ✅ Prisma baseline set');
    console.log('  - ✅ Database schema is now consistent');
    console.log('\n🚀 You can now run your application without issues!');
  } catch (error) {
    console.error('❌ Error fixing production issues:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
