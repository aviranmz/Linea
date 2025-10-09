#!/usr/bin/env node

/**
 * Production Database Reseed Script
 * 
 * This script wipes the production database and reseeds it with fresh data.
 * Run this in the production environment.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function wipeAndReseed() {
  console.log('🚨 WARNING: Wiping production database...');
  
  try {
    // Wipe all data
    console.log('🗑️  Wiping database...');
    
    await prisma.waitlistEntry.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.venue.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.area.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ Database wiped!');
    
    // Now run the seed script
    console.log('🌱 Running seed script...');
    
    // Import the seed function
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
