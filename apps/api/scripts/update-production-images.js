// Simple script to update production images
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('🖼️  Updating production event images...');

    // Get all events
    const events = await prisma.event.findMany();
    console.log(`Found ${events.length} events`);

    let updatedCount = 0;
    for (const event of events) {
      const metadata = event.metadata || {};
      const currentImageUrl = metadata.heroImageUrl;

      if (currentImageUrl && currentImageUrl.includes('/images/events/')) {
        const updatedMetadata = {
          ...metadata,
          heroImageUrl: '/images/design-events.jpg',
        };

        await prisma.event.update({
          where: { id: event.id },
          data: { metadata: updatedMetadata },
        });

        updatedCount++;
        console.log(`✅ Updated ${event.title}`);
      }
    }

    console.log(`✅ Updated ${updatedCount} events`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
