import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Wiping production database...')

  try {
    // Delete all data in the correct order to avoid foreign key constraints
    console.log('Deleting waitlist entries...')
    await prisma.waitlistEntry.deleteMany({})
    
    console.log('Deleting events...')
    await prisma.event.deleteMany({})
    
    console.log('Deleting venues...')
    await prisma.venue.deleteMany({})
    
    console.log('Deleting categories...')
    await prisma.category.deleteMany({})
    
    console.log('Deleting areas...')
    await prisma.area.deleteMany({})
    
    console.log('Deleting products...')
    await prisma.product.deleteMany({})
    
    console.log('Deleting users...')
    await prisma.user.deleteMany({})

    console.log('✅ Production database wiped')

    console.log('🌱 Reseeding production database...')
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@linea.app',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        lastLoginAt: new Date(),
      },
    })
    console.log('✅ Created admin user:', adminUser.email)

    // Create sample owners
    const owner1 = await prisma.user.create({
      data: {
        email: 'owner1@example.com',
        name: 'Owner One',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
      },
    })

    const owner2 = await prisma.user.create({
      data: {
        email: 'owner2@example.com',
        name: 'Owner Two',
        role: 'OWNER',
        isActive: true,
        lastLoginAt: new Date(),
      },
    })
    console.log('✅ Created owner users:', owner1.name, 'and', owner2.name)

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Design',
          slug: 'design',
          description: 'Design events, workshops, and exhibitions',
          color: '#c4b69e',
          icon: '🎨',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Technology',
          slug: 'technology',
          description: 'Tech and innovation events',
          color: '#3b82f6',
          icon: '💻',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Art & Culture',
          slug: 'art-culture',
          description: 'Art, culture, and creative events',
          color: '#f59e0b',
          icon: '🎭',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Sustainability',
          slug: 'sustainability',
          description: 'Sustainable design and eco-friendly events',
          color: '#10b981',
          icon: '🌱',
        },
      }),
    ])
    console.log('✅ Created categories:', categories.length)

    // Create areas
    const areas = await Promise.all([
      prisma.area.create({
        data: {
          name: 'Milano',
          slug: 'milano',
          description: 'Design capital of Italy',
          country: 'Italy',
          coordinates: { lat: 45.4642, lng: 9.1900 },
        },
      }),
    ])
    console.log('✅ Created areas:', areas.length)

    // Create venues
    const venues = await Promise.all([
      prisma.venue.create({
        data: {
          name: 'Milano Design Center',
          address: 'Via Tortona, 37, 20144 Milano MI, Italy',
          city: 'Milano',
          country: 'Italy',
          coordinates: { lat: 45.4642, lng: 9.1900 },
          capacity: 500,
          amenities: ['WiFi', 'Parking', 'Accessibility'],
        },
      }),
    ])
    console.log('✅ Created venues:', venues.length)

    // Create sample events with correct image paths
    const events = await Promise.all([
      prisma.event.create({
        data: {
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
          categoryId: categories.find(c => c.slug === 'sustainability')!.id,
          venueId: venues[0].id,
          metadata: {
            heroImageUrl: '/images/design-events.jpg',
            tags: ['#sustainability', '#design', '#innovation'],
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
          },
        },
      }),
      prisma.event.create({
        data: {
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
          categoryId: categories.find(c => c.slug === 'art-culture')!.id,
          venueId: venues[0].id,
          metadata: {
            heroImageUrl: '/images/design-events.jpg',
            tags: ['#contemporary art', '#exhibition', '#culture'],
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
          },
        },
      }),
      prisma.event.create({
        data: {
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
          categoryId: categories.find(c => c.slug === 'technology')!.id,
          venueId: venues[0].id,
          metadata: {
            heroImageUrl: '/images/design-events.jpg',
            tags: ['#AI', '#creativity', '#technology'],
            social: {
              instagram: '@linea_events',
              twitter: '@linea_events',
            },
          },
        },
      }),
    ])
    console.log('✅ Created events:', events.length)

    console.log('🎉 Production database successfully wiped and reseeded!')
    console.log(`📊 Summary:`)
    console.log(`  - Users: 3 (1 admin, 2 owners)`)
    console.log(`  - Categories: ${categories.length}`)
    console.log(`  - Areas: ${areas.length}`)
    console.log(`  - Venues: ${venues.length}`)
    console.log(`  - Events: ${events.length}`)

  } catch (error) {
    console.error('❌ Error during wipe and reseed:', error)
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
