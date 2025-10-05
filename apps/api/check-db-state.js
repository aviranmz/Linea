import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseState() {
  try {
    console.log('🔍 Checking Database State...\n');
    
    // Count all tables
    const users = await prisma.user.count();
    const events = await prisma.event.count();
    const venues = await prisma.venue.count();
    const categories = await prisma.category.count();
    const waitlistEntries = await prisma.waitlistEntry.count();
    const photoGalleries = await prisma.photoGallery.count();
    const favorites = await prisma.favorite.count();
    const sessions = await prisma.session.count();
    
    console.log('📊 Database Statistics:');
    console.log(`👥 Users: ${users}`);
    console.log(`🎉 Events: ${events}`);
    console.log(`🏢 Venues: ${venues}`);
    console.log(`📂 Categories: ${categories}`);
    console.log(`📋 Waitlist Entries: ${waitlistEntries}`);
    console.log(`📸 Photo Galleries: ${photoGalleries}`);
    console.log(`❤️  Favorites: ${favorites}`);
    console.log(`🔐 Sessions: ${sessions}`);
    
    // Check for owners (users with role OWNER)
    const owners = await prisma.user.findMany({
      where: { role: 'OWNER' },
      select: { id: true, email: true, businessName: true, name: true }
    });
    
    console.log(`\n👑 Owners (${owners.length}):`);
    owners.forEach(owner => {
      console.log(`  - ${owner.name || 'No Name'} (${owner.email}) - ${owner.businessName || 'No Business'}`);
    });
    
    // Check for events with metadata
    const eventsWithMetadata = await prisma.event.findMany({
      where: {
        metadata: {
          not: null
        }
      },
      select: { id: true, title: true, metadata: true }
    });
    
    console.log(`\n🎯 Events with Metadata (${eventsWithMetadata.length}):`);
    eventsWithMetadata.forEach(event => {
      const hasImages = event.metadata?.mainImage || event.metadata?.galleryImages;
      const hasQR = event.metadata?.qrUrl;
      console.log(`  - ${event.title}: Images=${hasImages ? '✅' : '❌'}, QR=${hasQR ? '✅' : '❌'}`);
    });
    
    // Check recent waitlist entries
    const recentWaitlist = await prisma.waitlistEntry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } }
      }
    });
    
    console.log(`\n📋 Recent Waitlist Entries (${recentWaitlist.length}):`);
    recentWaitlist.forEach(entry => {
      console.log(`  - ${entry.user.name || entry.user.email} → ${entry.event.title} (${entry.status})`);
    });
    
    console.log('\n✅ Database state check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking database state:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseState();
