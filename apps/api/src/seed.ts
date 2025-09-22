import { PrismaClient } from '@prisma/client'
// import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@linea.app' },
    update: {},
    create: {
      email: 'admin@linea.app',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create sample owner
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@linea.app' },
    update: {},
    create: {
      email: 'owner@linea.app',
      name: 'Event Owner',
      role: 'OWNER',
      isActive: true,
      lastLoginAt: new Date(),
    },
  })

  console.log('✅ Created owner user:', ownerUser.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'Design events, workshops, and exhibitions',
        color: '#a855f7',
        icon: '🎨',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech meetups, conferences, and hackathons',
        color: '#3b82f6',
        icon: '💻',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'art' },
      update: {},
      create: {
        name: 'Art & Culture',
        slug: 'art',
        description: 'Art exhibitions, cultural events, and performances',
        color: '#ef4444',
        icon: '🎭',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Networking events, conferences, and workshops',
        color: '#10b981',
        icon: '💼',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created categories:', categories.map(c => c.name).join(', '))

  // Create venues
  const venues = await Promise.all([
    prisma.venue.upsert({
      where: { name: 'Milano Design Center' },
      update: {},
      create: {
        name: 'Milano Design Center',
        address: 'Via Tortona, 37, 20144 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4508,
        longitude: 9.1734,
        website: 'https://milanodesigncenter.com',
      },
    }),
    prisma.venue.upsert({
      where: { name: 'Triennale di Milano' },
      update: {},
      create: {
        name: 'Triennale di Milano',
        address: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4722,
        longitude: 9.1708,
        website: 'https://triennale.org',
      },
    }),
    prisma.venue.upsert({
      where: { name: 'Fondazione Prada' },
      update: {},
      create: {
        name: 'Fondazione Prada',
        address: 'Largo Isarco, 2, 20139 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        latitude: 45.4444,
        longitude: 9.2000,
        website: 'https://fondazioneprada.org',
      },
    }),
  ])

  console.log('✅ Created venues:', venues.map(v => v.name).join(', '))

  // Create sample events
  const events = await Promise.all([
    prisma.event.upsert({
      where: { slug: 'milano-design-week-2024' },
      update: {},
      create: {
        title: 'Milano Design Week 2024',
        slug: 'milano-design-week-2024',
        description: 'The most important design event in the world, showcasing the latest trends in furniture, lighting, and home accessories.',
        shortDescription: 'Discover the future of design at the world\'s premier design event.',
        status: 'PUBLISHED',
        startDate: new Date('2024-04-15T10:00:00Z'),
        endDate: new Date('2024-04-21T18:00:00Z'),
        capacity: 1000,
        currentWaitlist: 0,
        youtubeUrl: 'https://www.youtube.com/watch?v=example1',
        mapLat: 45.4508,
        mapLng: 9.1734,
        mapZoom: 15,
        mapAddress: 'Via Tortona, 37, 20144 Milano MI, Italy',
        ownerId: ownerUser.id,
        venueId: venues[0].id,
        categoryId: categories[0].id,
        isPublic: true,
        featured: true,
        tags: ['design', 'furniture', 'innovation', 'sustainability'],
        metadata: {
          organizer: 'Milano Design Center',
          contact: 'info@milanodesigncenter.com',
          social: {
            instagram: '@milanodesigncenter',
            twitter: '@milanodesign',
          },
        },
      },
    }),
    prisma.event.upsert({
      where: { slug: 'tech-innovation-summit' },
      update: {},
      create: {
        title: 'Tech Innovation Summit 2024',
        slug: 'tech-innovation-summit',
        description: 'A gathering of tech leaders, entrepreneurs, and innovators to discuss the future of technology and its impact on society.',
        shortDescription: 'Join the conversation about the future of technology.',
        status: 'PUBLISHED',
        startDate: new Date('2024-05-20T09:00:00Z'),
        endDate: new Date('2024-05-22T17:00:00Z'),
        capacity: 500,
        currentWaitlist: 0,
        youtubeUrl: 'https://www.youtube.com/watch?v=example2',
        mapLat: 45.4722,
        mapLng: 9.1708,
        mapZoom: 15,
        mapAddress: 'Viale Emilio Alemagna, 6, 20121 Milano MI, Italy',
        ownerId: ownerUser.id,
        venueId: venues[1].id,
        categoryId: categories[1].id,
        isPublic: true,
        featured: false,
        tags: ['technology', 'innovation', 'startups', 'AI'],
        metadata: {
          organizer: 'Tech Milano',
          contact: 'hello@techmilano.it',
          social: {
            linkedin: 'Tech Milano',
            twitter: '@techmilano',
          },
        },
      },
    }),
    prisma.event.upsert({
      where: { slug: 'contemporary-art-exhibition' },
      update: {},
      create: {
        title: 'Contemporary Art Exhibition',
        slug: 'contemporary-art-exhibition',
        description: 'An immersive exhibition featuring works by emerging and established contemporary artists from around the world.',
        shortDescription: 'Experience cutting-edge contemporary art in the heart of Milano.',
        status: 'DRAFT',
        startDate: new Date('2024-06-10T11:00:00Z'),
        endDate: new Date('2024-08-10T19:00:00Z'),
        capacity: 200,
        currentWaitlist: 0,
        mapLat: 45.4444,
        mapLng: 9.2000,
        mapZoom: 15,
        mapAddress: 'Largo Isarco, 2, 20139 Milano MI, Italy',
        ownerId: ownerUser.id,
        venueId: venues[2].id,
        categoryId: categories[2].id,
        isPublic: false,
        featured: false,
        tags: ['art', 'contemporary', 'exhibition', 'culture'],
        metadata: {
          organizer: 'Fondazione Prada',
          contact: 'info@fondazioneprada.org',
          social: {
            instagram: '@fondazioneprada',
            facebook: 'Fondazione Prada',
          },
        },
      },
    }),
  ])

  console.log('✅ Created events:', events.map(e => e.title).join(', '))

  // Create sample shows for the first event
  const shows = await Promise.all([
    prisma.show.create({
      data: {
        title: 'Opening Ceremony',
        description: 'Official opening of Milano Design Week 2024',
        startDate: new Date('2024-04-15T10:00:00Z'),
        endDate: new Date('2024-04-15T12:00:00Z'),
        capacity: 200,
        currentWaitlist: 0,
        youtubeUrl: 'https://www.youtube.com/watch?v=opening',
        eventId: events[0].id,
      },
    }),
    prisma.show.create({
      data: {
        title: 'Design Innovation Panel',
        description: 'Panel discussion on the future of design innovation',
        startDate: new Date('2024-04-16T14:00:00Z'),
        endDate: new Date('2024-04-16T16:00:00Z'),
        capacity: 150,
        currentWaitlist: 0,
        eventId: events[0].id,
      },
    }),
  ])

  console.log('✅ Created shows:', shows.map(s => s.title).join(', '))

  // Create sample waitlist entries
  const waitlistEntries = await Promise.all([
    prisma.waitlistEntry.create({
      data: {
        email: 'visitor1@example.com',
        eventId: events[0].id,
        status: 'PENDING',
      },
    }),
    prisma.waitlistEntry.create({
      data: {
        email: 'visitor2@example.com',
        eventId: events[0].id,
        status: 'CONFIRMED',
      },
    }),
    prisma.waitlistEntry.create({
      data: {
        email: 'visitor3@example.com',
        eventId: events[1].id,
        status: 'PENDING',
      },
    }),
  ])

  console.log('✅ Created waitlist entries:', waitlistEntries.length)

  // Create sample nearby places
  const nearbyPlaces = await Promise.all([
    prisma.nearbyPlace.create({
      data: {
        name: 'Ristorante Da Giacomo',
        address: 'Via Pasquale Sottocorno, 6, 20129 Milano MI, Italy',
        latitude: 45.4510,
        longitude: 9.1730,
        category: 'restaurant',
        rating: 4.5,
        website: 'https://ristorantedagiacomo.it',
        phone: '+39 02 5810 2812',
        distance: 150,
        eventId: events[0].id,
      },
    }),
    prisma.nearbyPlace.create({
      data: {
        name: 'Museo della Scienza e della Tecnologia',
        address: 'Via San Vittore, 21, 20123 Milano MI, Italy',
        latitude: 45.4720,
        longitude: 9.1700,
        category: 'museum',
        rating: 4.3,
        website: 'https://museoscienza.org',
        phone: '+39 02 485 551',
        distance: 300,
        eventId: events[0].id,
      },
    }),
  ])

  console.log('✅ Created nearby places:', nearbyPlaces.map(p => p.name).join(', '))

  // Create sample consents
  const consents = await Promise.all([
    prisma.consent.create({
      data: {
        userId: adminUser.id,
        type: 'NECESSARY',
        granted: true,
        grantedAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (compatible; Seed Script)',
      },
    }),
    prisma.consent.create({
      data: {
        userId: adminUser.id,
        type: 'ANALYTICS',
        granted: true,
        grantedAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (compatible; Seed Script)',
      },
    }),
  ])

  console.log('✅ Created consents:', consents.length)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
