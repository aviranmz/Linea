#!/usr/bin/env node

/**
 * Force Wipe and Reseed Production Database
 * 
 * WARNING: This script will completely wipe the production database
 * and reseed it with fresh data. This is irreversible!
 * 
 * Usage: node scripts/force-wipe-and-reseed-production.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:HlFadiyJ1fTOuq6w@db.zygensgqotmlclleahas.supabase.co:5432/postgres'
    }
  }
});

async function forceWipeAndReseed() {
  console.log('🚨 WARNING: This will completely wipe the production database!');
  console.log('📊 Current database URL:', process.env.DATABASE_URL ? 'Using env var' : 'Using hardcoded URL');
  
  try {
    console.log('\n🗑️  Starting database wipe...');
    
    // Disable foreign key checks temporarily
    await prisma.$executeRaw`SET session_replication_role = replica;`;
    
    // Wipe all data in correct order (respecting foreign keys)
    console.log('  - Deleting waitlist entries...');
    await prisma.waitlistEntry.deleteMany({});
    
    console.log('  - Deleting events...');
    await prisma.event.deleteMany({});
    
    console.log('  - Deleting venues...');
    await prisma.venue.deleteMany({});
    
    console.log('  - Deleting categories...');
    await prisma.category.deleteMany({});
    
    console.log('  - Deleting products...');
    await prisma.product.deleteMany({});
    
    console.log('  - Deleting areas...');
    await prisma.area.deleteMany({});
    
    console.log('  - Deleting users (owners and visitors)...');
    await prisma.user.deleteMany({});
    
    // Re-enable foreign key checks
    await prisma.$executeRaw`SET session_replication_role = DEFAULT;`;
    
    console.log('✅ Database wiped successfully!');
    
    console.log('\n🌱 Starting fresh seeding...');
    
    // Import and run the seed script
    const { seedDatabase } = require('../apps/api/src/seed.ts');
    await seedDatabase();
    
    console.log('✅ Production database wiped and reseeded successfully!');
    
  } catch (error) {
    console.error('❌ Error during wipe and reseed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Add confirmation prompt
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚨 DANGER ZONE: Production Database Wipe & Reseed 🚨');
console.log('This will PERMANENTLY DELETE all production data!');
console.log('');

rl.question('Type "WIPE PRODUCTION" to confirm: ', (answer) => {
  if (answer === 'WIPE PRODUCTION') {
    console.log('✅ Confirmation received. Proceeding with wipe...');
    rl.close();
    forceWipeAndReseed();
  } else {
    console.log('❌ Confirmation failed. Aborting for safety.');
    rl.close();
    process.exit(0);
  }
});
