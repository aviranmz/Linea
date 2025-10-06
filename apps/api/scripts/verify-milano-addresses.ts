/*
  Audit and fix events/venues to ensure they are in Milano, Italy.
  - Verifies venue.city == 'Milano' and country == 'Italy'
  - Ensures coordinates fall within a safe Milano bounding box
  - For out-of-bounds/missing coords, snaps to Milano center

  Usage (from repo root):
  pnpm --filter api ts-node apps/api/scripts/verify-milano-addresses.ts
*/

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Rough Milano bounds (lat, lng) to catch outliers
const MILAN_BOUNDS = {
  minLat: 45.35,
  maxLat: 45.60,
  minLng: 9.00,
  maxLng: 9.40,
}

const MILAN_CENTER = { lat: 45.4642, lng: 9.1900 }

function isInMilanBounds(lat?: number | null, lng?: number | null): boolean {
  if (lat == null || lng == null) return false
  return (
    lat >= MILAN_BOUNDS.minLat &&
    lat <= MILAN_BOUNDS.maxLat &&
    lng >= MILAN_BOUNDS.minLng &&
    lng <= MILAN_BOUNDS.maxLng
  )
}

async function run() {
  let venueChecked = 0
  let venueUpdated = 0
  let eventChecked = 0
  let eventUpdated = 0

  console.log('🔎 Auditing venues...')
  const venues = await prisma.venue.findMany()
  for (const v of venues) {
    venueChecked++
    const needsCityFix = (v.city?.toLowerCase() !== 'milano') || (v.country?.toLowerCase() !== 'italy')
    const needsCoordFix = !isInMilanBounds(v.latitude ?? null, v.longitude ?? null)
    if (needsCityFix || needsCoordFix) {
      await prisma.venue.update({
        where: { id: v.id },
        data: {
          city: 'Milano',
          country: 'Italy',
          latitude: needsCoordFix ? MILAN_CENTER.lat : v.latitude,
          longitude: needsCoordFix ? MILAN_CENTER.lng : v.longitude,
        },
      })
      venueUpdated++
      console.log(`  ✅ Fixed venue: ${v.name}`)
    }
  }

  console.log('🔎 Auditing events...')
  const events = await prisma.event.findMany({ include: { venue: true } })
  for (const e of events) {
    eventChecked++
    const lat = e.mapLat ?? e.venue?.latitude ?? null
    const lng = e.mapLng ?? e.venue?.longitude ?? null
    const outOfBounds = !isInMilanBounds(lat, lng)
    const wrongCity = e.venue && (e.venue.city?.toLowerCase() !== 'milano' || e.venue.country?.toLowerCase() !== 'italy')
    if (outOfBounds || wrongCity) {
      await prisma.event.update({
        where: { id: e.id },
        data: {
          mapLat: MILAN_CENTER.lat,
          mapLng: MILAN_CENTER.lng,
          mapZoom: e.mapZoom ?? 12,
          mapAddress: e.mapAddress && e.mapAddress.toLowerCase().includes('milano')
            ? e.mapAddress
            : 'Milano, Italy',
        },
      })
      if (e.venue && wrongCity) {
        await prisma.venue.update({
          where: { id: e.venue.id },
          data: { city: 'Milano', country: 'Italy' },
        })
      }
      eventUpdated++
      console.log(`  ✅ Fixed event: ${e.title}`)
    }
  }

  console.log('— Summary —')
  console.log(`Venues checked: ${venueChecked}, updated: ${venueUpdated}`)
  console.log(`Events checked: ${eventChecked}, updated: ${eventUpdated}`)
}

run()
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


