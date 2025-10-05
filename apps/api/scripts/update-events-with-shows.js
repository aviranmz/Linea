import { PrismaClient } from '../dist/generated/client/index.js'

const prisma = new PrismaClient()

async function updateEventsWithShows() {
  console.log('🔄 Starting to update events with shows and current dates...')
  
  try {
    // Get all events
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true, slug: true, startDate: true }
    })

    console.log(`📋 Found ${events.length} events to process`)

    for (const event of events) {
      console.log(`\n🎯 Processing: ${event.title}`)
      
      // Update event dates to be in the future (next 30-90 days)
      const now = new Date()
      const futureDate = new Date(now.getTime() + (Math.random() * 60 + 30) * 24 * 60 * 60 * 1000) // 30-90 days from now
      const endDate = new Date(futureDate.getTime() + 4 * 60 * 60 * 1000) // 4 hours later
      
      await prisma.event.update({
        where: { id: event.id },
        data: {
          startDate: futureDate,
          endDate: endDate
        }
      })
      
      console.log(`  📅 Updated dates to: ${futureDate.toISOString()}`)
      
      // Check if event already has shows
      const existingShows = await prisma.show.findMany({
        where: { eventId: event.id, deletedAt: null }
      })
      
      if (existingShows.length === 0) {
        // Create 2-3 shows for each event
        const showCount = Math.floor(Math.random() * 2) + 2 // 2-3 shows
        
        for (let i = 0; i < showCount; i++) {
          const showStartDate = new Date(futureDate.getTime() + (i * 2) * 60 * 60 * 1000) // 2 hours apart
          const showEndDate = new Date(showStartDate.getTime() + 1.5 * 60 * 60 * 1000) // 1.5 hours duration
          
          const showTitles = [
            'Opening Ceremony',
            'Keynote Presentation',
            'Panel Discussion',
            'Networking Session',
            'Workshop',
            'Closing Remarks'
          ]
          
          const showDescriptions = [
            'Official opening of the event',
            'Key insights from industry leaders',
            'Interactive panel with experts',
            'Networking and collaboration opportunities',
            'Hands-on learning experience',
            'Final thoughts and next steps'
          ]
          
          await prisma.show.create({
            data: {
              title: showTitles[i % showTitles.length],
              description: showDescriptions[i % showDescriptions.length],
              startDate: showStartDate,
              endDate: showEndDate,
              capacity: Math.floor(Math.random() * 50) + 20, // 20-70 capacity
              eventId: event.id
            }
          })
        }
        
        console.log(`  🎭 Created ${showCount} shows`)
      } else {
        console.log(`  ✅ Already has ${existingShows.length} shows`)
      }
    }
    
    console.log(`\n🎉 Events update completed!`)
    
  } catch (error) {
    console.error('Fatal error during events update:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateEventsWithShows()
