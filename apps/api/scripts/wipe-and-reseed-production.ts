import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Wiping production database...')

  try {
    // Use raw SQL to disable foreign key checks and truncate all tables
    await prisma.$executeRaw`SET session_replication_role = replica;`
    
    // Truncate all tables in the correct order to avoid foreign key constraints
    await prisma.$executeRaw`TRUNCATE TABLE "WaitlistEntry" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Session" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Event" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Venue" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Category" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Area" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Product" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`

    // Re-enable foreign key checks
    await prisma.$executeRaw`SET session_replication_role = DEFAULT;`

    console.log('✅ Production database wiped')

    console.log('🌱 Seeding production database with comprehensive data...')

    // Create users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@linea.app',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        lastLoginAt: new Date(),
      },
    })
    console.log(`✅ Created admin user: ${adminUser.email}`)

    const owner1 = await prisma.user.create({
      data: {
        email: 'owner1@example.com',
        name: 'Owner One',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Design Studio One',
        businessIntro: 'Leading design studio specializing in sustainable architecture',
        city: 'Milano',
        country: 'Italy',
        phone: '+39 02 1234 5678',
        website: 'https://designstudio1.com',
        instagramUrl: '@designstudio1',
        facebookUrl: 'https://facebook.com/designstudio1',
      },
    })
    console.log(`✅ Created owner 1: ${owner1.email}`)

    const owner2 = await prisma.user.create({
      data: {
        email: 'owner2@example.com',
        name: 'Owner Two',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
        businessName: 'Creative Arts Collective',
        businessIntro: 'Innovative arts collective pushing boundaries in contemporary design',
        city: 'Milano',
        country: 'Italy',
        phone: '+39 02 8765 4321',
        website: 'https://creativearts.com',
        instagramUrl: '@creativearts',
        facebookUrl: 'https://facebook.com/creativearts',
      },
    })
    console.log(`✅ Created owner 2: ${owner2.email}`)

    // Create areas
    const milanoArea = await prisma.area.create({
      data: {
        name: 'Milano',
        slug: 'milano',
        description: 'Design capital of Italy and global fashion hub',
        country: 'Italy',
        coordinates: { lat: 45.4642, lng: 9.1900 },
      },
    })
    console.log(`✅ Created area: ${milanoArea.name}`)

    // Create categories
    const designCategory = await prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'Innovative design events, workshops, and exhibitions',
        color: '#c4b69e',
        icon: '🎨',
      },
    })
    console.log(`✅ Created category: ${designCategory.name}`)

    const techCategory = await prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech and innovation events',
        color: '#3b82f6',
        icon: '💻',
      },
    })
    console.log(`✅ Created category: ${techCategory.name}`)

    const artCategory = await prisma.category.create({
      data: {
        name: 'Art & Culture',
        slug: 'art-culture',
        description: 'Art, culture, and creative events',
        color: '#f59e0b',
        icon: '🎭',
      },
    })
    console.log(`✅ Created category: ${artCategory.name}`)

    const sustainabilityCategory = await prisma.category.create({
      data: {
        name: 'Sustainability',
        slug: 'sustainability',
        description: 'Sustainable design and eco-friendly events',
        color: '#10b981',
        icon: '🌱',
      },
    })
    console.log(`✅ Created category: ${sustainabilityCategory.name}`)

    // Create venues
    const milanoDesignCenter = await prisma.venue.create({
      data: {
        name: 'Milano Design Center',
        address: 'Via Tortona, 37, 20144 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        coordinates: { lat: 45.4642, lng: 9.1900 },
        capacity: 500,
        amenities: ['WiFi', 'Parking', 'Accessibility', 'Catering', 'AV Equipment'],
      },
    })
    console.log(`✅ Created venue: ${milanoDesignCenter.name}`)

    const creativeHub = await prisma.venue.create({
      data: {
        name: 'Creative Hub Milano',
        address: 'Corso di Porta Ticinese, 87, 20123 Milano MI, Italy',
        city: 'Milano',
        country: 'Italy',
        coordinates: { lat: 45.4500, lng: 9.1800 },
        capacity: 200,
        amenities: ['WiFi', 'Parking', 'Accessibility', 'Gallery Space'],
      },
    })
    console.log(`✅ Created venue: ${creativeHub.name}`)

    // Create events
    const events = [
      {
        title: 'Sustainable Design Revolution',
        slug: 'sustainable-design-revolution',
        description: 'Explore the future of sustainable design with leading architects, designers, and environmental experts. Discover innovative materials, circular design principles, and eco-friendly solutions that are reshaping the industry.',
        shortDescription: 'Leading the charge in sustainable design innovation.',
        status: 'PUBLISHED',
        startDate: new Date('2024-06-15T09:00:00Z'),
        endDate: new Date('2024-06-15T18:00:00Z'),
        capacity: 300,
        isPublic: true,
        isFeatured: true,
        ownerId: owner1.id,
        categoryId: sustainabilityCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl: '/images/design-events.jpg',
          tags: ['#sustainability', '#design', '#innovation'],
          social: {
            instagram: '@linea_events',
            twitter: '@linea_events'
          }
        }
      },
      {
        title: 'Contemporary Art Exhibition',
        slug: 'contemporary-art-exhibition',
        description: 'A showcase of cutting-edge contemporary art from emerging and established artists. Experience innovative installations, digital art, and interactive exhibits that push the boundaries of artistic expression.',
        shortDescription: 'Contemporary voices in modern art.',
        status: 'PUBLISHED',
        startDate: new Date('2024-06-18T10:00:00Z'),
        endDate: new Date('2024-06-18T20:00:00Z'),
        capacity: 200,
        isPublic: true,
        isFeatured: true,
        ownerId: owner2.id,
        categoryId: artCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl: '/images/design-events.jpg',
          tags: ['#contemporary art', '#exhibition', '#culture'],
          social: {
            instagram: '@linea_events',
            twitter: '@linea_events'
          }
        }
      },
      {
        title: 'AI in Creative Industries',
        slug: 'ai-creative-industries',
        description: 'Discover how artificial intelligence is transforming creative industries. From AI-generated art to intelligent design tools, explore the intersection of technology and creativity.',
        shortDescription: 'AI meets creativity.',
        status: 'PUBLISHED',
        startDate: new Date('2024-06-28T09:00:00Z'),
        endDate: new Date('2024-06-28T17:00:00Z'),
        capacity: 150,
        isPublic: true,
        isFeatured: true,
        ownerId: owner2.id,
        categoryId: techCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl: '/images/design-events.jpg',
          tags: ['#AI', '#creativity', '#technology'],
          social: {
            instagram: '@linea_events',
            twitter: '@linea_events'
          }
        }
      },
      {
        title: 'Furniture Design Masterclass',
        slug: 'furniture-design-masterclass',
        description: 'Learn from master furniture designers about the art and craft of creating beautiful, functional pieces. Hands-on workshop with expert guidance.',
        shortDescription: 'Master the art of furniture design.',
        status: 'PUBLISHED',
        startDate: new Date('2024-07-05T10:00:00Z'),
        endDate: new Date('2024-07-05T16:00:00Z'),
        capacity: 25,
        isPublic: true,
        isFeatured: false,
        ownerId: owner1.id,
        categoryId: designCategory.id,
        venueId: creativeHub.id,
        metadata: {
          heroImageUrl: '/images/design-events.jpg',
          tags: ['#furniture', '#workshop', '#design'],
          social: {
            instagram: '@linea_events',
            twitter: '@linea_events'
          }
        }
      },
      {
        title: 'Green Architecture Workshop',
        slug: 'green-architecture-workshop',
        description: 'Explore sustainable architecture principles and green building techniques. Learn from leading architects about eco-friendly design solutions.',
        shortDescription: 'Building a sustainable future.',
        status: 'PUBLISHED',
        startDate: new Date('2024-07-12T09:00:00Z'),
        endDate: new Date('2024-07-12T17:00:00Z'),
        capacity: 50,
        isPublic: true,
        isFeatured: true,
        ownerId: owner1.id,
        categoryId: sustainabilityCategory.id,
        venueId: milanoDesignCenter.id,
        metadata: {
          heroImageUrl: '/images/design-events.jpg',
          tags: ['#architecture', '#sustainability', '#green building'],
          social: {
            instagram: '@linea_events',
            twitter: '@linea_events'
          }
        }
      }
    ]

    for (const eventData of events) {
      const event = await prisma.event.create({
        data: eventData,
      })
      console.log(`✅ Created event: ${event.title}`)
    }

    // Create some waitlist entries
    const waitlistEntries = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        eventId: (await prisma.event.findFirst({ where: { slug: 'sustainable-design-revolution' } }))?.id,
        status: 'PENDING',
        joinedAt: new Date(),
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        eventId: (await prisma.event.findFirst({ where: { slug: 'contemporary-art-exhibition' } }))?.id,
        status: 'PENDING',
        joinedAt: new Date(),
      },
      {
        email: 'mario.rossi@example.com',
        name: 'Mario Rossi',
        eventId: (await prisma.event.findFirst({ where: { slug: 'ai-creative-industries' } }))?.id,
        status: 'PENDING',
        joinedAt: new Date(),
      },
    ]

    for (const entryData of waitlistEntries) {
      if (entryData.eventId) {
        await prisma.waitlistEntry.create({
          data: entryData,
        })
        console.log(`✅ Created waitlist entry for: ${entryData.email}`)
      }
    }

    console.log('\n🎉 Production database successfully seeded!')
    console.log(`📊 Summary:`)
    console.log(`  - Users: 3 (1 admin, 2 owners)`)
    console.log(`  - Categories: 4`)
    console.log(`  - Areas: 1`)
    console.log(`  - Venues: 2`)
    console.log(`  - Events: ${events.length}`)
    console.log(`  - Waitlist Entries: ${waitlistEntries.length}`)

  } catch (error) {
    console.error('❌ Error during wipe and reseed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
