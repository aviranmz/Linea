#!/usr/bin/env node

/**
 * Ultra-simple script using only built-in Node.js modules
 * This should work in any environment
 */

const { execSync } = require('child_process');

async function addMetadataColumn() {
  try {
    console.log('🔧 Adding metadata column to WaitlistEntry table...');
    
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable not found');
    }
    
    // Use psql to execute the SQL command
    const sqlCommand = `
      ALTER TABLE waitlist_entries 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `;
    
    console.log('Executing SQL command...');
    execSync(`psql "${databaseUrl}" -c "${sqlCommand}"`, { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    console.log('✅ Successfully added metadata column to WaitlistEntry table');
    
    // Verify the column exists
    const verifyCommand = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_entries' 
      AND column_name = 'metadata';
    `;
    
    console.log('📋 Verifying column was added...');
    execSync(`psql "${databaseUrl}" -c "${verifyCommand}"`, { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
  } catch (error) {
    console.error('❌ Error adding metadata column:', error);
    process.exit(1);
  }
}

addMetadataColumn();
