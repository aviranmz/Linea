import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Setting up Prisma baseline for existing database...')

  try {
    // Check if we're in the right directory
    const prismaSchemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
    if (!existsSync(prismaSchemaPath)) {
      throw new Error('Prisma schema not found. Please run this script from the project root.')
    }

    // First, let's check the current database state
    console.log('📊 Checking current database state...')
    
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    console.log('📋 Existing tables:', tables)

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

    // Get the latest migration from the migrations folder
    const migrationsPath = join(process.cwd(), 'prisma', 'migrations')
    let latestMigration = null
    
    if (existsSync(migrationsPath)) {
      const fs = require('fs')
      const migrationDirs = fs.readdirSync(migrationsPath)
        .filter((dir: string) => dir !== '.gitkeep')
        .sort()
      
      if (migrationDirs.length > 0) {
        latestMigration = migrationDirs[migrationDirs.length - 1]
        console.log(`📁 Latest migration found: ${latestMigration}`)
      }
    }

    // Create a baseline migration record
    const baselineId = `baseline-${Date.now()}`
    const baselineMigration = {
      id: baselineId,
      checksum: 'baseline-existing-schema',
      finished_at: new Date(),
      migration_name: 'baseline',
      logs: 'Database baseline - existing production schema',
      started_at: new Date(),
      applied_steps_count: 1
    }

    // Insert the baseline migration
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

    console.log('✅ Prisma baseline set successfully!')
    console.log('🎉 You can now run `npx prisma migrate deploy` or `npx prisma db push`')

    // Try to run prisma generate to ensure the client is up to date
    console.log('🔄 Generating Prisma client...')
    try {
      execSync('npx prisma generate', { stdio: 'inherit' })
      console.log('✅ Prisma client generated successfully')
    } catch (error) {
      console.warn('⚠️  Prisma generate failed, but baseline is set:', error)
    }

  } catch (error) {
    console.error('❌ Error setting up Prisma baseline:', error)
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
