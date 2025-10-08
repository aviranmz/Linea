const { PrismaClient } = require('@prisma/client');
const { QRCodeGenerator } = require('../dist/utils/qrGenerator.js');

const prisma = new PrismaClient();

async function testQRGeneration() {
  try {
    console.log('🧪 Testing QR code generation...');
    
    // Get the first event
    const event = await prisma.event.findFirst({
      select: { id: true, title: true, metadata: true }
    });

    if (!event) {
      console.log('❌ No events found');
      return;
    }

    console.log(`📋 Testing with event: ${event.title} (${event.id})`);
    console.log(`📊 Current QR status: ${event.metadata?.qrUrl ? 'Has QR' : 'No QR'}`);

    // Test QR code generation
    const baseUrl = 'https://linea-production.up.railway.app';
    const eventUrl = `${baseUrl}/events/${event.id}`;
    
    console.log(`🔗 Event URL: ${eventUrl}`);
    
    const qrUrl = await QRCodeGenerator.generateEventQR(eventUrl);
    console.log(`✅ QR code generated successfully!`);
    console.log(`📏 QR code length: ${qrUrl.length} characters`);
    console.log(`🔍 QR code starts with: ${qrUrl.substring(0, 50)}...`);

    // Test updating the database
    await prisma.event.update({
      where: { id: event.id },
      data: {
        metadata: {
          ...(event.metadata || {}),
          qrUrl: qrUrl,
        },
      },
    });

    console.log(`💾 QR code saved to database successfully!`);
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testQRGeneration();
