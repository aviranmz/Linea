type LatLng = { lat: number; lng: number }

const cache = new Map<string, LatLng>()

function buildAddress(parts: Array<string | undefined | null>): string | null {
  const value = parts.filter(Boolean).join(', ')
  return value.length > 0 ? value : null
}

export function getEventAddress(event: any): string | null {
  // Prefer explicit mapAddress, otherwise compose from venue
  return (
    event?.mapAddress ||
    buildAddress([
      event?.venue?.address,
      event?.venue?.city,
      event?.venue?.country
    ])
  )
}

export async function geocodeAddress(address: string): Promise<LatLng | null> {
  if (!address) return null
  if (cache.has(address)) return cache.get(address) as LatLng

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (!apiKey) return null

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.set('address', address)
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) return null
  const data = await res.json()
  const loc = data?.results?.[0]?.geometry?.location
  if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
    const value = { lat: loc.lat, lng: loc.lng }
    cache.set(address, value)
    return value
  }
  return null
}


