import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🖼️  Fixing production event images...')

  try {
    // Get all events and show their current state
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        metadata: true
      }
    })

    console.log(`Found ${events.length} events in production`)

    for (const event of events) {
      const metadata = event.metadata as any
      const currentImageUrl = metadata?.heroImageUrl
      
      console.log(`Event: ${event.title}`)
      console.log(`  Current image: ${currentImageUrl}`)

      // If it's pointing to the old /images/events/ path, update it
      if (currentImageUrl && currentImageUrl.includes('/images/events/')) {
        const updatedMetadata = {
          ...metadata,
          heroImageUrl: '/images/design-events.jpg'
        }

        await prisma.event.update({
          where: { id: event.id },
          data: {
            metadata: updatedMetadata
          }
        })

        console.log(`  ✅ Updated to: /images/design-events.jpg`)
      } else {
        console.log(`  ✅ Already has valid image: ${currentImageUrl}`)
      }
    }

    console.log('✅ Production database updated')

  } catch (error) {
    console.error('❌ Error fixing production images:', error)
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
