import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@linea.app' },
    update: {},
    create: {
      email: 'admin@linea.app',
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'John Doe',
      role: 'OWNER'
    }
  })

  console.log('✅ Owner user created:', owner.email)

  // Create sample organization
  const organization = await prisma.organization.upsert({
    where: { id: 'org-1' },
    update: {},
    create: {
      id: 'org-1',
      name: 'Design Studio Milano',
      description: 'Leading design studio specializing in innovative event experiences',
      website: 'https://designstudiomilano.com',
      ownerId: owner.id
    }
  })

  console.log('✅ Organization created:', organization.name)

  // Create sample venue
  const venue = await prisma.venue.upsert({
    where: { id: 'venue-1' },
    update: {},
    create: {
      id: 'venue-1',
      name: 'Fiera Milano Rho',
      address: 'Strada Statale del Sempione, 28',
      city: 'Milan',
      country: 'Italy',
      latitude: 45.4654,
      longitude: 9.1859
    }
  })

  console.log('✅ Venue created:', venue.name)

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'cat-1' },
      update: {},
      create: {
        id: 'cat-1',
        name: 'Design',
        description: 'Design and creative events',
        color: '#3B82F6'
      }
    }),
    prisma.category.upsert({
      where: { id: 'cat-2' },
      update: {},
      create: {
        id: 'cat-2',
        name: 'Technology',
        description: 'Tech and innovation events',
        color: '#10B981'
      }
    }),
    prisma.category.upsert({
      where: { id: 'cat-3' },
      update: {},
      create: {
        id: 'cat-3',
        name: 'Art & Culture',
        description: 'Art, culture, and creative events',
        color: '#F59E0B'
      }
    })
  ])

  console.log('✅ Categories created:', categories.length)

  // Create sample event
  const event = await prisma.event.upsert({
    where: { id: 'event-1' },
    update: {},
    create: {
      id: 'event-1',
      title: 'Milano Design Week 2024',
      slug: 'milano-design-week-2024',
      description: 'Discover the latest in design innovation and creativity at Milano Design Week 2024. This exclusive event showcases cutting-edge design, innovative products, and creative installations from leading designers and brands worldwide.',
      status: 'PUBLISHED',
      startDate: new Date('2024-04-15T10:00:00Z'),
      endDate: new Date('2024-04-21T20:00:00Z'),
      capacity: 500,
      youtubeUrl: 'https://youtube.com/watch?v=example',
      mapLat: 45.4654,
      mapLng: 9.1859,
      mapZoom: 15,
      ownerId: owner.id,
      venueId: venue.id
    }
  })

  console.log('✅ Event created:', event.title)

  // Link event to categories
  await prisma.eventCategory.createMany({
    data: [
      { eventId: event.id, categoryId: categories[0].id },
      { eventId: event.id, categoryId: categories[2].id }
    ],
    skipDuplicates: true
  })

  console.log('✅ Event categories linked')

  // Create sample waitlist entries
  const waitlistEntries = await Promise.all([
    prisma.waitlistEntry.create({
      data: {
        email: 'visitor1@example.com',
        eventId: event.id,
        status: 'PENDING'
      }
    }),
    prisma.waitlistEntry.create({
      data: {
        email: 'visitor2@example.com',
        eventId: event.id,
        status: 'CONFIRMED'
      }
    }),
    prisma.waitlistEntry.create({
      data: {
        email: 'visitor3@example.com',
        eventId: event.id,
        status: 'PENDING'
      }
    })
  ])

  console.log('✅ Waitlist entries created:', waitlistEntries.length)

  // Create sample nearby places
  const nearbyPlaces = await Promise.all([
    prisma.nearbyPlace.create({
      data: {
        name: 'Ristorante Da Giacomo',
        type: 'restaurant',
        address: 'Via Pasquale Sottocorno, 6, 20129 Milano MI, Italy',
        latitude: 45.4642,
        longitude: 9.1900,
        distance: 500,
        eventId: event.id
      }
    }),
    prisma.nearbyPlace.create({
      data: {
        name: 'Museo del Novecento',
        type: 'museum',
        address: 'Piazza del Duomo, 20122 Milano MI, Italy',
        latitude: 45.4641,
        longitude: 9.1913,
        distance: 800,
        eventId: event.id
      }
    })
  ])

  console.log('✅ Nearby places created:', nearbyPlaces.length)

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
