import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️  Fixing event images (v2)...');

  try {
    // Get all events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });

    console.log(`Found ${events.length} events`);

    for (const event of events) {
      const metadata = event.metadata as any;
      const currentImageUrl = metadata?.heroImageUrl;

      console.log(`Event: ${event.title}`);
      console.log(`  Current image: ${currentImageUrl}`);

      // Update to use a working image
      let newImageUrl = '/images/design-events.jpg';

      // If it's already a working external URL, keep it
      if (
        currentImageUrl &&
        (currentImageUrl.startsWith('http') ||
          currentImageUrl.startsWith('/uploads/'))
      ) {
        console.log(`  Keeping existing working image: ${currentImageUrl}`);
        continue;
      }

      // Update the metadata
      const updatedMetadata = {
        ...metadata,
        heroImageUrl: newImageUrl,
      };

      await prisma.event.update({
        where: { id: event.id },
        data: {
          metadata: updatedMetadata,
        },
      });

      console.log(`  Updated to: ${newImageUrl}`);
    }

    console.log('✅ All events updated');

    // Verify the changes
    const updatedEvents = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });

    console.log('📋 Updated events:');
    updatedEvents.forEach(event => {
      const heroImageUrl = (event.metadata as any)?.heroImageUrl || 'No image';
      console.log(`  - ${event.title}: ${heroImageUrl}`);
    });
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
