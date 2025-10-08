const { PrismaClient } = require('@prisma/client');
const { QRCodeGenerator } = require('../dist/utils/qrGenerator.js');

const prisma = new PrismaClient();

async function generateMissingQRCodes() {
  try {
    console.log('🔍 Finding events without QR codes...');

    // Find events that don't have QR codes
    const eventsWithoutQR = await prisma.event.findMany({
      where: {
        OR: [
          { metadata: { path: ['qrUrl'], equals: null } },
          { metadata: { path: ['qrUrl'], equals: undefined } },
          { metadata: { path: ['qrUrl'], equals: '' } },
        ],
      },
      select: {
        id: true,
        title: true,
        metadata: true,
      },
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
