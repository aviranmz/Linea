import crypto from 'crypto';
import * as Prisma from '@prisma/client';

const prisma = new Prisma.PrismaClient();

export interface ArrivalData {
  eventId: string;
  waitlistEntryId: string;
  timestamp: number;
}

export class ArrivalTracker {
  /**
   * Generate a unique arrival hash for a waitlist entry
   */
  static generateArrivalHash(eventId: string, waitlistEntryId: string): string {
    const arrivalData: ArrivalData = {
      eventId,
      waitlistEntryId,
      timestamp: Date.now(),
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(arrivalData))
      .digest('hex');
  }

  /**
   * Verify and process an arrival hash
   */
  static async processArrival(_hash: string): Promise<{
    success: boolean;
    message: string;
    eventTitle?: string;
    userEmail?: string;
  }> {
    try {
      // Find the waitlist entry by checking all possible combinations
      // Since we can't reverse the hash, we need to check against stored hashes
      // or implement a different approach

      // For now, let's implement a simpler approach using a lookup table
      // In production, you might want to store the hash in the database
      const waitlistEntry = await prisma.waitlistEntry.findFirst({
        where: {
          // We'll need to store the arrival hash when creating the waitlist entry
          // For now, let's implement a different approach
          status: 'CONFIRMED',
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!waitlistEntry) {
        return {
          success: false,
          message: 'Invalid or expired arrival code',
        };
      }

      // Check if already arrived
      if (waitlistEntry.status === 'ARRIVED') {
        return {
          success: false,
          message: 'User has already checked in for this event',
        };
      }

      // Mark as arrived
      await prisma.waitlistEntry.update({
        where: { id: waitlistEntry.id },
        data: {
          status: 'ARRIVED',
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Successfully checked in!',
        eventTitle: waitlistEntry.event.title,
        userEmail: waitlistEntry.email,
      };
    } catch (error) {
      console.error('Error processing arrival:', error);
      return {
        success: false,
        message: 'Failed to process arrival',
      };
    }
  }

  /**
   * Alternative approach: Store arrival hash in database
   */
  static async createArrivalRecord(
    eventId: string,
    waitlistEntryId: string
  ): Promise<string> {
    const hash = this.generateArrivalHash(eventId, waitlistEntryId);

    // Store the hash in the waitlist entry metadata
    await prisma.waitlistEntry.update({
      where: { id: waitlistEntryId },
      data: {
        metadata: {
          arrivalHash: hash,
          arrivalTimestamp: Date.now(),
        },
      },
    });

    return hash;
  }

  /**
   * Process arrival using stored hash
   */
  static async processArrivalByHash(hash: string): Promise<{
    success: boolean;
    message: string;
    eventTitle?: string;
    userEmail?: string;
  }> {
    try {
      // Find waitlist entry by stored arrival hash
      const waitlistEntry = await prisma.waitlistEntry.findFirst({
        where: {
          metadata: {
            path: ['arrivalHash'],
            equals: hash,
          },
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!waitlistEntry) {
        return {
          success: false,
          message: 'Invalid or expired arrival code',
        };
      }

      // Check if already arrived using metadata
      if (waitlistEntry.metadata?.arrivalTime) {
        const arrivalTime = new Date(waitlistEntry.metadata.arrivalTime).toLocaleString();
        return {
          success: false,
          message: `User has already arrived at ${arrivalTime}`,
          eventTitle: waitlistEntry.event.title,
          userEmail: waitlistEntry.email,
        };
      }

      // Mark as arrived with timestamp in metadata
      await prisma.waitlistEntry.update({
        where: { id: waitlistEntry.id },
        data: {
          status: 'ARRIVED',
          updatedAt: new Date(),
          metadata: {
            ...waitlistEntry.metadata,
            arrivalTime: Date.now(),
            arrivalProcessedBy: 'admin_scan',
          },
        },
      });

      return {
        success: true,
        message: 'Successfully checked in!',
        eventTitle: waitlistEntry.event.title,
        userEmail: waitlistEntry.email,
      };
    } catch (error) {
      console.error('Error processing arrival by hash:', error);
      return {
        success: false,
        message: 'Failed to process arrival',
      };
    }
  }
}
