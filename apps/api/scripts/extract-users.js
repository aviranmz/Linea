#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

async function extractUsers() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Connecting to production database...');

    // Get all users with admin role
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        deletedAt: null,
        isActive: true,
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

    // Get all users (for overview)
    const allUsers = await prisma.user.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get email verifications (magic links)
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

    console.log('\n📊 DATABASE SUMMARY:');
    console.log(`Total Users: ${allUsers.length}`);
    console.log(`Admin Users: ${adminUsers.length}`);
    console.log(`Email Verifications: ${emailVerifications.length}`);

    console.log('\n👑 ADMIN USERS:');
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

    console.log('\n🔗 MAGIC LINKS (Email Verifications):');
    emailVerifications.forEach((verification, index) => {
      console.log(
        `\n${index + 1}. ${verification.user.name || 'No Name'} (${verification.user.email})`
      );
      console.log(`   Token: ${verification.token}`);
      console.log(`   Expires: ${verification.expiresAt.toISOString()}`);
      console.log(
        `   Verified: ${verification.verifiedAt ? verification.verifiedAt.toISOString() : 'Not verified'}`
      );
      console.log(
        `   Status: ${verification.verifiedAt ? '✅ Verified' : '⏳ Pending'}`
      );
    });

    console.log('\n📋 ALL USERS (Recent):');
    allUsers.slice(0, 10).forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name || 'No Name'} (${user.email}) - ${user.role}`
      );
    });

    if (allUsers.length > 10) {
      console.log(`... and ${allUsers.length - 10} more users`);
    }
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.error('Make sure DATABASE_URL is set correctly');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

extractUsers();
