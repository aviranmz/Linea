#!/bin/bash

# Railway Production Reseed Script
# This script wipes and reseeds the production database

echo "🚨 WARNING: This will wipe the production database!"
echo "📊 Database URL: $DATABASE_URL"
echo ""

# Build the API first
echo "🔨 Building API..."
cd /app/apps/api
pnpm build

# Run the reseed script
echo "🗑️  Wiping and reseeding database..."
cd /app
node scripts/production-reseed.js

echo "✅ Production reseed complete!"
