#!/usr/bin/env tsx

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { getConfig } from '@linea/config';

async function runMigrations() {
  console.log('🚀 Starting database migrations...');

  try {
    const config = getConfig();
    console.log(
      '📊 Database URL:',
      config.database.DATABASE_URL ? 'Set' : 'Not set'
    );

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.database.DATABASE_URL,
        },
      },
    });

    // Test connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');

    // Run migrations
    console.log('📝 Running Prisma migrations...');
    const { execSync } = await import('child_process');

    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: config.database.DATABASE_URL },
      });
      console.log('✅ Migrations completed successfully!');
    } catch (migrationError) {
      console.error('❌ Migration failed:', migrationError);
      throw migrationError;
    }

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    try {
      execSync('npx prisma generate', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: config.database.DATABASE_URL },
      });
      console.log('✅ Prisma client generated successfully!');
    } catch (generateError) {
      console.error('❌ Prisma client generation failed:', generateError);
      throw generateError;
    }

    // Test tables
    console.log('🔍 Checking created tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Created tables:', tables);

    await prisma.$disconnect();
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
