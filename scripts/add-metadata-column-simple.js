#!/usr/bin/env node

/**
 * Simple script to add metadata column using raw SQL
 * This doesn't require Prisma client
 */

const { Client } = require('pg');

async function addMetadataColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    console.log('🔧 Adding metadata column to WaitlistEntry table...');
    
    await client.connect();
    
    // Add the column
    await client.query(`
      ALTER TABLE waitlist_entries 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `);
    
    console.log('✅ Successfully added metadata column to WaitlistEntry table');
    
    // Verify the column exists
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_entries' 
      AND column_name = 'metadata';
    `);
    
    console.log('📋 Column verification:', result.rows);
    
  } catch (error) {
    console.error('❌ Error adding metadata column:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMetadataColumn();
