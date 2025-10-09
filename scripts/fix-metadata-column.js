#!/usr/bin/env node

/**
 * SIMPLE METADATA COLUMN FIX
 * This script adds the metadata column to waitlist_entries table
 * Run from the API directory: cd apps/api && node ../../scripts/fix-metadata-column.js
 */

const { PrismaClient } = require('@prisma/client');

async function fixMetadataColumn() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding metadata column to waitlist_entries table...');
    
    // Add the metadata column
    await prisma.$executeRaw`
      ALTER TABLE waitlist_entries 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `;
    
    console.log('✅ Successfully added metadata column');
    
    // Verify the column exists
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_entries' 
      AND column_name = 'metadata';
    `;
    
    console.log('📋 Verification result:', result);
    
    if (result && result.length > 0) {
      console.log('✅ Metadata column successfully added and verified!');
    } else {
      console.log('❌ Column verification failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMetadataColumn();
