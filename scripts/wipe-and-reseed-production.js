#!/usr/bin/env node

/**
 * Production Database Wipe and Reseed Script
 * 
 * This script safely wipes the production database and reseeds it with fresh data.
 * It includes comprehensive error handling and confirmation prompts.
 * 
 * WARNING: This will delete ALL data in the production database!
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}${colors.bold}ERROR: ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}${colors.bold}SUCCESS: ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}${colors.bold}WARNING: ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}${colors.bold}INFO: ${message}${colors.reset}`);
}

async function confirmAction(message) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${message} (yes/no): ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    logSuccess('Database connection established');
    return true;
  } catch (error) {
    logError(`Failed to connect to database: ${error.message}`);
    return false;
  }
}

async function getTableCounts() {
  try {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.waitlistEntry.count(),
      prisma.venue.count(),
      prisma.category.count(),
      prisma.area.count(),
      prisma.product.count(),
    ]);

    return {
      users: counts[0],
      events: counts[1],
      waitlistEntries: counts[2],
      venues: counts[3],
      categories: counts[4],
      areas: counts[5],
      products: counts[6],
    };
  } catch (error) {
    logError(`Failed to get table counts: ${error.message}`);
    return null;
  }
}

async function wipeDatabase() {
  logInfo('Starting database wipe...');
  
  try {
    // Delete in reverse dependency order to avoid foreign key constraints
    const deleteOperations = [
      { name: 'Waitlist Entries', operation: () => prisma.waitlistEntry.deleteMany() },
      { name: 'Events', operation: () => prisma.event.deleteMany() },
      { name: 'Venues', operation: () => prisma.venue.deleteMany() },
      { name: 'Categories', operation: () => prisma.category.deleteMany() },
      { name: 'Areas', operation: () => prisma.area.deleteMany() },
      { name: 'Products', operation: () => prisma.product.deleteMany() },
      { name: 'Users (except admin)', operation: () => prisma.user.deleteMany({
        where: { role: { in: ['VISITOR', 'OWNER'] } }
      }) },
    ];

    for (const { name, operation } of deleteOperations) {
      logInfo(`Deleting ${name}...`);
      await operation();
      logSuccess(`${name} deleted successfully`);
    }

    logSuccess('Database wipe completed successfully');
    return true;
  } catch (error) {
    logError(`Database wipe failed: ${error.message}`);
    return false;
  }
}

async function runSeedScript() {
  logInfo('Starting seed script...');
  
  try {
    // Import and run the seed script
    const seedPath = path.join(__dirname, '..', 'apps', 'api', 'src', 'seed.ts');
    
    if (!fs.existsSync(seedPath)) {
      logError(`Seed script not found at: ${seedPath}`);
      return false;
    }

    // Run the seed script using ts-node or compiled version
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      const child = spawn('npx', ['ts-node', seedPath], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });

      child.on('close', (code) => {
        if (code === 0) {
          logSuccess('Seed script completed successfully');
          resolve(true);
        } else {
          logError(`Seed script failed with exit code: ${code}`);
          resolve(false);
        }
      });

      child.on('error', (error) => {
        logError(`Failed to run seed script: ${error.message}`);
        resolve(false);
      });
    });
  } catch (error) {
    logError(`Seed script execution failed: ${error.message}`);
    return false;
  }
}

async function verifyReseed() {
  logInfo('Verifying reseed results...');
  
  try {
    const counts = await getTableCounts();
    if (!counts) {
      logError('Failed to get table counts for verification');
      return false;
    }

    logInfo('Current database counts:');
    log(`  Users: ${counts.users}`, 'cyan');
    log(`  Events: ${counts.events}`, 'cyan');
    log(`  Waitlist Entries: ${counts.waitlistEntries}`, 'cyan');
    log(`  Venues: ${counts.venues}`, 'cyan');
    log(`  Categories: ${counts.categories}`, 'cyan');
    log(`  Areas: ${counts.areas}`, 'cyan');
    log(`  Products: ${counts.products}`, 'cyan');

    // Check if we have reasonable data
    const hasData = counts.users > 0 && counts.events > 0 && counts.venues > 0;
    
    if (hasData) {
      logSuccess('Database reseed verification passed');
      return true;
    } else {
      logError('Database reseed verification failed - insufficient data');
      return false;
    }
  } catch (error) {
    logError(`Verification failed: ${error.message}`);
    return false;
  }
}

async function main() {
  log('='.repeat(60), 'magenta');
  log('PRODUCTION DATABASE WIPE AND RESEED SCRIPT', 'magenta');
  log('='.repeat(60), 'magenta');
  log('', 'white');

  // Check if we're in production environment
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL?.includes('supabase')) {
    logWarning('This script is designed for production use. Current environment may not be production.');
    const proceed = await confirmAction('Are you sure you want to continue?');
    if (!proceed) {
      log('Operation cancelled by user', 'yellow');
      process.exit(0);
    }
  }

  // Get initial database state
  logInfo('Checking database connection...');
  const connected = await checkDatabaseConnection();
  if (!connected) {
    process.exit(1);
  }

  logInfo('Getting current database state...');
  const initialCounts = await getTableCounts();
  if (initialCounts) {
    logInfo('Current database counts:');
    log(`  Users: ${initialCounts.users}`, 'cyan');
    log(`  Events: ${initialCounts.events}`, 'cyan');
    log(`  Waitlist Entries: ${initialCounts.waitlistEntries}`, 'cyan');
    log(`  Venues: ${initialCounts.venues}`, 'cyan');
    log(`  Categories: ${initialCounts.categories}`, 'cyan');
    log(`  Areas: ${initialCounts.areas}`, 'cyan');
    log(`  Products: ${initialCounts.products}`, 'cyan');
  }

  // Final confirmation
  logWarning('This operation will DELETE ALL DATA in the production database!');
  const confirmed = await confirmAction('Are you absolutely sure you want to proceed?');
  if (!confirmed) {
    log('Operation cancelled by user', 'yellow');
    process.exit(0);
  }

  // Step 1: Wipe database
  logInfo('Step 1: Wiping database...');
  const wipeSuccess = await wipeDatabase();
  if (!wipeSuccess) {
    logError('Database wipe failed. Aborting operation.');
    process.exit(1);
  }

  // Step 2: Run seed script
  logInfo('Step 2: Running seed script...');
  const seedSuccess = await runSeedScript();
  if (!seedSuccess) {
    logError('Seed script failed. Database may be in an inconsistent state.');
    process.exit(1);
  }

  // Step 3: Verify reseed
  logInfo('Step 3: Verifying reseed results...');
  const verifySuccess = await verifyReseed();
  if (!verifySuccess) {
    logError('Verification failed. Please check the database manually.');
    process.exit(1);
  }

  // Success
  log('', 'white');
  log('='.repeat(60), 'green');
  log('PRODUCTION DATABASE WIPE AND RESEED COMPLETED SUCCESSFULLY!', 'green');
  log('='.repeat(60), 'green');
  log('', 'white');
  logInfo('The production database has been wiped and reseeded with fresh data.');
  logInfo('All existing data has been replaced with the new seed data.');
  logInfo('The application should now be running with the new dataset.');
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run the main function
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
