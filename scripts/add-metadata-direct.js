#!/usr/bin/env node

/**
 * Direct script to add metadata column
 * Run this from the apps/api directory where Prisma is available
 */

const { PrismaClient } = require('@prisma/client');

async function addMetadataColumn() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding metadata column to WaitlistEntry table...');
    
    // Use raw SQL to add the column
    await prisma.$executeRaw`
      ALTER TABLE waitlist_entries 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `;
    
    console.log('✅ Successfully added metadata column to WaitlistEntry table');
    
    // Verify the column exists
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_entries' 
      AND column_name = 'metadata';
    `;
    
    console.log('📋 Column verification:', result);
    
  } catch (error) {
    console.error('❌ Error adding metadata column:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addMetadataColumn();
