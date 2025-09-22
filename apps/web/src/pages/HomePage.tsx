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
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Discover</span>{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 xl:inline">
                    Extraordinary Events
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Join exclusive events through our innovative waitlist platform. 
                  Experience the future of event management with email-only access.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="#events"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 md:py-4 md:text-lg md:px-10"
                    >
                      Explore Events
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/owner"
                      className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                    >
                      Create Event
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Events Section */}
      <div id="events" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Events
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover amazing events happening around you
            </p>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl font-bold mb-2">
                          {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-semibold">
                          {new Date(event.startDate).getDate()}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {event.description || 'Join us for an amazing event!'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <Link
                          to={`/events/${event.slug}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-500">Check back soon for exciting events!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Linea?
            </h2>
            <p className="text-lg text-gray-600">
              Simple, secure, and designed for the modern event-goer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email-Only Access
              </h3>
              <p className="text-gray-600">
                No passwords needed. Just your email address to access exclusive events.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Waitlist Management
              </h3>
              <p className="text-gray-600">
                Join waitlists for sold-out events and get notified when spots open up.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nearby Discoveries
              </h3>
              <p className="text-gray-600">
                Find restaurants, museums, and attractions near your events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to create your event?</span>
            <span className="block text-indigo-200">Start building your community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/owner"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="#events"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition-colors duration-200"
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
