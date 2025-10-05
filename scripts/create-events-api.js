// Script to create events using API endpoints
const events = [
  // Owner 2 Events (Sarah Johnson - Creative Events Co.)
  {
    owner: {
      email: 'owner2@linea.app',
      name: 'Sarah Johnson',
      businessName: 'Creative Events Co.',
      businessIntro: 'We create unforgettable experiences',
      website: 'https://creativeevents.co',
      city: 'New York',
      country: 'USA'
    },
    events: [
      {
        title: 'Creative Design Workshop',
        description: 'Join us for an immersive design workshop where creativity meets innovation. Learn from industry experts and create stunning visual experiences.',
        shortDescription: 'Immersive design workshop with industry experts',
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // Next Monday
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        capacity: 50,
        venue: {
          name: 'Grand Ballroom NYC',
          address: '123 Broadway, New York, NY 10001',
          city: 'New York',
          country: 'USA',
          latitude: 40.7589,
          longitude: -73.9851,
          website: 'https://grandballroomnyc.com'
        },
        isPublic: true,
        featured: true,
        tags: ['design', 'workshop', 'creativity'],
        mapLat: 40.7589,
        mapLng: -73.9851,
        mapZoom: 15
      },
      {
        title: 'Art Gallery Opening Night',
        description: 'Experience the latest contemporary art exhibition featuring emerging and established artists. Network with art enthusiasts and collectors.',
        shortDescription: 'Contemporary art exhibition opening night',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Next Wednesday
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        capacity: 100,
        venue: {
          name: 'Creative Studio Space',
          address: '456 Art District, New York, NY 10002',
          city: 'New York',
          country: 'USA',
          latitude: 40.7505,
          longitude: -73.9934,
          website: 'https://creativestudiospace.com'
        },
        isPublic: true,
        featured: false,
        tags: ['art', 'gallery', 'networking'],
        mapLat: 40.7505,
        mapLng: -73.9934,
        mapZoom: 15
      },
      {
        title: 'Creative Networking Mixer',
        description: 'Connect with fellow creatives, entrepreneurs, and industry professionals in a relaxed and inspiring atmosphere.',
        shortDescription: 'Networking event for creative professionals',
        startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // Next Friday
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        capacity: 75,
        venue: {
          name: 'Grand Ballroom NYC',
          address: '123 Broadway, New York, NY 10001',
          city: 'New York',
          country: 'USA',
          latitude: 40.7589,
          longitude: -73.9851,
          website: 'https://grandballroomnyc.com'
        },
        isPublic: true,
        featured: false,
        tags: ['networking', 'creative', 'professional'],
        mapLat: 40.7589,
        mapLng: -73.9851,
        mapZoom: 15
      }
    ]
  },
  // Owner 3 Events (Michael Chen - Tech Innovation Hub)
  {
    owner: {
      email: 'owner3@linea.app',
      name: 'Michael Chen',
      businessName: 'Tech Innovation Hub',
      businessIntro: 'Leading technology and innovation events',
      website: 'https://techinnovationhub.com',
      city: 'San Francisco',
      country: 'USA'
    },
    events: [
      {
        title: 'AI Innovation Summit',
        description: 'Explore the latest developments in artificial intelligence and machine learning. Hear from leading researchers and industry pioneers.',
        shortDescription: 'Latest AI and ML developments summit',
        startDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), // Next Tuesday
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
        capacity: 200,
        venue: {
          name: 'Silicon Valley Convention Center',
          address: '789 Innovation Drive, San Francisco, CA 94105',
          city: 'San Francisco',
          country: 'USA',
          latitude: 37.7749,
          longitude: -122.4194,
          website: 'https://svconvention.com'
        },
        isPublic: true,
        featured: true,
        tags: ['AI', 'technology', 'innovation', 'summit'],
        mapLat: 37.7749,
        mapLng: -122.4194,
        mapZoom: 15
      },
      {
        title: 'Startup Pitch Competition',
        description: 'Watch innovative startups pitch their ideas to a panel of investors and industry experts. Great opportunity for networking and learning.',
        shortDescription: 'Startup pitch competition with investors',
        startDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(), // Next Thursday
        endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        capacity: 150,
        venue: {
          name: 'Tech Hub Auditorium',
          address: '321 Startup Blvd, San Francisco, CA 94107',
          city: 'San Francisco',
          country: 'USA',
          latitude: 37.7849,
          longitude: -122.4094,
          website: 'https://techhubauditorium.com'
        },
        isPublic: true,
        featured: false,
        tags: ['startup', 'pitch', 'investment', 'competition'],
        mapLat: 37.7849,
        mapLng: -122.4094,
        mapZoom: 15
      },
      {
        title: 'Tech Leadership Workshop',
        description: 'Develop your leadership skills in the tech industry. Interactive sessions with experienced tech leaders and executives.',
        shortDescription: 'Leadership development for tech professionals',
        startDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(), // Next Saturday
        endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
        capacity: 80,
        venue: {
          name: 'Silicon Valley Convention Center',
          address: '789 Innovation Drive, San Francisco, CA 94105',
          city: 'San Francisco',
          country: 'USA',
          latitude: 37.7749,
          longitude: -122.4194,
          website: 'https://svconvention.com'
        },
        isPublic: true,
        featured: false,
        tags: ['leadership', 'tech', 'workshop', 'development'],
        mapLat: 37.7749,
        mapLng: -122.4194,
        mapZoom: 15
      }
    ]
  }
]

console.log('📅 Events to be created:')
console.log('='.repeat(50))

events.forEach((ownerData, index) => {
  console.log(`\n👤 Owner ${index + 2}: ${ownerData.owner.name} (${ownerData.owner.businessName})`)
  console.log(`📧 Email: ${ownerData.owner.email}`)
  console.log(`🏢 Business: ${ownerData.owner.businessIntro}`)
  console.log(`🌐 Website: ${ownerData.owner.website}`)
  console.log(`📍 Location: ${ownerData.owner.city}, ${ownerData.owner.country}`)
  
  console.log(`\n📅 Events (${ownerData.events.length}):`)
  ownerData.events.forEach((event, eventIndex) => {
    console.log(`  ${eventIndex + 1}. ${event.title}`)
    console.log(`     📝 ${event.shortDescription}`)
    console.log(`     📅 ${new Date(event.startDate).toLocaleDateString()} at ${new Date(event.startDate).toLocaleTimeString()}`)
    console.log(`     🏢 ${event.venue.name}`)
    console.log(`     👥 Capacity: ${event.capacity}`)
    console.log(`     🏷️  Tags: ${event.tags.join(', ')}`)
    console.log(`     ${event.featured ? '⭐ Featured' : '📌 Regular'}`)
    console.log('')
  })
})

console.log('='.repeat(50))
console.log('📊 Summary:')
console.log(`• Total Owners: ${events.length}`)
console.log(`• Total Events: ${events.reduce((sum, owner) => sum + owner.events.length, 0)}`)
console.log(`• Featured Events: ${events.reduce((sum, owner) => sum + owner.events.filter(e => e.featured).length, 0)}`)
console.log(`• All events scheduled for next week`)
console.log(`• All events are public and published`)

console.log('\n🎯 Next Steps:')
console.log('1. Start the API server: pnpm --filter @linea/api dev')
console.log('2. Use the API endpoints to create users and events')
console.log('3. Or manually add these events through the admin interface')
