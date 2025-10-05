import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateWaitlistData() {
  try {
    console.log('🚀 Starting to populate waitlist data...')

    // Find the specific events
    const events = await prisma.event.findMany({
      where: {
        title: {
          in: [
            'Milano Design Week 2024',
            'Tech Innovation Summit 2024', 
            'Contemporary Art Exhibition'
          ]
        }
      }
    })

    console.log(`Found ${events.length} events:`)
    events.forEach(event => {
      console.log(`- ${event.title} (ID: ${event.id}, Capacity: ${event.capacity})`)
    })

    // Create users and waitlist entries for each event
    for (const event of events) {
      if (!event.capacity) {
        console.log(`⚠️ Skipping ${event.title} - no capacity set`)
        continue
      }

      const waitlistCount = Math.floor(event.capacity * 0.1) // 10% of capacity
      console.log(`\n📝 Creating ${waitlistCount} waitlist entries for ${event.title}...`)

      // Create users and waitlist entries
      for (let i = 1; i <= waitlistCount; i++) {
        const email = `user${i}@${event.slug.replace(/-/g, '')}.com`
        const name = `User ${i} ${event.title.split(' ')[0]}`

        try {
          // Create or find user
          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              name,
              role: 'VISITOR',
              isActive: true
            }
          })

          // Create waitlist entry
          await prisma.waitlistEntry.create({
            data: {
              email,
              eventId: event.id,
              userId: user.id,
              status: 'PENDING'
            }
          })

          console.log(`✅ Created waitlist entry ${i}/${waitlistCount} for ${event.title}`)
        } catch (error) {
          console.error(`❌ Error creating entry ${i} for ${event.title}:`, error.message)
        }
      }
    }

    console.log('\n🎉 Waitlist data population completed!')
    
    // Show summary
    for (const event of events) {
      const waitlistCount = await prisma.waitlistEntry.count({
        where: { eventId: event.id }
      })
      console.log(`📊 ${event.title}: ${waitlistCount} waitlist entries`)
    }

  } catch (error) {
    console.error('❌ Error populating waitlist data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateWaitlistData()
