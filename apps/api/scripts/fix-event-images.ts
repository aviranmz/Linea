import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🖼️  Fixing event images...')

  try {
    // Update all events to use the available design-events.jpg image
    const result = await prisma.event.updateMany({
      where: {
        metadata: {
          path: ['heroImageUrl'],
          string_contains: '/images/events/'
        }
      },
      data: {
        metadata: {
          heroImageUrl: '/images/design-events.jpg'
        }
      }
    })

    console.log(`✅ Updated ${result.count} events with correct image path`)

    // Also update any events that might have null or empty heroImageUrl
    const result2 = await prisma.event.updateMany({
      where: {
        OR: [
          { metadata: { path: ['heroImageUrl'], equals: null } },
          { metadata: { path: ['heroImageUrl'], equals: '' } }
        ]
      },
      data: {
        metadata: {
          heroImageUrl: '/images/design-events.jpg'
        }
      }
    })

    console.log(`✅ Updated ${result2.count} events with missing images`)

    // List all events to verify
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true
      }
    })

    console.log('📋 Current events:')
    events.forEach(event => {
      const heroImageUrl = (event.metadata as any)?.heroImageUrl || 'No image'
      console.log(`  - ${event.title}: ${heroImageUrl}`)
    })

  } catch (error) {
    console.error('❌ Error fixing images:', error)
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
