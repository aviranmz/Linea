#!/usr/bin/env node

/**
 * INLINE METADATA FIX
 * This script creates a temporary file in the API directory and runs it there
 * Run from root: node scripts/metadata-fix-inline.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Creating metadata fix script in API directory...');

// Create the script content
const scriptContent = `
const { PrismaClient } = require('@prisma/client');

async function fixMetadataColumn() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding metadata column to waitlist_entries table...');
    
    await prisma.$executeRaw\`
      ALTER TABLE waitlist_entries 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    \`;
    
    console.log('✅ Successfully added metadata column');
    
    const result = await prisma.$queryRaw\`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_entries' 
      AND column_name = 'metadata';
    \`;
    
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
`;

// Write the script to the API directory
const scriptPath = path.join(__dirname, '..', 'apps', 'api', 'temp-metadata-fix.js');
fs.writeFileSync(scriptPath, scriptContent);

try {
  console.log('🚀 Running metadata fix from API directory...');
  
  // Run the script from the API directory
  execSync('node temp-metadata-fix.js', { 
    cwd: path.join(__dirname, '..', 'apps', 'api'),
    stdio: 'inherit'
  });
  
  console.log('✅ Metadata fix completed successfully!');
  
} catch (error) {
  console.error('❌ Error running metadata fix:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary file
  try {
    fs.unlinkSync(scriptPath);
    console.log('🧹 Cleaned up temporary file');
  } catch (cleanupError) {
    console.warn('⚠️ Could not clean up temporary file:', cleanupError.message);
  }
}
