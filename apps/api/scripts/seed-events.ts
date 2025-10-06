import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive event seeding...')

  try {
    // Delete all existing events first
    console.log('🗑️  Deleting all existing events...')
    await prisma.event.deleteMany({})
    console.log('✅ All existing events deleted')

    // Get or create the two demo owners
    const owner1 = await prisma.user.upsert({
      where: { email: 'owner1@example.com' },
      update: {},
      create: {
        email: 'owner1@example.com',
        name: 'Owner One',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
      },
    })

    const owner2 = await prisma.user.upsert({
      where: { email: 'owner2@example.com' },
      update: {},
      create: {
        email: 'owner2@example.com',
        name: 'Owner Two',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
      },
    })

    console.log('✅ Demo owners ready:', owner1.name, 'and', owner2.name)

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'design' },
        update: {},
        create: {
          name: 'Design',
          slug: 'design',
          description: 'Design events, workshops, and exhibitions',
          color: '#c4b69e',
          icon: '🎨',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'technology' },
        update: {},
        create: {
          name: 'Technology',
          slug: 'technology',
          description: 'Tech and innovation events',
          color: '#3b82f6',
          icon: '💻',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'art-culture' },
        update: {},
        create: {
          name: 'Art & Culture',
          slug: 'art-culture',
          description: 'Art, culture, and creative events',
          color: '#f59e0b',
          icon: '🎭',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'sustainability' },
        update: {},
        create: {
          name: 'Sustainability',
          slug: 'sustainability',
          description: 'Sustainable design and eco-friendly events',
          color: '#10b981',
          icon: '🌱',
        },
      }),
    ])

    console.log('✅ Categories created:', categories.length)

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
      prisma.venue.upsert({
        where: { name: 'Palazzo Clerici' },
        update: {},
        create: {
          name: 'Palazzo Clerici',
          address: 'Via Clerici, 5, 20121 Milano MI, Italy',
          city: 'Milano',
          country: 'Italy',
          latitude: 45.4654,
          longitude: 9.1859,
          website: 'https://palazzoclerici.it',
        },
      }),
    ])

    console.log('✅ Venues created:', venues.length)

    // Create 4 events for Owner 1
    const owner1Events = [
      {
        title: 'Sustainable Design Revolution',
        slug: 'sustainable-design-revolution',
        description: 'Explore the future of sustainable design with leading architects, designers, and environmental experts. Discover innovative materials, circular design principles, and eco-friendly solutions that are reshaping the industry.',
        shortDescription: 'Leading the charge in sustainable design innovation.',
        startDate: new Date('2024-06-15T09:00:00Z'),
        endDate: new Date('2024-06-15T18:00:00Z'),
        capacity: 300,
        venue: venues[0],
        category: categories[3], // Sustainability
        tags: ['sustainability', 'design', 'innovation', 'environment'],
        featured: true,
      },
      {
        title: 'Digital Art & Technology Fusion',
        slug: 'digital-art-technology-fusion',
        description: 'Experience the intersection of art and technology in this immersive exhibition featuring digital installations, VR experiences, and interactive artworks by contemporary artists.',
        shortDescription: 'Where art meets cutting-edge technology.',
        startDate: new Date('2024-06-20T10:00:00Z'),
        endDate: new Date('2024-06-20T20:00:00Z'),
        capacity: 200,
        venue: venues[1],
        category: categories[2], // Art & Culture
        tags: ['digital art', 'technology', 'innovation', 'interactive'],
        featured: false,
      },
      {
        title: 'Furniture Design Masterclass',
        slug: 'furniture-design-masterclass',
        description: 'Learn from master furniture designers in this hands-on workshop covering traditional techniques, modern materials, and innovative approaches to furniture design.',
        shortDescription: 'Master the art of furniture design.',
        startDate: new Date('2024-06-25T09:00:00Z'),
        endDate: new Date('2024-06-25T17:00:00Z'),
        capacity: 50,
        venue: venues[0],
        category: categories[0], // Design
        tags: ['furniture', 'workshop', 'craftsmanship', 'design'],
        featured: false,
      },
      {
        title: 'Smart Home Innovation Summit',
        slug: 'smart-home-innovation-summit',
        description: 'Discover the latest in smart home technology, IoT devices, and connected living solutions. Features live demonstrations, expert panels, and networking opportunities.',
        shortDescription: 'The future of connected living.',
        startDate: new Date('2024-07-01T09:00:00Z'),
        endDate: new Date('2024-07-01T18:00:00Z'),
        capacity: 400,
        venue: venues[2],
        category: categories[1], // Technology
        tags: ['smart home', 'IoT', 'technology', 'innovation'],
        featured: true,
      },
    ]

    // Create 4 events for Owner 2
    const owner2Events = [
      {
        title: 'Contemporary Art Exhibition',
        slug: 'contemporary-art-exhibition',
        description: 'A curated exhibition featuring works by emerging and established contemporary artists, exploring themes of identity, society, and the human condition.',
        shortDescription: 'Contemporary voices in modern art.',
        startDate: new Date('2024-06-18T10:00:00Z'),
        endDate: new Date('2024-06-18T20:00:00Z'),
        capacity: 150,
        venue: venues[3],
        category: categories[2], // Art & Culture
        tags: ['contemporary art', 'exhibition', 'culture', 'creativity'],
        featured: true,
      },
      {
        title: 'Green Architecture Workshop',
        slug: 'green-architecture-workshop',
        description: 'Learn sustainable architecture principles with hands-on workshops, case studies, and expert guidance on creating environmentally responsible buildings.',
        shortDescription: 'Building a sustainable future.',
        startDate: new Date('2024-06-22T09:00:00Z'),
        endDate: new Date('2024-06-22T17:00:00Z'),
        capacity: 80,
        venue: venues[1],
        category: categories[3], // Sustainability
        tags: ['architecture', 'sustainability', 'green building', 'workshop'],
        featured: false,
      },
      {
        title: 'AI in Creative Industries',
        slug: 'ai-creative-industries',
        description: 'Explore how artificial intelligence is transforming creative industries, from design automation to AI-assisted art creation and content generation.',
        shortDescription: 'AI meets creativity.',
        startDate: new Date('2024-06-28T09:00:00Z'),
        endDate: new Date('2024-06-28T18:00:00Z'),
        capacity: 250,
        venue: venues[2],
        category: categories[1], // Technology
        tags: ['AI', 'creativity', 'technology', 'innovation'],
        featured: true,
      },
      {
        title: 'Textile Design Innovation',
        slug: 'textile-design-innovation',
        description: 'Discover the latest innovations in textile design, from smart fabrics to sustainable materials, with demonstrations and hands-on workshops.',
        shortDescription: 'The future of fabric design.',
        startDate: new Date('2024-07-05T10:00:00Z'),
        endDate: new Date('2024-07-05T18:00:00Z'),
        capacity: 120,
        venue: venues[0],
        category: categories[0], // Design
        tags: ['textile', 'design', 'innovation', 'fashion'],
        featured: false,
      },
    ]

    // Create events for Owner 1
    console.log('🌱 Creating events for Owner 1...')
    for (const eventData of owner1Events) {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          slug: eventData.slug,
          description: eventData.description,
          shortDescription: eventData.shortDescription,
          status: 'PUBLISHED',
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          capacity: eventData.capacity,
          currentWaitlist: 0,
          youtubeUrl: `https://www.youtube.com/watch?v=${eventData.slug}`,
          mapLat: eventData.venue.latitude,
          mapLng: eventData.venue.longitude,
          mapZoom: 15,
          mapAddress: eventData.venue.address,
          ownerId: owner1.id,
          venueId: eventData.venue.id,
          categoryId: eventData.category.id,
          isPublic: true,
          featured: eventData.featured,
          tags: eventData.tags,
          metadata: {
            organizer: 'Linea Events',
            contact: 'info@linea.app',
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
            heroImageUrl: `/images/design-events.jpg`,
            galleryImages: [
              `/images/events/${eventData.slug}-1.jpg`,
              `/images/events/${eventData.slug}-2.jpg`,
              `/images/events/${eventData.slug}-3.jpg`,
            ],
          },
        },
      })
      console.log(`✅ Created event: ${event.title}`)
    }

    // Create events for Owner 2
    console.log('🌱 Creating events for Owner 2...')
    for (const eventData of owner2Events) {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          slug: eventData.slug,
          description: eventData.description,
          shortDescription: eventData.shortDescription,
          status: 'PUBLISHED',
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          capacity: eventData.capacity,
          currentWaitlist: 0,
          youtubeUrl: `https://www.youtube.com/watch?v=${eventData.slug}`,
          mapLat: eventData.venue.latitude,
          mapLng: eventData.venue.longitude,
          mapZoom: 15,
          mapAddress: eventData.venue.address,
          ownerId: owner2.id,
          venueId: eventData.venue.id,
          categoryId: eventData.category.id,
          isPublic: true,
          featured: eventData.featured,
          tags: eventData.tags,
          metadata: {
            organizer: 'Linea Events',
            contact: 'info@linea.app',
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
            heroImageUrl: `/images/design-events.jpg`,
            galleryImages: [
              `/images/events/${eventData.slug}-1.jpg`,
              `/images/events/${eventData.slug}-2.jpg`,
              `/images/events/${eventData.slug}-3.jpg`,
            ],
          },
        },
      })
      console.log(`✅ Created event: ${event.title}`)
    }

    console.log('🎉 Event seeding completed successfully!')
    console.log(`📊 Created 8 events total:`)
    console.log(`   - 4 events for Owner 1 (${owner1.name})`)
    console.log(`   - 4 events for Owner 2 (${owner2.name})`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

