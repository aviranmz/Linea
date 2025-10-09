#!/usr/bin/env node

/**
 * Simple Production Reseed Script
 * 
 * This script runs the seed script directly from the API directory.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚨 WARNING: This will wipe and reseed the production database!');
console.log('📊 Database URL:', process.env.DATABASE_URL || 'Using default');
console.log('');

try {
  // Navigate to the API directory
  const apiDir = path.join(__dirname, '../apps/api');
  
  console.log('🔨 Building API...');
  execSync('pnpm build', { cwd: apiDir, stdio: 'inherit' });
  
  console.log('🌱 Running seed script...');
  execSync('node dist/seed.js', { cwd: apiDir, stdio: 'inherit' });
  
  console.log('✅ Production reseed complete!');
  
} catch (error) {
  console.error('❌ Error during reseed:', error.message);
  process.exit(1);
}
