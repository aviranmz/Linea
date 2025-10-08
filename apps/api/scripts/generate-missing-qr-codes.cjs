const { PrismaClient } = require('@prisma/client');
const { QRCodeGenerator } = require('../dist/utils/qrGenerator.js');

const prisma = new PrismaClient();

async function generateMissingQRCodes() {
  try {
    console.log('🔍 Finding events without QR codes...');

    // Find all events and check which ones don't have QR codes
    const allEvents = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true,
      },
    });

    // Filter events that don't have QR codes
    const eventsWithoutQR = allEvents.filter(event => {
      const metadata = event.metadata || {};
      const hasQR =
        metadata.qrUrl && metadata.qrUrl !== null && metadata.qrUrl !== '';
      console.log(
        `Event: ${event.title}, Has QR: ${hasQR}, QR URL: ${metadata.qrUrl}`
      );
      return !hasQR;
    });

    console.log(`📊 Found ${eventsWithoutQR.length} events without QR codes`);

    if (eventsWithoutQR.length === 0) {
      console.log('✅ All events already have QR codes!');
      return;
    }

    const baseUrl =
      process.env.FRONTEND_URL || 'https://linea-production.up.railway.app';
    let successCount = 0;
    let errorCount = 0;

    for (const event of eventsWithoutQR) {
      try {
        console.log(`🔄 Generating QR code for: ${event.title} (${event.id})`);

        const eventUrl = `${baseUrl.replace(/\/$/, '')}/events/${event.id}`;
        const qrUrl = await QRCodeGenerator.generateEventQR(eventUrl);

        // Update the event with the QR code
        await prisma.event.update({
          where: { id: event.id },
          data: {
            metadata: {
              ...(event.metadata || {}),
              qrUrl: qrUrl,
            },
          },
        });

        console.log(`✅ Generated QR code for: ${event.title}`);
        successCount++;
      } catch (error) {
        console.error(
          `❌ Failed to generate QR code for ${event.title}:`,
          error.message
        );
        errorCount++;
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`✅ Successfully generated: ${successCount} QR codes`);
    console.log(`❌ Failed to generate: ${errorCount} QR codes`);
  } catch (error) {
    console.error('💥 Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateMissingQRCodes();
