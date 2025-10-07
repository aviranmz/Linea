const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkOwners() {
  try {
    console.log('🔍 Checking all owners in the database...\n');

    // Get all users with OWNER role
    const owners = await prisma.user.findMany({
      where: {
        role: 'OWNER',
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        createdAt: true,
        isActive: true,
        _count: {
          select: {
            ownedEvents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Found ${owners.length} owners:\n`);

    if (owners.length === 0) {
      console.log('❌ No owners found in the database');
      return;
    }

    owners.forEach((owner, index) => {
      console.log(`${index + 1}. ${owner.name || 'No Name'} (${owner.email})`);
      console.log(`   Business: ${owner.businessName || 'Not set'}`);
      console.log(`   Events: ${owner._count.ownedEvents}`);
      console.log(`   Active: ${owner.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${owner.createdAt.toLocaleDateString()}`);
      console.log(`   ID: ${owner.id}`);
      console.log('');
    });

    // Also check for ADMIN users
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isActive: true,
      },
    });

    console.log(`👑 Found ${admins.length} admins:`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name || 'No Name'} (${admin.email})`);
      console.log(`   Active: ${admin.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
      console.log(`   ID: ${admin.id}`);
      console.log('');
    });

    // Check total events
    const totalEvents = await prisma.event.count({
      where: { deletedAt: null },
    });

    console.log(`📈 Database Statistics:`);
    console.log(`   Total Events: ${totalEvents}`);
    console.log(`   Total Owners: ${owners.length}`);
    console.log(`   Total Admins: ${admins.length}`);
  } catch (error) {
    console.error('❌ Error checking owners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOwners().catch(console.error);
