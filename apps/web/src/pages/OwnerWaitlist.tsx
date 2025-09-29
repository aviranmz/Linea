import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJson, postJson } from '../lib/api'

interface WaitlistEntry {
  id: string
  email: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
  position: number
  user?: {
    id: string
    name: string
    businessName?: string
  }
}

interface Event {
  id: string
  title: string
  slug: string
  capacity?: number
  currentWaitlist: number
  startDate: string
}

export default function OwnerWaitlist() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string } } | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }))
  }, [])

  const requestMagic = async (e: React.FormEvent) => {
    e.preventDefault()
    await postJson('/auth/request-magic-link', { email: loginEmail })
    alert('Magic link sent if the email exists. Check your inbox.')
  }

  useEffect(() => {
    if (auth?.authenticated) {
      const loadEvents = async () => {
        try {
          const data = await getJson<{ events: Event[] }>('/api/owner/events')
          setEvents(data.events || [])
          if (data.events && data.events.length > 0) {
            setSelectedEvent(data.events[0])
          }
        } catch (error) {
          console.error('Failed to load events:', error)
        } finally {
          setLoading(false)
        }
      }
      loadEvents()
    } else {
      setLoading(false)
    }
  }, [auth])

  useEffect(() => {
    if (selectedEvent) {
      loadWaitlist()
    }
  }, [selectedEvent])

  const loadWaitlist = async () => {
    if (!selectedEvent) return
    
    setWaitlistLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.status) params.set('status', filters.status)
      params.set('sortBy', filters.sortBy)
      params.set('sortOrder', filters.sortOrder)
      
      const data = await getJson<{ entries: WaitlistEntry[] }>(`/api/owner/events/${selectedEvent.id}/waitlist?${params}`)
      setWaitlistEntries(data.entries || [])
    } catch (error) {
      console.error('Failed to load waitlist:', error)
      setMessage('Failed to load waitlist entries')
    } finally {
      setWaitlistLoading(false)
    }
  }

  const updateWaitlistStatus = async (entryId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') => {
    try {
      await postJson(`/api/owner/waitlist/${entryId}/status`, { status })
      setMessage(`Waitlist entry ${status.toLowerCase()} successfully`)
      loadWaitlist() // Reload to get updated data
    } catch (error) {
      console.error('Failed to update waitlist status:', error)
      setMessage('Failed to update waitlist status')
    }
  }

  const exportWaitlist = async () => {
    if (!selectedEvent) return
    
    try {
      const response = await fetch(`/api/owner/events/${selectedEvent.id}/waitlist/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `waitlist-${selectedEvent.slug}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setMessage('Waitlist exported successfully')
      } else {
        setMessage('Failed to export waitlist')
      }
    } catch (error) {
      console.error('Failed to export waitlist:', error)
      setMessage('Failed to export waitlist')
    }
  }

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', sortBy: 'createdAt', sortOrder: 'desc' })
  }

  if (!auth?.authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="heading-2 mb-4">Owner Login</h1>
        <p className="text-body mb-6">
          Please log in to access the waitlist management.
        </p>
        <form onSubmit={requestMagic} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input w-full"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Request Magic Link
          </button>
        </form>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-2">Waitlist Management</h1>
        <Link to="/owner" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className="bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg mb-6" role="alert">
          {message}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">Create your first event to start managing waitlists.</p>
          <Link to="/owner" className="btn btn-primary">
            Create Event
          </Link>
        </div>
      ) : (
        <>
          {/* Event Selection */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
            <h2 className="heading-4 mb-4">Select Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedEvent?.id === event.id
                      ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-accent-300'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
                    <p>👥 {event.currentWaitlist} on waitlist</p>
                    {event.capacity && <p>🎫 Capacity: {event.capacity}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedEvent && (
            <>
              {/* Waitlist Filters */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-4">Waitlist for "{selectedEvent.title}"</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={exportWaitlist}
                      className="btn btn-outline btn-sm"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={loadWaitlist}
                      className="btn btn-outline btn-sm"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Search by email..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      className="input w-full"
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="input w-full"
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-')
                        setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }))
                      }}
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="email-asc">Email A-Z</option>
                      <option value="email-desc">Email Z-A</option>
                      <option value="position-asc">Position (Low to High)</option>
                      <option value="position-desc">Position (High to Low)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {waitlistEntries.length} entries
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-outline btn-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Waitlist Entries */}
              {waitlistLoading ? (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : waitlistEntries.length > 0 ? (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                      <thead className="bg-neutral-50 dark:bg-neutral-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                        {waitlistEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              #{entry.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {entry.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                entry.status === 'CONFIRMED' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : entry.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {entry.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {entry.status !== 'CONFIRMED' && (
                                  <button
                                    onClick={() => updateWaitlistStatus(entry.id, 'CONFIRMED')}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {entry.status !== 'CANCELLED' && (
                                  <button
                                    onClick={() => updateWaitlistStatus(entry.id, 'CANCELLED')}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    Cancel
                                  </button>
                                )}
                                {entry.status !== 'PENDING' && (
                                  <button
                                    onClick={() => updateWaitlistStatus(entry.id, 'PENDING')}
                                    className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No waitlist entries</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No one has joined the waitlist for this event yet.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}