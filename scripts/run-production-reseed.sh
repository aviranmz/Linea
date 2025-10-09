#!/bin/bash

# Production Reseed Script
# This script runs the reseed from the correct directory

echo "🚨 WARNING: This will wipe the production database!"
echo "📊 Database URL: $DATABASE_URL"
echo ""

# Navigate to the API directory where Prisma is set up
cd /Users/aviranmizrahi/Workspace/Linea/apps/api

# Build the API first
echo "🔨 Building API..."
pnpm build

# Run the seed script directly
echo "🗑️  Wiping and reseeding database..."
node dist/seed.js

echo "✅ Production reseed complete!"
