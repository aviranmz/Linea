import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function add5OwnersComplete() {
  try {
    console.log('🚀 Starting to add 5 new owners with complete details...')

    // Get existing users for waitlist population
    const existingUsers = await prisma.user.findMany({
      where: {
        role: 'VISITOR',
        isActive: true
      },
      take: 50 // Get up to 50 existing users
    })

    console.log(`📊 Found ${existingUsers.length} existing users for waitlist population`)

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

    // Define 5 new owners with complete details
    const owners = [
      {
        email: 'alessandro.rossi@milano-design.it',
        name: 'Alessandro Rossi',
        businessName: 'Milano Design Studio',
        businessIntro: 'Premier design studio specializing in contemporary Italian furniture and interior design. We create bespoke pieces that blend traditional craftsmanship with modern aesthetics.',
        website: 'https://milano-design-studio.com',
        facebookUrl: 'https://facebook.com/milanodesignstudio',
        instagramUrl: 'https://instagram.com/milanodesignstudio',
        phone: '+39 02 1234 5678',
        city: 'Milan',
        country: 'Italy',
        address: 'Via Montenapoleone 12, 20121 Milano MI, Italy',
        latitude: 45.4689,
        longitude: 9.1960,
        logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      },
      {
        email: 'sophie.martin@paris-art.fr',
        name: 'Sophie Martin',
        businessName: 'Atelier Sophie Martin',
        businessIntro: 'Contemporary art gallery and cultural space in the heart of Paris. We showcase emerging and established artists, hosting exhibitions, workshops, and cultural events.',
        website: 'https://atelier-sophie-martin.fr',
        facebookUrl: 'https://facebook.com/ateliersophiemartin',
        instagramUrl: 'https://instagram.com/ateliersophiemartin',
        phone: '+33 1 42 36 78 90',
        city: 'Paris',
        country: 'France',
        address: '15 Rue de Rivoli, 75001 Paris, France',
        latitude: 48.8566,
        longitude: 2.3522,
        logoUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
      },
      {
        email: 'david.kim@seoul-tech.kr',
        name: 'David Kim',
        businessName: 'Seoul Innovation Lab',
        businessIntro: 'Leading technology innovation hub in Seoul, South Korea. We organize tech conferences, startup incubator programs, and digital transformation workshops for enterprises.',
        website: 'https://seoul-innovation-lab.kr',
        facebookUrl: 'https://facebook.com/seoulinnovationlab',
        instagramUrl: 'https://instagram.com/seoulinnovationlab',
        phone: '+82 2 1234 5678',
        city: 'Seoul',
        country: 'South Korea',
        address: '123 Gangnam-daero, Gangnam-gu, Seoul, South Korea',
        latitude: 37.5665,
        longitude: 126.9780,
        logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=center',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      },
      {
        email: 'maria.garcia@madrid-fashion.es',
        name: 'María García',
        businessName: 'Madrid Fashion House',
        businessIntro: 'Exclusive fashion house specializing in sustainable and ethical fashion. We host fashion shows, designer showcases, and sustainable fashion workshops.',
        website: 'https://madrid-fashion-house.es',
        facebookUrl: 'https://facebook.com/madridfashionhouse',
        instagramUrl: 'https://instagram.com/madridfashionhouse',
        phone: '+34 91 123 45 67',
        city: 'Madrid',
        country: 'Spain',
        address: 'Calle de Serrano 45, 28001 Madrid, Spain',
        latitude: 40.4168,
        longitude: -3.7038,
        logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      },
      {
        email: 'james.wilson@london-creative.co.uk',
        name: 'James Wilson',
        businessName: 'London Creative Collective',
        businessIntro: 'Multidisciplinary creative agency and event space in London. We organize art exhibitions, music events, creative workshops, and networking events for the creative community.',
        website: 'https://london-creative-collective.co.uk',
        facebookUrl: 'https://facebook.com/londoncreativecollective',
        instagramUrl: 'https://instagram.com/londoncreativecollective',
        phone: '+44 20 7123 4567',
        city: 'London',
        country: 'United Kingdom',
        address: '15 Shoreditch High Street, London E1 6JQ, UK',
        latitude: 51.5074,
        longitude: -0.1278,
        logoUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center',
        profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
      }
    ]

    // Create venues for each owner
    const venues = [
      {
        name: 'Milano Design Center',
        address: 'Via Montenapoleone 12, 20121 Milano MI, Italy',
        city: 'Milan',
        country: 'Italy',
        latitude: 45.4689,
        longitude: 9.1960,
        website: 'https://milano-design-studio.com'
      },
      {
        name: 'Atelier Sophie Martin Gallery',
        address: '15 Rue de Rivoli, 75001 Paris, France',
        city: 'Paris',
        country: 'France',
        latitude: 48.8566,
        longitude: 2.3522,
        website: 'https://atelier-sophie-martin.fr'
      },
      {
        name: 'Seoul Innovation Center',
        address: '123 Gangnam-daero, Gangnam-gu, Seoul, South Korea',
        city: 'Seoul',
        country: 'South Korea',
        latitude: 37.5665,
        longitude: 126.9780,
        website: 'https://seoul-innovation-lab.kr'
      },
      {
        name: 'Madrid Fashion House',
        address: 'Calle de Serrano 45, 28001 Madrid, Spain',
        city: 'Madrid',
        country: 'Spain',
        latitude: 40.4168,
        longitude: -3.7038,
        website: 'https://madrid-fashion-house.es'
      },
      {
        name: 'London Creative Space',
        address: '15 Shoreditch High Street, London E1 6JQ, UK',
        city: 'London',
        country: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        website: 'https://london-creative-collective.co.uk'
      }
    ]

    // Create categories
    const categories = [
      { name: 'Design & Architecture', slug: 'design-architecture', color: '#8B5CF6', icon: '🏗️' },
      { name: 'Art & Culture', slug: 'art-culture', color: '#F59E0B', icon: '🎨' },
      { name: 'Technology & Innovation', slug: 'technology-innovation', color: '#10B981', icon: '💻' },
      { name: 'Fashion & Style', slug: 'fashion-style', color: '#EF4444', icon: '👗' },
      { name: 'Creative & Arts', slug: 'creative-arts', color: '#3B82F6', icon: '🎭' }
    ]

    // Create categories first
    console.log('📂 Creating categories...')
    const createdCategories = []
    for (const categoryData of categories) {
      try {
        const category = await prisma.category.upsert({
          where: { slug: categoryData.slug },
          update: {},
          create: categoryData
        })
        createdCategories.push(category)
        console.log(`✅ Created/Found category: ${category.name}`)
      } catch (error) {
        // If upsert fails due to name conflict, try to find existing
        const existingCategory = await prisma.category.findFirst({
          where: { name: categoryData.name }
        })
        if (existingCategory) {
          createdCategories.push(existingCategory)
          console.log(`✅ Found existing category: ${existingCategory.name}`)
        } else {
          // Create with unique name
          const uniqueName = `${categoryData.name} ${Date.now()}`
          const category = await prisma.category.create({
            data: { ...categoryData, name: uniqueName }
          })
          createdCategories.push(category)
          console.log(`✅ Created category with unique name: ${category.name}`)
        }
      }
    }

    // Create venues
    console.log('🏢 Creating venues...')
    const createdVenues = []
    for (const venueData of venues) {
      try {
        const venue = await prisma.venue.upsert({
          where: { name: venueData.name },
          update: {},
          create: venueData
        })
        createdVenues.push(venue)
        console.log(`✅ Created/Found venue: ${venue.name}`)
      } catch (error) {
        // If upsert fails, try to find existing
        const existingVenue = await prisma.venue.findFirst({
          where: { name: venueData.name }
        })
        if (existingVenue) {
          createdVenues.push(existingVenue)
          console.log(`✅ Found existing venue: ${existingVenue.name}`)
        } else {
          // Create with unique name
          const uniqueName = `${venueData.name} ${Date.now()}`
          const venue = await prisma.venue.create({
            data: { ...venueData, name: uniqueName }
          })
          createdVenues.push(venue)
          console.log(`✅ Created venue with unique name: ${venue.name}`)
        }
      }
    }

    // Create owners and their events
    for (let i = 0; i < owners.length; i++) {
      const ownerData = owners[i]
      const venue = createdVenues[i]
      const category = createdCategories[i]

      console.log(`\n👤 Creating owner ${i + 1}: ${ownerData.name}`)
      
      // Create owner
      const owner = await prisma.user.upsert({
        where: { email: ownerData.email },
        update: {},
        create: {
          ...ownerData,
          role: 'OWNER',
          isActive: true,
          lastLoginAt: new Date()
        }
      })

      console.log(`✅ Created owner: ${owner.name} (${owner.email})`)

      // Create 3 events for each owner
      const eventsData = [
        {
          title: `${ownerData.businessName} - Spring Collection Launch`,
          description: `Join us for the exclusive launch of our spring collection featuring innovative designs and sustainable materials. This event will showcase our latest creations and provide insights into our design philosophy.`,
          shortDescription: 'Exclusive spring collection launch with innovative designs',
          startDate: new Date(Date.now() + (i * 7 + 1) * 24 * 60 * 60 * 1000), // Different dates for each owner
          endDate: new Date(Date.now() + (i * 7 + 1) * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
          capacity: 150,
          youtubeUrl: `https://youtube.com/watch?v=spring${i}`,
          mapLat: venue.latitude,
          mapLng: venue.longitude,
          mapZoom: 15,
          mapAddress: venue.address,
          categoryId: category.id,
          venueId: venue.id,
          featured: i === 0, // First owner's first event is featured
          isPublic: true,
          status: 'PUBLISHED',
          tags: ['launch', 'exclusive', 'spring', 'design'],
          metadata: {
            facebookUrl: ownerData.facebookUrl,
            instagramUrl: ownerData.instagramUrl,
            website: ownerData.website,
            phone: ownerData.phone,
            mainImage: designImages[i * 3 + 0],
            galleryImages: [
              designImages[i * 3 + 0],
              designImages[i * 3 + 1],
              designImages[i * 3 + 2]
            ]
          }
        },
        {
          title: `${ownerData.businessName} - Workshop Series`,
          description: `Hands-on workshop series where participants will learn from industry experts. This interactive session covers the latest trends, techniques, and best practices in our field.`,
          shortDescription: 'Interactive workshop with industry experts',
          startDate: new Date(Date.now() + (i * 7 + 3) * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + (i * 7 + 3) * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hours later
          capacity: 80,
          youtubeUrl: `https://youtube.com/watch?v=workshop${i}`,
          mapLat: venue.latitude,
          mapLng: venue.longitude,
          mapZoom: 15,
          mapAddress: venue.address,
          categoryId: category.id,
          venueId: venue.id,
          isPublic: true,
          status: 'PUBLISHED',
          tags: ['workshop', 'learning', 'hands-on', 'expert'],
          metadata: {
            facebookUrl: ownerData.facebookUrl,
            instagramUrl: ownerData.instagramUrl,
            website: ownerData.website,
            phone: ownerData.phone,
            mainImage: designImages[i * 3 + 1],
            galleryImages: [
              designImages[i * 3 + 0],
              designImages[i * 3 + 1],
              designImages[i * 3 + 2]
            ]
          }
        },
        {
          title: `${ownerData.businessName} - Networking Evening`,
          description: `Exclusive networking evening bringing together industry professionals, creatives, and enthusiasts. Enjoy cocktails, canapés, and meaningful conversations in an elegant setting.`,
          shortDescription: 'Exclusive networking evening with industry professionals',
          startDate: new Date(Date.now() + (i * 7 + 5) * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + (i * 7 + 5) * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
          capacity: 120,
          youtubeUrl: `https://youtube.com/watch?v=networking${i}`,
          mapLat: venue.latitude,
          mapLng: venue.longitude,
          mapZoom: 15,
          mapAddress: venue.address,
          categoryId: category.id,
          venueId: venue.id,
          isPublic: true,
          status: 'PUBLISHED',
          tags: ['networking', 'professional', 'cocktails', 'elegant'],
          metadata: {
            facebookUrl: ownerData.facebookUrl,
            instagramUrl: ownerData.instagramUrl,
            website: ownerData.website,
            phone: ownerData.phone,
            mainImage: designImages[i * 3 + 2],
            galleryImages: [
              designImages[i * 3 + 0],
              designImages[i * 3 + 1],
              designImages[i * 3 + 2]
            ]
          }
        }
      ]

      console.log(`📅 Creating 3 events for ${owner.name}...`)
      
      for (const eventData of eventsData) {
        const slug = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        
        const event = await prisma.event.create({
          data: {
            ...eventData,
            slug,
            ownerId: owner.id
          }
        })

        console.log(`✅ Created event: ${event.title}`)

        // Create waitlist entries (10% of capacity)
        const waitlistCount = Math.floor(event.capacity * 0.1)
        console.log(`📝 Creating ${waitlistCount} waitlist entries for ${event.title}...`)

        // Use existing users for waitlist
        const usersForWaitlist = existingUsers.slice(0, waitlistCount)
        
        for (let j = 0; j < waitlistCount; j++) {
          const user = usersForWaitlist[j]
          if (user) {
            try {
              await prisma.waitlistEntry.create({
                data: {
                  email: user.email,
                  eventId: event.id,
                  userId: user.id,
                  status: 'PENDING'
                }
              })
              console.log(`✅ Added ${user.email} to waitlist for ${event.title}`)
            } catch (error) {
              console.log(`⚠️ User ${user.email} already on waitlist for ${event.title}`)
            }
          }
        }

        // Update event waitlist count
        await prisma.event.update({
          where: { id: event.id },
          data: { currentWaitlist: waitlistCount }
        })

        // Create photo gallery for the event with real design images

        const photoGallery = [
          {
            title: `${event.title} - Main Event Image`,
            description: 'Main promotional image showcasing the event',
            imageUrl: designImages[i * 3 + 0],
            thumbnailUrl: designImages[i * 3 + 0],
            altText: `${event.title} main promotional image`,
            order: 0,
            ownerId: owner.id
          },
          {
            title: `${event.title} - Venue & Setup`,
            description: 'Event venue and professional setup',
            imageUrl: designImages[i * 3 + 1],
            thumbnailUrl: designImages[i * 3 + 1],
            altText: `${event.title} venue and setup`,
            order: 1,
            ownerId: owner.id
          },
          {
            title: `${event.title} - Behind the Scenes`,
            description: 'Behind the scenes preparation and team work',
            imageUrl: designImages[i * 3 + 2],
            thumbnailUrl: designImages[i * 3 + 2],
            altText: `${event.title} behind the scenes`,
            order: 2,
            ownerId: owner.id
          }
        ]

        for (const photoData of photoGallery) {
          await prisma.photoGallery.create({
            data: photoData
          })
        }

        console.log(`📸 Created photo gallery for ${event.title}`)
      }
    }

    console.log('\n🎉 Successfully added 5 new owners with complete details!')
    console.log('📊 Summary:')
    console.log('  - 5 new owners created with full business details')
    console.log('  - 15 events created (3 per owner)')
    console.log('  - All events have waitlists populated with existing users (10% capacity)')
    console.log('  - All events include images, social media links, and complete metadata')
    console.log('  - Photo galleries created for each event')
    console.log('  - Venues and categories created and linked')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

add5OwnersComplete()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
