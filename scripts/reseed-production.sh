#!/bin/bash

# Production Database Reseed Script
# This script safely reseeds the production database with fresh data

set -e  # Exit on any error

echo "🌱 Production Database Reseed Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set your production database URL:"
    echo "export DATABASE_URL='your-production-database-url'"
    exit 1
fi

echo "📊 Current database state:"
echo "Database URL: ${DATABASE_URL:0:20}..."

# Confirm the operation
echo ""
echo "⚠️  WARNING: This will DELETE ALL DATA in the production database!"
echo "⚠️  Make sure you have backups if needed!"
echo ""
read -p "Are you absolutely sure you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ] && [ "$confirm" != "y" ]; then
    echo "❌ Operation cancelled by user"
    exit 0
fi

echo ""
echo "🧹 Step 1: Cleaning existing data..."
cd apps/api
npx prisma db push --force-reset
echo "✅ Database cleaned successfully"

echo ""
echo "🌱 Step 2: Running seed script..."
npx ts-node src/seed.ts
echo "✅ Seed script completed successfully"

echo ""
echo "🔍 Step 3: Verifying results..."
# Check if we have data
USER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"User\";" | grep -o '[0-9]\+' | head -1)
EVENT_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"Event\";" | grep -o '[0-9]\+' | head -1)

echo "📊 Database counts after reseed:"
echo "  Users: $USER_COUNT"
echo "  Events: $EVENT_COUNT"

if [ "$USER_COUNT" -gt 0 ] && [ "$EVENT_COUNT" -gt 0 ]; then
    echo ""
    echo "✅ Production database reseed completed successfully!"
    echo "🎉 The application should now be running with fresh data."
else
    echo ""
    echo "❌ Verification failed - insufficient data found"
    echo "Please check the database manually"
    exit 1
fi
