const { PrismaClient } = require('@prisma/client');
const { QRCodeGenerator } = require('../dist/utils/qrGenerator.js');

const prisma = new PrismaClient();

async function fixQRCodes() {
  try {
    console.log('🔍 Finding events that need QR codes...');
    
    // Get all events
    const allEvents = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true
      }
    });

    console.log(`📊 Found ${allEvents.length} total events`);

    const baseUrl = 'https://linea-production.up.railway.app';
    let successCount = 0;
    let errorCount = 0;

    for (const event of allEvents) {
      try {
        console.log(`🔄 Processing: ${event.title} (${event.id})`);
        
        // Generate QR code for the event
        const eventUrl = `${baseUrl}/events/${event.id}`;
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
        
        console.log(`✅ Updated QR code for: ${event.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to update ${event.title}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`✅ Successfully updated: ${successCount} events`);
    console.log(`❌ Failed to update: ${errorCount} events`);
    
  } catch (error) {
    console.error('💥 Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixQRCodes();
