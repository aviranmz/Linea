import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJson } from '../lib/api'

interface NearbyEvent {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  startDate: string
  endDate?: string
  status: string
  capacity?: number
  featured: boolean
  owner?: {
    id: string
    name: string
    email: string
    businessName?: string
  }
  venue?: {
    id: string
    name: string
    address: string
    city: string
    country: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color: string
    icon: string
  }
  _count?: {
    waitlist: number
  }
}

interface NearbyEventsProps {
  eventSlug: string
  limit?: number
  showTitle?: boolean
}

export function NearbyEvents({ eventSlug, limit = 5, showTitle = true }: NearbyEventsProps) {
  const [nearbyEvents, setNearbyEvents] = useState<NearbyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNearbyEvents = async () => {
      try {
        const data = await getJson<{ nearbyEvents: NearbyEvent[] }>(`/api/events/${eventSlug}/nearby?limit=${limit}`)
        setNearbyEvents(data.nearbyEvents || [])
      } catch (err) {
        console.error('Failed to load nearby events:', err)
        setError('Failed to load nearby events')
      } finally {
        setLoading(false)
      }
    }

    if (eventSlug) {
      loadNearbyEvents()
    }
  }, [eventSlug, limit])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {showTitle && (
          <h3 className="heading-4 mb-4">Nearby Events</h3>
        )}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || nearbyEvents.length === 0) {
    return null // Don't show anything if there are no nearby events or error
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {showTitle && (
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2 text-gray-400">Nearby</span>
          <h3 className="heading-4">Nearby Events</h3>
        </div>
      )}
      
      <div className="space-y-4">
        {nearbyEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label={`View event ${event.title}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm hover:text-accent-600 transition-colors">
                {event.title}
              </h4>
              {event.featured && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {event.shortDescription || event.description || 'Join us for an amazing event!'}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                {event.venue && (
                  <span className="flex items-center">
                    {event.venue.city}
                  </span>
                )}
                <span className="flex items-center">
                  {formatDate(event.startDate)}
                </span>
              </div>
              
              {event.category && (
                <span 
                  className="px-2 py-1 rounded-full text-xs"
                  style={{ 
                    backgroundColor: `${event.category.color}20`,
                    color: event.category.color
                  }}
                >
                  {event.category.icon} {event.category.name}
                </span>
              )}
            </div>

            {event.owner && (
              <div className="text-xs text-gray-500 mt-2">
                By: {event.owner.businessName || event.owner.name}
              </div>
            )}

            {event._count && event._count.waitlist > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {event._count.waitlist} people interested
              </div>
            )}
          </Link>
        ))}
      </div>

      {nearbyEvents.length === limit && (
        <div className="mt-4 text-center">
          <Link 
            to="/events"
            className="text-sm text-accent-600 hover:text-accent-700 transition-colors"
          >
            View all events →
          </Link>
        </div>
      )}
    </div>
  )
}
