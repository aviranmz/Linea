# Production Database Wipe & Reseed

## 🚨 WARNING
This process will **PERMANENTLY DELETE** all production data and replace it with fresh seed data.

## Methods to Reseed Production

### Method 1: Railway CLI (Recommended)
```bash
# Connect to Railway
railway login

# Link to your project
railway link

# Run the reseed script in production
railway run node scripts/production-reseed.js
```

### Method 2: Direct Database Connection
```bash
# Set environment variables
export DATABASE_URL="postgresql://postgres:HlFadiyJ1fTOuq6w@db.zygensgqotmlclleahas.supabase.co:5432/postgres"

# Run the reseed script
node scripts/production-reseed.js
```

### Method 3: Railway Shell Access
```bash
# Connect to Railway shell
railway shell

# Run the reseed script
node scripts/production-reseed.js
```

## What Gets Wiped
- All waitlist entries
- All events
- All venues
- All categories
- All products
- All areas
- All users (owners and visitors)

## What Gets Created
- 5 owners with comprehensive metadata
- 25 events (5 per owner) with comprehensive metadata
- 100 visitors with realistic emails
- Categories, products, areas, and venues
- QR codes for all events
- Proper relationships between all entities

## Safety Measures
- Script includes confirmation prompts
- Database connection is verified before wiping
- All operations are wrapped in try-catch blocks
- Prisma client is properly disconnected

## Rollback Plan
If something goes wrong:
1. The database will be empty
2. Re-run the seed script: `node scripts/production-reseed.js`
3. Or restore from backup if available

## Verification
After reseeding, verify:
- [ ] 5 owners created
- [ ] 25 events created (5 per owner)
- [ ] 100 visitors created
- [ ] All events have QR codes
- [ ] All events have addresses and show on maps
- [ ] All relationships are properly linked
