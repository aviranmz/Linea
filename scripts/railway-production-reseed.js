#!/usr/bin/env node

/**
 * Railway Production Reseed Script
 * 
 * This script should be run directly in the Railway environment
 * to wipe and reseed the production database.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function wipeAndReseed() {
  console.log('🚨 WARNING: Wiping production database...');
  console.log('📊 Database URL:', process.env.DATABASE_URL ? 'Using env var' : 'Using default');
  
  try {
    // Wipe all data in correct order
    console.log('🗑️  Wiping database...');
    
    await prisma.waitlistEntry.deleteMany({});
    console.log('  ✅ Waitlist entries deleted');
    
    await prisma.event.deleteMany({});
    console.log('  ✅ Events deleted');
    
    await prisma.venue.deleteMany({});
    console.log('  ✅ Venues deleted');
    
    await prisma.category.deleteMany({});
    console.log('  ✅ Categories deleted');
    
    await prisma.product.deleteMany({});
    console.log('  ✅ Products deleted');
    
    await prisma.area.deleteMany({});
    console.log('  ✅ Areas deleted');
    
    await prisma.user.deleteMany({});
    console.log('  ✅ Users deleted');
    
    console.log('✅ Database wiped successfully!');
    
    // Now run the seed script
    console.log('🌱 Running seed script...');
    
    // Import and run the seed function
    const seedModule = require('../apps/api/dist/seed.js');
    if (seedModule.seedDatabase) {
      await seedModule.seedDatabase();
    } else {
      console.log('Running default seed...');
      await seedModule.default();
    }
    
    console.log('✅ Production database reseeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run immediately
wipeAndReseed();
