#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function generateEventQR(eventUrl) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(eventUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      type: 'image/png'
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

async function updateEventsWithQR() {
  try {
    console.log('🔄 Starting QR code generation for all events...')
    
    // Get all events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        metadata: true
      }
    })
    
    console.log(`📋 Found ${events.length} events to process`)
    
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3050'
    let updatedCount = 0
    let errorCount = 0
    
    for (const event of events) {
      try {
        console.log(`\n🎯 Processing: ${event.title}`)
        
        // Check if event already has QR code
        const currentMetadata = event.metadata || {}
        if (currentMetadata.qrUrl) {
          console.log(`  ✅ Already has QR code, skipping`)
          continue
        }
        
        // Generate QR code
        const eventUrl = `${baseUrl}/events/${event.slug}`
        console.log(`  🔗 Event URL: ${eventUrl}`)
        
        const qrCodeDataURL = await generateEventQR(eventUrl)
        console.log(`  📱 Generated QR code (${qrCodeDataURL.length} chars)`)
        
        // Update event metadata
        const updatedMetadata = {
          ...currentMetadata,
          qrUrl: qrCodeDataURL
        }
        
        await prisma.event.update({
          where: { id: event.id },
          data: { metadata: updatedMetadata }
        })
        
        console.log(`  ✅ Updated event with QR code`)
        updatedCount++
        
      } catch (error) {
        console.error(`  ❌ Error processing ${event.title}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 QR code generation completed!`)
    console.log(`   ✅ Successfully updated: ${updatedCount} events`)
    console.log(`   ❌ Errors: ${errorCount} events`)
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
updateEventsWithQR()