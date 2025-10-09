#!/bin/sh

# Script to run the metadata column fix from the correct directory
# This ensures @prisma/client is available

echo "🔧 Running metadata column fix from API directory..."

# Change to the API directory where Prisma is installed
cd /app/apps/api

# Create a simple script to add the metadata column
cat > add-metadata.js << 'EOF'
const { PrismaClient } = require('@prisma/client');

async function addMetadataColumn() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding metadata column to WaitlistEntry table...');
    
    await prisma.$executeRaw`
      ALTER TABLE waitlist_entries 
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `;
    
    console.log('✅ Successfully added metadata column to WaitlistEntry table');
    
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist_entries' 
      AND column_name = 'metadata';
    `;
    
    console.log('📋 Column verification:', result);
    
  } catch (error) {
    console.error('❌ Error adding metadata column:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addMetadataColumn();
EOF

# Run the script
node add-metadata.js

# Clean up
rm add-metadata.js

echo "✅ Metadata column fix completed!"
