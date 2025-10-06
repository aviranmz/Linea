import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '../lib/googleMaps'
import { getEventAddress, geocodeAddress } from '../lib/geocoding'
import { Event } from '../types/Event'

interface InteractiveMapViewProps {
  events: Event[]
}

declare global {
  // Provide minimal google type for eslint/ts in this file
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace google { namespace maps { class Map {}; class Marker { setMap(_: any): void {} addListener(_: string, __: () => void): void {} }; class LatLngBounds { extend(_: any): void {}; isEmpty(): boolean { return true } }; class InfoWindow { constructor(_: any) {}; open(_: any): void {} } } }
}

export function InteractiveMapView({ events }: InteractiveMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let map: google.maps.Map | null = null
    let markers: google.maps.Marker[] = []

    loadGoogleMaps(['places'])
      .then((google) => {
        if (!containerRef.current) return

        const defaultCenter = { lat: 45.4642, lng: 9.1900 } // Milano

        map = new google.maps.Map(containerRef.current, {
          center: defaultCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        })

        // Fit bounds to event markers if any have coordinates
        const bounds = new google.maps.LatLngBounds()

        const addMarker = (evt: Event, position: { lat: number; lng: number }) => {
          const marker = new google.maps.Marker({ position, map, title: evt.title })
          const info = new google.maps.InfoWindow({
            content: `<div style="max-width:220px">\n              <div style="font-weight:600;margin-bottom:4px">${evt.title}</div>\n              ${evt.venue ? `<div style="color:#4b5563">${evt.venue.city}, ${evt.venue.country}</div>` : ''}\n              <div style="margin-top:6px"><a href="/events/${evt.id}" style="color:#4f46e5;text-decoration:underline">View</a></div>\n            </div>`
          })
          marker.addListener('click', () => info.open({ map, anchor: marker }))
          markers.push(marker)
          bounds.extend(position)
        }

        const tasks = events.map(async (evt) => {
          const lat = evt.venue?.latitude ?? evt.mapLat
          const lng = evt.venue?.longitude ?? evt.mapLng
          if (lat != null && lng != null) {
            addMarker(evt, { lat: Number(lat), lng: Number(lng) })
            return
          }
          const address = getEventAddress(evt)
          if (!address) return
          const result = await geocodeAddress(address)
          if (result) addMarker(evt, result)
        })

        Promise.allSettled(tasks).then(() => {
          if (!bounds.isEmpty()) {
            map!.fitBounds(bounds)
          }
        })
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed loading map')
      })

    return () => {
      // Cleanup markers
      markers.forEach(m => m.setMap(null))
      markers = []
      map = null
    }
  }, [events])

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center text-sm text-red-600 border rounded-lg">
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className="h-72 sm:h-80 md:h-96 w-full" />
}


