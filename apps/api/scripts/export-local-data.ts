import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Exporting local database data...');

  try {
    // Get all users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    console.log(`Found ${users.length} users`);

    // Get all categories
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
    console.log(`Found ${categories.length} categories`);

    // Get all areas
    const areas = await prisma.area.findMany({
      orderBy: { createdAt: 'asc' },
    });
    console.log(`Found ${areas.length} areas`);

    // Get all venues
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: 'asc' },
    });
    console.log(`Found ${venues.length} venues`);

    // Get all products
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });
    console.log(`Found ${products.length} products`);

    // Get all events
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        owner: true,
        category: true,
        venue: true,
      },
    });
    console.log(`Found ${events.length} events`);

    // Get all waitlist entries
    const waitlistEntries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: 'asc' },
    });
    console.log(`Found ${waitlistEntries.length} waitlist entries`);

    const exportData = {
      users,
      categories,
      areas,
      venues,
      products,
      events,
      waitlistEntries,
    };

    // Save to file
    const outputPath = path.join(__dirname, 'local-data-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`\n💾 Data exported to: ${outputPath}`);

    console.log('\n📋 Export Summary:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Areas: ${areas.length}`);
    console.log(`  Venues: ${venues.length}`);
    console.log(`  Products: ${products.length}`);
    console.log(`  Events: ${events.length}`);
    console.log(`  Waitlist Entries: ${waitlistEntries.length}`);

    return exportData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
