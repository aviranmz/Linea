import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  startDate: string
  endDate?: string
  status: string
  capacity?: number
  youtubeUrl?: string
  metadata?: {
    productName?: string | null
    heroImageUrl?: string | null
    longDescription?: string | null
    valueProposition?: string | null
    features?: string[]
    awards?: string[]
    social?: Record<string,string> | null
    videoUrl?: string | null
    pressKitUrl?: string | null
    contact?: { email?: string; phone?: string; whatsapp?: string; telegram?: string } | null
    schedule?: Array<{ title: string; startsAt: string; endsAt?: string }>
    qrUrl?: string | null
  }
  venue?: {
    id: string
    name: string
    address: string
    city: string
    country: string
    latitude?: number
    longitude?: number
  }
  owner?: {
    id: string
    name: string
    email: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color: string
    icon: string
  }
  shows?: Array<{
    id: string
    title: string
    description?: string
    startDate: string
    endDate?: string
    youtubeUrl?: string
  }>
  nearbyPlaces?: Array<{
    id: string
    name: string
    address: string
    category: string
    distance?: number
    website?: string
  }>
  _count?: {
    waitlist: number
  }
}

export function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (slug) {
      fetch(`/api/events/${slug}`)
        .then(res => res.json())
        .then(data => {
          setEvent(data.event)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [slug])

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event || !email) return

    setIsJoining(true)
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          eventId: event.id,
        }),
      })

      if (response.ok) {
        setJoined(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error)
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
        <p className="text-gray-600">The event you're looking for doesn't exist.</p>
      </div>
    )
  }

  // Generate JSON-LD structured data
  const generateJsonLd = () => {
    if (!event) return null
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.description || event.shortDescription,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.status === 'PUBLISHED' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventPostponed',
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      url: `${window.location.origin}/events/${event.slug}`,
      ...(event.venue && {
        location: {
          "@type": "Place",
          name: event.venue.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.venue.address,
            addressLocality: event.venue.city,
            addressCountry: event.venue.country
          },
          ...(event.venue.latitude && event.venue.longitude && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.venue.latitude,
              longitude: event.venue.longitude
            }
          })
        }
      }),
      ...(event.owner && {
        organizer: {
          "@type": "Organization",
          name: event.owner.name,
          email: event.owner.email
        }
      }),
      ...(event.capacity && {
        maximumAttendeeCapacity: event.capacity
      }),
      offers: {
        "@type": "Offer",
        url: `${window.location.origin}/events/${event.slug}`,
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString()
      }
    }
    
    return JSON.stringify(jsonLd)
  }

  const pageTitle = event ? `${event.title} | Linea Events` : 'Event | Linea Events'
  const pageDescription = event ? (event.shortDescription || event.description?.substring(0, 160) + '...' || 'Join us for an amazing event!') : 'Event details and registration'
  const pageUrl = `${window.location.origin}/events/${slug}`
  const eventImage = event?.metadata?.heroImageUrl || `${window.location.origin}/og-event-${slug}.jpg`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="event" />
        <meta property="og:image" content={eventImage} />
        <meta property="og:site_name" content="Linea Events" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={eventImage} />
        
        {/* Event specific meta tags */}
        {event && (
          <>
            <meta property="event:start_time" content={event.startDate} />
            {event.endDate && <meta property="event:end_time" content={event.endDate} />}
            {event.venue && (
              <>
                <meta property="event:location:name" content={event.venue.name} />
                <meta property="event:location:address" content={`${event.venue.address}, ${event.venue.city}, ${event.venue.country}`} />
                {event.venue.latitude && <meta property="event:location:latitude" content={event.venue.latitude.toString()} />}
                {event.venue.longitude && <meta property="event:location:longitude" content={event.venue.longitude.toString()} />}
              </>
            )}
          </>
        )}
        
        {/* JSON-LD Structured Data */}
        {event && (
          <script type="application/ld+json">
            {generateJsonLd()}
          </script>
        )}
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Event Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.startDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          {event.endDate && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ends: {new Date(event.endDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
          {event.capacity && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Capacity: {event.capacity}
            </div>
          )}
        </div>
      </div>

      {/* Hero Product */}
      {event.metadata?.heroImageUrl && (
        <div className="mb-8">
          <img src={event.metadata.heroImageUrl} alt={event.metadata?.productName || event.title} className="w-full rounded-xl border border-gray-200" />
        </div>
      )}

      {/* Product Summary */}
      {(event.metadata?.productName || event.metadata?.valueProposition) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{event.metadata?.productName || 'Product'}</h2>
          {event.metadata?.valueProposition && (
            <p className="text-gray-700">{event.metadata.valueProposition}</p>
          )}
        </div>
      )}

      {/* Event Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {event.metadata?.longDescription || event.description || 'Join us for an amazing event! More details coming soon.'}
          </p>
        </div>
      </div>

      {/* Features & Awards */}
      {(event.metadata?.features?.length || event.metadata?.awards?.length) && (
        <div className="mb-8 grid md:grid-cols-2 gap-6">
          {event.metadata?.features && event.metadata.features.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {event.metadata.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {event.metadata?.awards && event.metadata.awards.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Awards</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {event.metadata.awards.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Product Video */}
      {(event.metadata?.videoUrl || event.youtubeUrl) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Video</h2>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={event.metadata?.videoUrl || event.youtubeUrl!}
              title={event.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Press & Socials */}
      {(event.metadata?.pressKitUrl || event.metadata?.social) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Press & Social</h2>
          <div className="flex flex-wrap gap-3">
            {event.metadata?.pressKitUrl && (
              <a href={event.metadata.pressKitUrl} className="btn btn-outline" target="_blank" rel="noreferrer">Download Press Kit</a>
            )}
            {event.metadata?.social && Object.entries(event.metadata.social).map(([k, v]) => v ? (
              <a key={k} href={v as string} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 underline capitalize">{k}</a>
            ) : null)}
          </div>
        </div>
      )}

      {/* Contact & QR */}
      {(event.metadata?.contact || event.metadata?.qrUrl) && (
        <div className="mb-8 grid md:grid-cols-2 gap-6">
          {event.metadata?.contact && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <div className="space-y-1 text-gray-700">
                {event.metadata.contact.email && <div>Email: <a className="text-indigo-600" href={`mailto:${event.metadata.contact.email}`}>{event.metadata.contact.email}</a></div>}
                {event.metadata.contact.phone && <div>Phone: <a className="text-indigo-600" href={`tel:${event.metadata.contact.phone}`}>{event.metadata.contact.phone}</a></div>}
                {event.metadata.contact.whatsapp && <div>WhatsApp: <a className="text-indigo-600" href={event.metadata.contact.whatsapp}>Open</a></div>}
                {event.metadata.contact.telegram && <div>Telegram: <a className="text-indigo-600" href={event.metadata.contact.telegram}>Open</a></div>}
              </div>
            </div>
          )}
          {event.metadata?.qrUrl && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center">
              <img src={event.metadata.qrUrl} alt="QR" className="max-h-48" />
            </div>
          )}
        </div>
      )}

      {/* Waitlist Form */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join the Waitlist</h2>
        <p className="text-gray-600 mb-6">
          Enter your email to join the waitlist for this event. You'll be notified when spots become available.
        </p>
        
        {joined ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green-800">Successfully joined the waitlist!</h3>
                <p className="text-sm text-green-700 mt-1">We'll notify you when spots become available.</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isJoining}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isJoining ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        )}
      </div>

      {/* Venue Information */}
      {event.venue && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Venue</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{event.venue.name}</h3>
            <p className="text-gray-600 mb-4">
              {event.venue.address}, {event.venue.city}, {event.venue.country}
            </p>
            {event.venue.latitude && event.venue.longitude && (
              <a
                href={`https://maps.google.com/?q=${event.venue.latitude},${event.venue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Google Maps
              </a>
            )}
          </div>
        </div>
      )}

      {/* Shows */}
      {event.shows && event.shows.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shows</h2>
          <div className="grid gap-4">
            {event.shows.map((show) => (
              <div key={show.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{show.title}</h3>
                {show.description && (
                  <p className="text-gray-600 mb-3">{show.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(show.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {show.endDate && (
                    <span className="ml-4">
                      - {new Date(show.endDate).toLocaleDateString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                {show.youtubeUrl && (
                  <div className="mt-4 aspect-video bg-gray-100 rounded overflow-hidden">
                    <iframe
                      src={show.youtubeUrl}
                      title={show.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Places */}
      {event.nearbyPlaces && event.nearbyPlaces.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nearby Places</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {event.nearbyPlaces.slice(0, 6).map((place) => (
              <div key={place.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{place.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{place.address}</p>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {place.category}
                      </span>
                      {place.distance && (
                        <span className="ml-2 text-xs text-gray-500">
                          {Math.round(place.distance)}m away
                        </span>
                      )}
                    </div>
                  </div>
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
}
