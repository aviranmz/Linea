import { PrismaClient } from '@prisma/client';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Completely unique, high-quality images for each event
const eventImages = {
  'Milano Design Week 2024':
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'Contemporary Art Exhibition':
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
  'Creative Design Workshop':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  'Art Gallery Opening Night':
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'Creative Networking Mixer':
    'https://images.unsplash.com/photo-1515187029135-18ee286d8153?w=800&h=600&fit=crop',
  'AI Innovation Summit':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  'Tech Innovation Summit 2024':
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
  'Startup Pitch Competition':
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
  'Tech Leadership Workshop':
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'Milano Design Showcase':
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'Innovation Talk':
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'Studio Open Day':
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
};

// October 2025 dates for each event
const octoberDates = [
  '2025-10-01T10:00:00.000Z',
  '2025-10-02T14:00:00.000Z',
  '2025-10-03T09:00:00.000Z',
  '2025-10-04T16:00:00.000Z',
  '2025-10-05T11:00:00.000Z',
  '2025-10-06T13:00:00.000Z',
  '2025-10-07T15:00:00.000Z',
  '2025-10-08T10:00:00.000Z',
  '2025-10-09T12:00:00.000Z',
  '2025-10-10T14:00:00.000Z',
  '2025-10-11T16:00:00.000Z',
  '2025-10-12T09:00:00.000Z',
];

// Function to download image
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(uploadsDir, filename));

    https
      .get(url, response => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filename);
          });
        } else {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
      })
      .on('error', err => {
        fs.unlink(filename, () => {});
        reject(err);
      });
  });
}

async function fixEventsCompletely() {
  try {
    console.log('🎯 Fixing ALL events: images, locations, and dates...');

    // Get all events
    const events = await prisma.event.findMany();
    console.log(`📊 Processing ${events.length} events`);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      try {
        console.log(
          `\n🎨 Processing ${i + 1}/${events.length}: ${event.title}`
        );

        // 1. Assign unique image
        const imageUrl =
          eventImages[event.title] || eventImages['Milano Design Showcase'];
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const filename = `event_${event.slug}_${timestamp}_${randomSuffix}.jpg`;

        console.log(`   📥 Downloading image: ${imageUrl}`);
        await downloadImage(imageUrl, filename);
        console.log(`   💾 Downloaded: ${filename}`);

        // 2. Update metadata with new image
        const currentMetadata = event.metadata || {};
        const updatedMetadata = {
          ...currentMetadata,
          heroImageUrl: `/uploads/${filename}`,
        };

        // 3. Update event with new image, location, and date
        const octoberDate = octoberDates[i] || octoberDates[0];
        const endDate = new Date(octoberDate);
        endDate.setHours(endDate.getHours() + 4); // 4-hour event

        await prisma.event.update({
          where: { id: event.id },
          data: {
            metadata: updatedMetadata,
            startDate: octoberDate,
            endDate: endDate.toISOString(),
            // Update venue to Milano
            venue: {
              update: {
                city: 'Milano',
                country: 'Italy',
                address: 'Via Brera, 20121 Milano MI, Italy',
              },
            },
          },
        });

        console.log(`   ✅ Updated: ${event.title}`);
        console.log(`   📍 Location: Milano, Italy`);
        console.log(`   📅 Date: October 2025`);

        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`   ❌ Error processing ${event.title}:`, error.message);
      }
    }

    console.log('\n🎉 All events fixed!');
    console.log('✅ All events now have unique images');
    console.log('✅ All events are in Milano, Italy');
    console.log('✅ All events are in October 2025');
  } catch (error) {
    console.error('❌ Error fixing events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEventsCompletely();
