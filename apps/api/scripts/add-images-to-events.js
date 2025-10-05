import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addImagesToEvents() {
  try {
    console.log('🖼️ Adding images to events that don\'t have them...')

    // Define design images for events
    const designImages = [
      // Design & Architecture images
      'https://img.freepik.com/free-photo/modern-architecture-building_23-2149444436.jpg',
      'https://img.freepik.com/free-photo/contemporary-interior-design_23-2149444437.jpg',
      'https://img.freepik.com/free-photo/luxury-furniture-showroom_23-2149444438.jpg',
      'https://img.freepik.com/free-photo/minimalist-living-room_23-2149444439.jpg',
      'https://img.freepik.com/free-photo/industrial-design-workspace_23-2149444440.jpg',
      // Art & Culture images
      'https://img.freepik.com/free-photo/art-gallery-exhibition_23-2149444441.jpg',
      'https://img.freepik.com/free-photo/contemporary-art-museum_23-2149444442.jpg',
      'https://img.freepik.com/free-photo/artist-studio-workspace_23-2149444443.jpg',
      'https://img.freepik.com/free-photo/sculpture-exhibition_23-2149444444.jpg',
      'https://img.freepik.com/free-photo/painting-workshop_23-2149444445.jpg',
      // Technology & Innovation images
      'https://img.freepik.com/free-photo/tech-startup-office_23-2149444446.jpg',
      'https://img.freepik.com/free-photo/innovation-lab_23-2149444447.jpg',
      'https://img.freepik.com/free-photo/digital-workspace_23-2149444448.jpg',
      'https://img.freepik.com/free-photo/tech-conference_23-2149444449.jpg',
      'https://img.freepik.com/free-photo/ai-workshop_23-2149444450.jpg',
      // Fashion & Style images
      'https://img.freepik.com/free-photo/fashion-show-runway_23-2149444451.jpg',
      'https://img.freepik.com/free-photo/designer-studio_23-2149444452.jpg',
      'https://img.freepik.com/free-photo/sustainable-fashion_23-2149444453.jpg',
      'https://img.freepik.com/free-photo/textile-workshop_23-2149444454.jpg',
      'https://img.freepik.com/free-photo/fashion-exhibition_23-2149444455.jpg',
      // Creative & Arts images
      'https://img.freepik.com/free-photo/creative-workspace_23-2149444456.jpg',
      'https://img.freepik.com/free-photo/art-studio_23-2149444457.jpg',
      'https://img.freepik.com/free-photo/design-workshop_23-2149444458.jpg',
      'https://img.freepik.com/free-photo/creative-collaboration_23-2149444459.jpg',
      'https://img.freepik.com/free-photo/artistic-event_23-2149444460.jpg'
    ]

    // Get all events
    const events = await prisma.event.findMany({
      where: {
        deletedAt: null
      },
      include: {
        category: true,
        owner: true
      }
    })

    // Filter events that don't have images
    const eventsWithoutImages = events.filter(event => {
      const metadata = event.metadata
      if (!metadata || typeof metadata !== 'object') return true
      return !metadata.mainImage || !metadata.galleryImages
    })

    console.log(`📊 Found ${eventsWithoutImages.length} events without images`)

    for (let i = 0; i < eventsWithoutImages.length; i++) {
      const event = eventsWithoutImages[i]
      console.log(`\n🖼️ Adding images to: ${event.title}`)

      // Select appropriate images based on category or random
      let imageIndex = i % designImages.length
      if (event.category) {
        // Try to match category with appropriate images
        const categoryName = event.category.name.toLowerCase()
        if (categoryName.includes('design') || categoryName.includes('architecture')) {
          imageIndex = i % 5 // First 5 images are design/architecture
        } else if (categoryName.includes('art') || categoryName.includes('culture')) {
          imageIndex = 5 + (i % 5) // Next 5 images are art/culture
        } else if (categoryName.includes('tech') || categoryName.includes('innovation')) {
          imageIndex = 10 + (i % 5) // Next 5 images are tech
        } else if (categoryName.includes('fashion') || categoryName.includes('style')) {
          imageIndex = 15 + (i % 5) // Next 5 images are fashion
        } else {
          imageIndex = 20 + (i % 5) // Last 5 images are creative
        }
      }

      const mainImage = designImages[imageIndex]
      const galleryImages = [
        designImages[imageIndex],
        designImages[(imageIndex + 1) % designImages.length],
        designImages[(imageIndex + 2) % designImages.length]
      ]

      // Update event metadata with images
      const currentMetadata = event.metadata || {}
      const updatedMetadata = {
        ...currentMetadata,
        mainImage: mainImage,
        galleryImages: galleryImages
      }

      await prisma.event.update({
        where: { id: event.id },
        data: {
          metadata: updatedMetadata
        }
      })

      // Also create photo gallery entries
      for (let j = 0; j < galleryImages.length; j++) {
        await prisma.photoGallery.create({
          data: {
            title: `${event.title} - Image ${j + 1}`,
            description: `Event image ${j + 1} for ${event.title}`,
            imageUrl: galleryImages[j],
            thumbnailUrl: galleryImages[j],
            altText: `${event.title} image ${j + 1}`,
            order: j,
            ownerId: event.ownerId
          }
        })
      }

      console.log(`✅ Added images to ${event.title}`)
    }

    console.log('\n🎉 Successfully added images to all events!')
    console.log('📊 Summary:')
    console.log(`  - ${eventsWithoutImages.length} events updated with images`)
    console.log('  - Each event now has a main image and gallery')
    console.log('  - Images are stored in event metadata and photo gallery')
    console.log('  - Images are categorized by event type')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addImagesToEvents()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
