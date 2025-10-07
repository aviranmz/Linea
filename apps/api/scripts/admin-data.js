#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getAdminData() {
  try {
    console.log('🔍 Fetching admin data from production database...');

    // Get admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        isActive: true,
      },
    });

    // Get email verifications for admin users
    const emailVerifications = await prisma.emailVerification.findMany({
      where: {
        user: {
          role: 'ADMIN',
        },
      },
      select: {
        id: true,
        email: true,
        token: true,
        expiresAt: true,
        verifiedAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get total user count
    const totalUsers = await prisma.user.count({
      where: {
        deletedAt: null,
      },
    });

    const result = {
      summary: {
        totalUsers,
        adminUsers: adminUsers.length,
        emailVerifications: emailVerifications.length,
      },
      adminUsers,
      emailVerifications,
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

getAdminData();
