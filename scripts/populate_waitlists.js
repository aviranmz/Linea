#!/usr/bin/env node

// Script to populate waitlists with realistic users
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Realistic data for generating users
const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'fastmail.com', 'zoho.com']
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Parker', 'Reese', 'Skyler', 'Tatum', 'Valentina', 'Willow', 'Xavier', 'Yara', 'Zoe', 'Aaron', 'Bella', 'Carlos', 'Diana', 'Elena', 'Felix', 'Grace', 'Henry', 'Isabella', 'Jake', 'Kate', 'Liam', 'Maya', 'Noah', 'Olivia', 'Paul', 'Ruby', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yuki', 'Zara']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts']
const businessTypes = ['Design Studio', 'Creative Agency', 'Fashion House', 'Art Gallery', 'Design Lab', 'Studio', 'Workshop', 'Atelier', 'Boutique', 'Collective']
const adjectives = ['Modern', 'Creative', 'Urban', 'Elegant', 'Contemporary', 'Innovative', 'Artistic', 'Stylish', 'Chic', 'Sophisticated']
const nouns = ['Design', 'Studio', 'Works', 'Lab', 'Space', 'Collective', 'Group', 'Team', 'House', 'Agency']

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateEmail() {
  const firstName = getRandomItem(firstNames).toLowerCase()
  const lastName = getRandomItem(lastNames).toLowerCase()
  const domain = getRandomItem(domains)
  const number = Math.floor(Math.random() * 100)
  
  const variations = [
    `${firstName}.${lastName}${number}@${domain}`,
    `${firstName}${lastName}@${domain}`,
    `${firstName}.${lastName}@${domain}`,
    `${firstName}${number}@${domain}`
  ]
  
  return getRandomItem(variations)
}

function generateName() {
  const firstName = getRandomItem(firstNames)
  const lastName = getRandomItem(lastNames)
  return `${firstName} ${lastName}`
}

function generateBusiness() {
  const adjective = getRandomItem(adjectives)
  const noun = getRandomItem(nouns)
  const type = getRandomItem(businessTypes)
  
  const variations = [
    `${adjective} ${noun} ${type}`,
    `${adjective} ${type}`,
    `${noun} ${type}`,
    `${adjective} ${noun}`
  ]
  
  return getRandomItem(variations)
}

function getRandomStatus() {
  const rand = Math.random()
  if (rand < 0.8) return 'PENDING'
  if (rand < 0.95) return 'CONFIRMED'
  return 'CANCELLED'
}

async function populateWaitlists() {
  try {
    console.log('🚀 Starting waitlist population...')
    
    // Get all events
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true, capacity: true }
    })
    
    console.log(`📊 Found ${events.length} events`)
    
    // Set capacity for events that don't have it
    for (const event of events) {
      if (!event.capacity) {
        const capacity = Math.floor(Math.random() * 100) + 20 // 20-120 capacity
        await prisma.event.update({
          where: { id: event.id },
          data: { capacity }
        })
        console.log(`✅ Set capacity for "${event.title}" to ${capacity}`)
      }
    }
    
    // Get updated events with capacity
    const eventsWithCapacity = await prisma.event.findMany({
      where: { deletedAt: null, capacity: { not: null } },
      select: { id: true, title: true, capacity: true }
    })
    
    console.log(`📅 Processing ${eventsWithCapacity.length} events with capacity...`)
    
    for (const event of eventsWithCapacity) {
      console.log(`\n📅 Processing: ${event.title} (Capacity: ${event.capacity})`)
      
      // Get current waitlist count
      const currentWaitlist = await prisma.waitlist.count({
        where: { eventId: event.id }
      })
      
      console.log(`   Current waitlist: ${currentWaitlist}`)
      
      // Calculate target (20% to 90% of capacity)
      const targetPercentage = Math.floor(Math.random() * 71) + 20 // 20-90%
      const targetCount = Math.floor((event.capacity * targetPercentage) / 100)
      const usersToAdd = Math.max(0, targetCount - currentWaitlist)
      
      console.log(`   Target: ${targetPercentage}% (${targetCount} users, ${usersToAdd} to add)`)
      
      if (usersToAdd === 0) {
        console.log('   ✅ Already at or above target')
        continue
      }
      
      // Add users to waitlist
      const users = []
      for (let i = 0; i < usersToAdd; i++) {
        const email = generateEmail()
        const name = generateName()
        const business = generateBusiness()
        const status = getRandomStatus()
        
        users.push({
          eventId: event.id,
          email,
          name,
          businessName: business,
          status,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        })
      }
      
      // Batch insert users
      await prisma.waitlist.createMany({
        data: users,
        skipDuplicates: true
      })
      
      console.log(`   ✅ Added ${usersToAdd} users to waitlist`)
      
      // Show status breakdown
      const statusCounts = users.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1
        return acc
      }, {})
      
      console.log(`   📊 Status breakdown:`, statusCounts)
    }
    
    // Final summary
    console.log('\n🎉 Waitlist population completed!')
    console.log('\n📊 Final Summary:')
    
    const finalEvents = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true, capacity: true },
      include: { _count: { select: { waitlist: true } } }
    })
    
    for (const event of finalEvents) {
      const percentage = event.capacity ? Math.round((event._count.waitlist / event.capacity) * 100) : 0
      console.log(`   - ${event.title}: ${event._count.waitlist}/${event.capacity} (${percentage}%)`)
    }
    
  } catch (error) {
    console.error('❌ Error populating waitlists:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateWaitlists()
