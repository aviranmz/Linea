#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function queryDatabase() {
  try {
    console.log('🔍 Connecting to production database...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');

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

    console.log(`\n👑 Found ${adminUsers.length} admin users:`);
    adminUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name || 'No Name'} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log(
        `   Last Login: ${user.lastLoginAt ? user.lastLoginAt.toISOString() : 'Never'}`
      );
      console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
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

    console.log(
      `\n🔗 Found ${emailVerifications.length} email verifications for admin users:`
    );
    emailVerifications.forEach((verification, index) => {
      console.log(
        `\n${index + 1}. ${verification.user.name || 'No Name'} (${verification.user.email})`
      );
      console.log(`   Token: ${verification.token}`);
      console.log(`   Created: ${verification.createdAt.toISOString()}`);
      console.log(`   Expires: ${verification.expiresAt.toISOString()}`);
      console.log(
        `   Verified: ${verification.verifiedAt ? verification.verifiedAt.toISOString() : 'Not verified'}`
      );
      console.log(
        `   Status: ${verification.verifiedAt ? '✅ Verified' : '⏳ Pending'}`
      );
    });

    // Get all users count
    const totalUsers = await prisma.user.count({
      where: {
        deletedAt: null,
      },
    });

    console.log(`\n📊 Database Summary:`);
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Admin Users: ${adminUsers.length}`);
    console.log(`   Email Verifications: ${emailVerifications.length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

queryDatabase();
