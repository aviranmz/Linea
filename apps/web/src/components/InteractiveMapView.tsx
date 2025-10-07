import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../lib/googleMaps';

// Minimal types to satisfy TS for this file
type GMap = any;
type GMarker = any;
import { getEventAddress, geocodeAddress } from '../lib/geocoding';
import { Event } from '../types/Event';

interface InteractiveMapViewProps {
  events: Event[];
}

export function InteractiveMapView({ events }: InteractiveMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let map: GMap | null = null;
    let markers: GMarker[] = [];

    loadGoogleMaps(['places'])
      .then(() => {
        if (!containerRef.current) return;

        const defaultCenter = { lat: 45.4642, lng: 9.19 }; // Milano

        map = new (window as any).google.maps.Map(containerRef.current, {
          center: defaultCenter,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        // Fit bounds to event markers if any have coordinates
        const bounds = new (window as any).google.maps.LatLngBounds();

        const addMarker = (
          evt: Event,
          position: { lat: number; lng: number }
        ) => {
          // Apply tiny jitter when multiple events share identical coordinates
          // to avoid exact marker overlap on the map
          const jitterSeed =
            Math.abs([...evt.id].reduce((a, c) => a + c.charCodeAt(0), 0)) %
            360;
          const radians = (jitterSeed / 360) * Math.PI * 2;
          const radiusMeters = 12; // ~12m fan-out
          const metersToDegLat = 1 / 111320; // ~ meters per degree latitude
          const metersToDegLng =
            1 / (111320 * Math.cos((position.lat * Math.PI) / 180));
          const jitter = {
            lat:
              position.lat + Math.sin(radians) * radiusMeters * metersToDegLat,
            lng:
              position.lng + Math.cos(radians) * radiusMeters * metersToDegLng,
          };
          const jittered = { lat: jitter.lat, lng: jitter.lng };
          const marker = new (window as any).google.maps.Marker({
            position: jittered,
            map,
            title: evt.title,
          });
          const info = new (window as any).google.maps.InfoWindow({
            content: `<div style="max-width:220px">\n              <div style="font-weight:600;margin-bottom:4px">${evt.title}</div>\n              ${evt.venue ? `<div style="color:#4b5563">${evt.venue.city}, ${evt.venue.country}</div>` : ''}\n              <div style="margin-top:6px"><a href="/events/${evt.id}" style="color:#4f46e5;text-decoration:underline">View</a></div>\n            </div>`,
          });
          marker.addListener('click', () => info.open({ map, anchor: marker }));
          markers.push(marker);
          bounds.extend(jittered);
        };

        const tasks = events.map(async evt => {
          const lat = evt.venue?.latitude ?? evt.mapLat;
          const lng = evt.venue?.longitude ?? evt.mapLng;
          if (lat != null && lng != null) {
            addMarker(evt, { lat: Number(lat), lng: Number(lng) });
            return;
          }
          const address = getEventAddress(evt);
          if (!address) return;
          const result = await geocodeAddress(address);
          if (result) addMarker(evt, result);
        });

        Promise.allSettled(tasks).then(() => {
          if (!bounds.isEmpty()) {
            map!.fitBounds(bounds);
          }
        });
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed loading map');
      });

    return () => {
      // Cleanup markers
      markers.forEach(m => m.setMap(null));
      markers = [];
      map = null;
    };
  }, [events]);

  if (error) {
    return (
      <div className='h-96 flex items-center justify-center text-sm text-red-600 border rounded-lg'>
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className='h-72 sm:h-80 md:h-96 w-full' />;
}
