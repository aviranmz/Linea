# Production Database Reseed Guide

This guide explains how to safely wipe and reseed the production database with fresh data.

## ⚠️ WARNING

**This operation will DELETE ALL EXISTING DATA in the production database!**

- Make sure you have backups if needed
- This is a destructive operation that cannot be undone
- Only run this on production when you're certain you want to replace all data

## Prerequisites

1. **Database Access**: Ensure you have access to the production database
2. **Environment Variables**: Set the `DATABASE_URL` environment variable
3. **Dependencies**: Ensure all dependencies are installed (`npm install`)

## Method 1: Automated Script (Recommended)

### Quick Reseed
```bash
# Set your production database URL
export DATABASE_URL="your-production-database-url"

# Run the automated script
./scripts/reseed-production.sh
```

### What the script does:
1. ✅ Checks prerequisites
2. ✅ Confirms the operation with user
3. ✅ Cleans existing data (force reset)
4. ✅ Runs the comprehensive seed script
5. ✅ Verifies the results
6. ✅ Reports success/failure

## Method 2: Manual Steps

If you prefer to run the steps manually:

### Step 1: Clean Database
```bash
cd apps/api
npx prisma db push --force-reset
```

### Step 2: Run Seed Script
```bash
npx ts-node src/seed.ts
```

### Step 3: Verify Results
```bash
# Check user count
npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"User\";"

# Check event count  
npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"Event\";"
```

## What Gets Created

The seed script creates:

### 👤 Users
- **1 Admin user**: `admin@linea.app`
- **5 Owner users**: Complete business profiles with contact info
- **100 Visitor users**: Realistic names and email addresses

### 🏢 Business Data
- **5 Categories**: Design, Fashion, Furniture, Textiles, Technology
- **5 Areas**: Brera, Navigli, Garibaldi, Porta Nuova, Quadrilatero
- **5 Products**: Furniture, Fashion, Textiles, Technology, Design
- **5 Venues**: Complete venue information with addresses

### 🎉 Events
- **5 Comprehensive events**: Full event details with:
  - Complete metadata (features, awards, social links)
  - Contact information
  - QR codes (auto-generated)
  - Waitlist entries
  - Proper associations with owners

### 📍 Location Data
- All events have proper addresses
- Google Maps integration ready
- Latitude/longitude coordinates

## Verification Checklist

After reseeding, verify:

- [ ] Admin can log in at `/admin`
- [ ] Owners can log in at `/owner` 
- [ ] Events are visible on homepage
- [ ] Event pages load correctly
- [ ] Maps show event locations
- [ ] QR codes are generated
- [ ] Waitlist functionality works
- [ ] Nearby events are shown

## Troubleshooting

### If the script fails:

1. **Check database connection**:
   ```bash
   npx prisma db push
   ```

2. **Check seed script**:
   ```bash
   cd apps/api
   npx ts-node src/seed.ts
   ```

3. **Manual verification**:
   ```bash
   npx prisma studio
   ```

### Common Issues:

- **Permission errors**: Ensure database user has full access
- **Connection timeouts**: Check network connectivity
- **Schema errors**: Run `npx prisma db push` first
- **Seed script errors**: Check console output for specific errors

## Rollback Plan

If something goes wrong:

1. **Restore from backup** (if available)
2. **Manual database reset**:
   ```bash
   npx prisma db push --force-reset
   ```
3. **Re-run seed script**:
   ```bash
   npx ts-node src/seed.ts
   ```

## Security Notes

- Never commit production database URLs to version control
- Use environment variables for sensitive data
- Consider using a staging environment first
- Always backup before major operations

## Support

If you encounter issues:

1. Check the console output for error messages
2. Verify your database connection
3. Ensure all dependencies are installed
4. Check the Prisma schema is up to date

---

**Remember**: This is a destructive operation. Only proceed if you're certain you want to replace all production data.
