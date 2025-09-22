import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDate: string
  status: string
  capacity?: number
}

export function OwnerPortal() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    capacity: ''
  })

  useEffect(() => {
    // In a real app, this would fetch user's events
    // For now, we'll use the mock data
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create the event
    console.log('Creating event:', newEvent)
    setShowCreateForm(false)
    setNewEvent({ title: '', description: '', startDate: '', capacity: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Owner Portal</h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage your events and track waitlist performance
        </p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Create New Event
        </button>
      </div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="event-start-date"
                  type="datetime-local"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="event-capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (optional)
                </label>
                <input
                  id="event-capacity"
                  type="number"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Events</h2>
        </div>
        
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : events.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: <span className="capitalize">{event.status.toLowerCase()}</span>
                      {event.capacity && ` • Capacity: ${event.capacity}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/events/${event.slug}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500 mb-4">Create your first event to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-indigo-600">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Waitlist</h3>
          <p className="text-3xl font-bold text-purple-600">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-green-600">12.5%</p>
        </div>
      </div>
    </div>
  )
}
