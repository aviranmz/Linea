#!/usr/bin/env node

/**
 * Script that uses the existing API infrastructure
 * This should work since the API is already running and has database access
 */

const { execSync } = require('child_process');

async function addMetadataColumn() {
  try {
    console.log('🔧 Adding metadata column using API infrastructure...');
    
    // Use the existing API's database connection
    // The API already has Prisma configured and working
    const sqlCommand = `
      cd apps/api && node -e "
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        async function addColumn() {
          try {
            await prisma.\$executeRaw\`ALTER TABLE waitlist_entries ADD COLUMN IF NOT EXISTS metadata JSONB;\`;
            console.log('✅ Successfully added metadata column');
            
            const result = await prisma.\$queryRaw\`
              SELECT column_name, data_type 
              FROM information_schema.columns 
              WHERE table_name = 'waitlist_entries' 
              AND column_name = 'metadata';
            \`;
            console.log('📋 Verification:', result);
            
          } catch (error) {
            console.error('❌ Error:', error);
            process.exit(1);
          } finally {
            await prisma.\$disconnect();
          }
        }
        
        addColumn();
      "
    `;
    
    console.log('Executing via API directory...');
    execSync(sqlCommand, { 
      stdio: 'inherit',
      encoding: 'utf8',
      cwd: '/app'
    });
    
    console.log('✅ Successfully added metadata column to WaitlistEntry table');
    
  } catch (error) {
    console.error('❌ Error adding metadata column:', error);
    process.exit(1);
  }
}

addMetadataColumn();
