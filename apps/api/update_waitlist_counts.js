#!/usr/bin/env node

// Script to update currentWaitlist field for all events
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateWaitlistCounts() {
  try {
    console.log('🔄 Updating waitlist counts for all events...');

    // Get all events
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true },
    });

    console.log(`📊 Found ${events.length} events`);

    for (const event of events) {
      // Count actual waitlist entries for this event
      const waitlistCount = await prisma.waitlistEntry.count({
        where: {
          eventId: event.id,
          deletedAt: null,
        },
      });

      // Update the currentWaitlist field
      await prisma.event.update({
        where: { id: event.id },
        data: { currentWaitlist: waitlistCount },
      });

      console.log(
        `✅ Updated "${event.title}": ${waitlistCount} waitlist entries`
      );
    }

    console.log('\n🎉 Waitlist counts updated successfully!');

    // Show final summary
    const finalEvents = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true, currentWaitlist: true, capacity: true },
    });

    console.log('\n📊 Final Summary:');
    for (const event of finalEvents) {
      const percentage = event.capacity
        ? Math.round((event.currentWaitlist / event.capacity) * 100)
        : 0;
      console.log(
        `   - ${event.title}: ${event.currentWaitlist}/${event.capacity || 'unlimited'} (${percentage}%)`
      );
    }
  } catch (error) {
    console.error('❌ Error updating waitlist counts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWaitlistCounts();
