// Lightweight Google Maps loader usable in browser and during TS builds

// Minimal ambient types to satisfy TS during build; real types provided by runtime JS API
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace google { namespace maps {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class Map { constructor(element: HTMLElement, options?: Record<string, unknown>); fitBounds(bounds: LatLngBounds): void }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class Marker { constructor(options: Record<string, unknown>); setMap(map: Map | null): void; addListener(eventName: string, handler: () => void): void }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class LatLngBounds { extend(position: { lat: number; lng: number }): void; isEmpty(): boolean }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class InfoWindow { constructor(options?: Record<string, unknown>); open(opts: { map: Map | null; anchor: Marker }): void }
}} 

type GoogleNamespace = typeof window & { google: typeof google }

let mapsPromise: Promise<typeof google> | null = null

export function loadGoogleMaps(libraries: string[] = []): Promise<typeof google> {
  if (typeof window === 'undefined') {
    // SSR/Build time: provide a minimal shim object so types are satisfied
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shim: any = {
      maps: {
        Map: class { fitBounds() {} },
        Marker: class { setMap() {} addListener() {} },
        LatLngBounds: class { extend() {} isEmpty() { return true } },
        InfoWindow: class { open() {} }
      }
    }
    // @ts-ignore
    return Promise.resolve(shim)
  }

  if ((window as GoogleNamespace).google && (window as GoogleNamespace).google.maps) {
    return Promise.resolve((window as GoogleNamespace).google)
  }

  if (mapsPromise) return mapsPromise

  // Prefer runtime-injected key if available (window.__ENV__), then Vite build-time env
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runtimeEnv = (window as any).__ENV__
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiKey = (runtimeEnv?.VITE_GOOGLE_MAPS_API_KEY) || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''
  const params = new URLSearchParams()
  if (apiKey) params.set('key', apiKey)
  if (libraries.length) params.set('libraries', libraries.join(','))
  params.set('v', 'weekly')

  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`
    script.onload = () => {
      if ((window as GoogleNamespace).google) {
        resolve((window as GoogleNamespace).google)
      } else {
        reject(new Error('Google Maps failed to load'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })

  return mapsPromise
}


