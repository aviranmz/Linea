import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(
    '🌱 Adding events for owner 2 and owner 3 using local database...'
  );

  // Create owner 2
  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@linea.app' },
    update: {},
    create: {
      email: 'owner2@linea.app',
      name: 'Sarah Johnson',
      role: 'OWNER',
      isActive: true,
      lastLoginAt: new Date(),
      businessName: 'Creative Events Co.',
      businessIntro: 'We create unforgettable experiences',
      website: 'https://creativeevents.co',
      city: 'New York',
      country: 'USA',
    },
  });

  console.log('✅ Created owner 2:', owner2.email);

  // Create owner 3
  const owner3 = await prisma.user.upsert({
    where: { email: 'owner3@linea.app' },
    update: {},
    create: {
      email: 'owner3@linea.app',
      name: 'Michael Chen',
      role: 'OWNER',
      isActive: true,
      lastLoginAt: new Date(),
      businessName: 'Tech Innovation Hub',
      businessIntro: 'Leading technology and innovation events',
      website: 'https://techinnovationhub.com',
      city: 'San Francisco',
      country: 'USA',
    },
  });

  console.log('✅ Created owner 3:', owner3.email);

  // Create venues
  const venues = await Promise.all([
    prisma.venue.upsert({
      where: { id: 'venue-owner2-1' },
      update: {},
      create: {
        id: 'venue-owner2-1',
        name: 'Grand Ballroom NYC',
        address: '123 Broadway, New York, NY 10001',
        city: 'New York',
        country: 'USA',
        latitude: 40.7589,
        longitude: -73.9851,
        website: 'https://grandballroomnyc.com',
      },
    }),
    prisma.venue.upsert({
      where: { id: 'venue-owner2-2' },
      update: {},
      create: {
        id: 'venue-owner2-2',
        name: 'Creative Studio Space',
        address: '456 Art District, New York, NY 10002',
        city: 'New York',
        country: 'USA',
        latitude: 40.7505,
        longitude: -73.9934,
        website: 'https://creativestudiospace.com',
      },
    }),
    prisma.venue.upsert({
      where: { id: 'venue-owner3-1' },
      update: {},
      create: {
        id: 'venue-owner3-1',
        name: 'Silicon Valley Convention Center',
        address: '789 Innovation Drive, San Francisco, CA 94105',
        city: 'San Francisco',
        country: 'USA',
        latitude: 37.7749,
        longitude: -122.4194,
        website: 'https://svconvention.com',
      },
    }),
    prisma.venue.upsert({
      where: { id: 'venue-owner3-2' },
      update: {},
      create: {
        id: 'venue-owner3-2',
        name: 'Tech Hub Auditorium',
        address: '321 Startup Blvd, San Francisco, CA 94107',
        city: 'San Francisco',
        country: 'USA',
        latitude: 37.7849,
        longitude: -122.4094,
        website: 'https://techhubauditorium.com',
      },
    }),
  ]);

  console.log('✅ Created venues:', venues.length);

  // Get next week's dates
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Owner 2 Events (3 events for next week)
  const owner2Events = [
    {
      title: 'Creative Design Workshop',
      description:
        'Join us for an immersive design workshop where creativity meets innovation. Learn from industry experts and create stunning visual experiences.',
      shortDescription: 'Immersive design workshop with industry experts',
      startDate: new Date(nextWeek.getTime() + 1 * 24 * 60 * 60 * 1000), // Monday
      endDate: new Date(
        nextWeek.getTime() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ), // 3 hours later
      capacity: 50,
      venueId: venues[0].id,
      isPublic: true,
      featured: true,
      tags: ['design', 'workshop', 'creativity'],
      mapLat: 40.7589,
      mapLng: -73.9851,
      mapZoom: 15,
    },
    {
      title: 'Art Gallery Opening Night',
      description:
        'Experience the latest contemporary art exhibition featuring emerging and established artists. Network with art enthusiasts and collectors.',
      shortDescription: 'Contemporary art exhibition opening night',
      startDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000), // Wednesday
      endDate: new Date(
        nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
      ), // 4 hours later
      capacity: 100,
      venueId: venues[1].id,
      isPublic: true,
      featured: false,
      tags: ['art', 'gallery', 'networking'],
      mapLat: 40.7505,
      mapLng: -73.9934,
      mapZoom: 15,
    },
    {
      title: 'Creative Networking Mixer',
      description:
        'Connect with fellow creatives, entrepreneurs, and industry professionals in a relaxed and inspiring atmosphere.',
      shortDescription: 'Networking event for creative professionals',
      startDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000), // Friday
      endDate: new Date(
        nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ), // 3 hours later
      capacity: 75,
      venueId: venues[0].id,
      isPublic: true,
      featured: false,
      tags: ['networking', 'creative', 'professional'],
      mapLat: 40.7589,
      mapLng: -73.9851,
      mapZoom: 15,
    },
  ];

  // Owner 3 Events (3 events for next week)
  const owner3Events = [
    {
      title: 'AI Innovation Summit',
      description:
        'Explore the latest developments in artificial intelligence and machine learning. Hear from leading researchers and industry pioneers.',
      shortDescription: 'Latest AI and ML developments summit',
      startDate: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000), // Tuesday
      endDate: new Date(
        nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000
      ), // 6 hours later
      capacity: 200,
      venueId: venues[2].id,
      isPublic: true,
      featured: true,
      tags: ['AI', 'technology', 'innovation', 'summit'],
      mapLat: 37.7749,
      mapLng: -122.4194,
      mapZoom: 15,
    },
    {
      title: 'Startup Pitch Competition',
      description:
        'Watch innovative startups pitch their ideas to a panel of investors and industry experts. Great opportunity for networking and learning.',
      shortDescription: 'Startup pitch competition with investors',
      startDate: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000), // Thursday
      endDate: new Date(
        nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
      ), // 4 hours later
      capacity: 150,
      venueId: venues[3].id,
      isPublic: true,
      featured: false,
      tags: ['startup', 'pitch', 'investment', 'competition'],
      mapLat: 37.7849,
      mapLng: -122.4094,
      mapZoom: 15,
    },
    {
      title: 'Tech Leadership Workshop',
      description:
        'Develop your leadership skills in the tech industry. Interactive sessions with experienced tech leaders and executives.',
      shortDescription: 'Leadership development for tech professionals',
      startDate: new Date(nextWeek.getTime() + 6 * 24 * 60 * 60 * 1000), // Saturday
      endDate: new Date(
        nextWeek.getTime() + 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000
      ), // 5 hours later
      capacity: 80,
      venueId: venues[2].id,
      isPublic: true,
      featured: false,
      tags: ['leadership', 'tech', 'workshop', 'development'],
      mapLat: 37.7749,
      mapLng: -122.4194,
      mapZoom: 15,
    },
  ];

  // Create events for owner 2
  console.log('📅 Creating events for owner 2...');
  for (const eventData of owner2Events) {
    const slug = eventData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const event = await prisma.event.create({
      data: {
        ...eventData,
        slug,
        ownerId: owner2.id,
        status: 'PUBLISHED',
      },
    });
    console.log(`✅ Created event: ${event.title}`);
  }

  // Create events for owner 3
  console.log('📅 Creating events for owner 3...');
  for (const eventData of owner3Events) {
    const slug = eventData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const event = await prisma.event.create({
      data: {
        ...eventData,
        slug,
        ownerId: owner3.id,
        status: 'PUBLISHED',
      },
    });
    console.log(`✅ Created event: ${event.title}`);
  }

  console.log('🎉 Successfully added 6 events for next week!');
  console.log('📊 Summary:');
  console.log('  - Owner 2 (Sarah Johnson): 3 events');
  console.log('  - Owner 3 (Michael Chen): 3 events');
  console.log('  - All events scheduled for next week');
  console.log('  - All events are published and public');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
