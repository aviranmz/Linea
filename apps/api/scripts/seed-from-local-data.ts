import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Wiping production database...')

  try {
    // Delete all data in the correct order to avoid foreign key constraints
    await prisma.waitlistEntry.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.venue.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.area.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.user.deleteMany({})

    console.log('✅ Production database wiped')

    console.log('🌱 Loading local data...')
    
    // Load the exported data
    const dataPath = path.join(__dirname, 'local-data-export.json')
    const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    console.log('📊 Local data loaded:')
    console.log(`  Users: ${localData.users.length}`)
    console.log(`  Categories: ${localData.categories.length}`)
    console.log(`  Areas: ${localData.areas.length}`)
    console.log(`  Venues: ${localData.venues.length}`)
    console.log(`  Products: ${localData.products.length}`)
    console.log(`  Events: ${localData.events.length}`)
    console.log(`  Waitlist Entries: ${localData.waitlistEntries.length}`)

    console.log('🌱 Seeding production database...')

    // Create users (preserve relationships)
    const userMap = new Map()
    for (const user of localData.users) {
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
          theme: user.theme,
          address: user.address,
          businessIntro: user.businessIntro,
          businessName: user.businessName,
          city: user.city,
          country: user.country,
          facebookUrl: user.facebookUrl,
          instagramUrl: user.instagramUrl,
          latitude: user.latitude,
          logoUrl: user.logoUrl,
          longitude: user.longitude,
          phone: user.phone,
          profilePictureUrl: user.profilePictureUrl,
          website: user.website,
        },
      })
      userMap.set(user.id, newUser.id)
      console.log(`✅ Created user: ${newUser.name} (${newUser.email})`)
    }

    // Create areas
    const areaMap = new Map()
    for (const area of localData.areas) {
      const newArea = await prisma.area.create({
        data: {
          name: area.name,
          slug: area.slug,
          description: area.description,
          country: area.country,
          coordinates: area.coordinates,
        },
      })
      areaMap.set(area.id, newArea.id)
      console.log(`✅ Created area: ${newArea.name}`)
    }

    // Create categories
    const categoryMap = new Map()
    for (const category of localData.categories) {
      const newCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color,
          icon: category.icon,
        },
      })
      categoryMap.set(category.id, newCategory.id)
      console.log(`✅ Created category: ${newCategory.name}`)
    }

    // Create products
    const productMap = new Map()
    for (const product of localData.products) {
      const newProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          currency: product.currency,
          isActive: product.isActive,
          imageUrl: product.imageUrl,
          categoryId: categoryMap.get(product.categoryId),
        },
      })
      productMap.set(product.id, newProduct.id)
      console.log(`✅ Created product: ${newProduct.name}`)
    }

    // Create venues
    const venueMap = new Map()
    for (const venue of localData.venues) {
      const newVenue = await prisma.venue.create({
        data: {
          name: venue.name,
          address: venue.address,
          city: venue.city,
          country: venue.country,
          coordinates: venue.coordinates,
          capacity: venue.capacity,
          amenities: venue.amenities,
        },
      })
      venueMap.set(venue.id, newVenue.id)
      console.log(`✅ Created venue: ${newVenue.name}`)
    }

    // Create events
    const eventMap = new Map()
    for (const event of localData.events) {
      const newEvent = await prisma.event.create({
        data: {
          title: event.title,
          slug: event.slug,
          description: event.description,
          shortDescription: event.shortDescription,
          status: event.status,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          capacity: event.capacity,
          isPublic: event.isPublic,
          isFeatured: event.isFeatured,
          ownerId: userMap.get(event.ownerId),
          categoryId: categoryMap.get(event.categoryId),
          venueId: venueMap.get(event.venueId),
          metadata: event.metadata,
        },
      })
      eventMap.set(event.id, newEvent.id)
      console.log(`✅ Created event: ${newEvent.title}`)
    }

    // Create waitlist entries
    let waitlistCount = 0
    for (const entry of localData.waitlistEntries) {
      await prisma.waitlistEntry.create({
        data: {
          email: entry.email,
          name: entry.name,
          eventId: eventMap.get(entry.eventId),
          status: entry.status,
          joinedAt: new Date(entry.joinedAt),
        },
      })
      waitlistCount++
      if (waitlistCount % 1000 === 0) {
        console.log(`✅ Created ${waitlistCount} waitlist entries...`)
      }
    }

    console.log('\n🎉 Production database successfully seeded with local data!')
    console.log(`📊 Summary:`)
    console.log(`  - Users: ${localData.users.length}`)
    console.log(`  - Categories: ${localData.categories.length}`)
    console.log(`  - Areas: ${localData.areas.length}`)
    console.log(`  - Venues: ${localData.venues.length}`)
    console.log(`  - Products: ${localData.products.length}`)
    console.log(`  - Events: ${localData.events.length}`)
    console.log(`  - Waitlist Entries: ${waitlistCount}`)

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
