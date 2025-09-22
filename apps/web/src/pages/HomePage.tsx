import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDate: string
  status: string
}

export function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch events from API
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="heading-1">
                  <span className="block xl:inline">Discover</span>{' '}
                  <span className="block milano-accent xl:inline">
                    Extraordinary Events
                  </span>
                </h1>
                <p className="mt-6 text-body sm:mt-8 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0">
                  Join exclusive events through our innovative waitlist platform. 
                  Experience the future of event management with Milano-inspired design and email-only access.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-lg shadow-milano">
                    <Link
                      to="#events"
                      className="btn btn-primary px-8 py-3 text-base font-medium transform hover:scale-105 md:py-4 md:text-lg md:px-10"
                    >
                      Explore Events
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/owner"
                      className="btn btn-outline px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10"
                    >
                      Create Event
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Milano-inspired background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-accent-400/20 to-milano-terracotta/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-milano-sage/20 to-accent-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Events Section */}
      <div id="events" className="section bg-white dark:bg-neutral-900">
        <div className="container">
          <div className="text-center">
            <h2 className="heading-2">
              Featured Events
            </h2>
            <p className="mt-4 text-body text-lg">
              Discover amazing events happening around you
            </p>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="h-48 bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="card overflow-hidden hover:shadow-milano-lg transition-all duration-300 group">
                    <div className="h-48 bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="text-white text-center relative z-10">
                        <div className="text-4xl font-display font-bold mb-2">
                          {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-semibold">
                          {new Date(event.startDate).getDate()}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="heading-4 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-body text-sm mb-4">
                        {event.description || 'Join us for an amazing event!'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-caption">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <Link
                          to={`/events/${event.slug}`}
                          className="btn btn-outline text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-neutral-400 dark:text-neutral-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="heading-4 mb-2">No events yet</h3>
                  <p className="text-body">Check back soon for exciting events!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="section bg-neutral-50 dark:bg-neutral-800">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Why Choose Linea?
            </h2>
            <p className="text-body text-lg">
              Simple, secure, and designed for the modern event-goer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/20 dark:to-accent-800/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="heading-4 mb-2">
                Email-Only Access
              </h3>
              <p className="text-body">
                No passwords needed. Just your email address to access exclusive events.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-milano-sage/20 to-milano-sage/30 dark:from-milano-sage/20 dark:to-milano-sage/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="heading-4 mb-2">
                Waitlist Management
              </h3>
              <p className="text-body">
                Join waitlists for sold-out events and get notified when spots open up.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-milano-terracotta/20 to-milano-terracotta/30 dark:from-milano-terracotta/20 dark:to-milano-terracotta/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="heading-4 mb-2">
                Nearby Discoveries
              </h3>
              <p className="text-body">
                Find restaurants, museums, and attractions near your events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-700 dark:to-accent-800">
        <div className="container py-12 lg:py-16 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to create your event?</span>
            <span className="block text-accent-200">Start building your community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-lg shadow-milano">
              <Link
                to="/owner"
                className="btn btn-secondary px-5 py-3 text-base font-medium"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-lg shadow-milano">
              <Link
                to="#events"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-accent-600 px-5 py-3 text-base font-medium"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
