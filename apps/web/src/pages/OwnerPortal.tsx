import React from 'react'
import { useState, useEffect } from 'react'
import { postJson, getJson, putJson, deleteJson } from '../lib/api'
import { Link } from 'react-router-dom'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDate: string
  status: string
  capacity?: number
  metadata?: Record<string, unknown>
}

export function OwnerPortal() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string }} | null>(null)
  const [loginEmail, setLoginEmail] = useState('')

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
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    capacity: '',
    shortDescription: '',
    productName: '',
    heroImageUrl: '',
    longDescription: '',
    valueProposition: '',
    features: '', // newline separated
    awards: '',   // newline separated
    socialInstagram: '',
    socialTiktok: '',
    socialFacebook: '',
    socialLinkedin: '',
    videoUrl: '',
    pressKitUrl: '',
    contactEmail: '',
    contactPhone: '',
    qrUrl: ''
  })
  const [editEvent, setEditEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: '',
    isPublic: false,
    featured: false
  })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getJson<{ events: Event[] }>('/api/owner/events')
        setEvents(data.events || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title: newEvent.title,
      description: newEvent.description || undefined,
      shortDescription: newEvent.shortDescription || undefined,
      startDate: newEvent.startDate,
      capacity: newEvent.capacity ? Number(newEvent.capacity) : undefined,
      isPublic: false,
      featured: false,
      tags: [] as string[],
      productName: newEvent.productName || undefined,
      heroImageUrl: newEvent.heroImageUrl || undefined,
      longDescription: newEvent.longDescription || undefined,
      valueProposition: newEvent.valueProposition || undefined,
      features: newEvent.features ? newEvent.features.split('\n').map(s=>s.trim()).filter(Boolean) : undefined,
      awards: newEvent.awards ? newEvent.awards.split('\n').map(s=>s.trim()).filter(Boolean) : undefined,
      social: {
        instagram: newEvent.socialInstagram || undefined,
        tiktok: newEvent.socialTiktok || undefined,
        facebook: newEvent.socialFacebook || undefined,
        linkedin: newEvent.socialLinkedin || undefined,
      },
      videoUrl: newEvent.videoUrl || undefined,
      pressKitUrl: newEvent.pressKitUrl || undefined,
      contact: {
        email: newEvent.contactEmail || undefined,
        phone: newEvent.contactPhone || undefined,
      },
      qrUrl: newEvent.qrUrl || undefined
    }
    try {
      const created = await postJson<{ event: Event }>('/api/owner/events', payload)
      if (created?.event) {
        setEvents(prev => [created.event, ...prev])
      }
      // Try to refresh list, but do not fail UX if it errors
      getJson<{ events: Event[] }>('/api/owner/events')
        .then(data => setEvents(data.events || []))
        .catch(() => {/* ignore transient refresh error */})
      setShowCreateForm(false)
      setNewEvent({
        title: '', description: '', startDate: '', capacity: '', shortDescription: '', productName: '', heroImageUrl: '', longDescription: '', valueProposition: '', features: '', awards: '', socialInstagram: '', socialTiktok: '', socialFacebook: '', socialLinkedin: '', videoUrl: '', pressKitUrl: '', contactEmail: '', contactPhone: '', qrUrl: ''
      })
    } catch (err) {
      console.error('Create event failed', err)
      alert('Failed to create event')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      await deleteJson(`/api/owner/events/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch {
      alert('Failed to delete event')
    }
  }

  const openEdit = (ev: Event) => {
    setEditTarget(ev)
    setEditEvent({
      title: ev.title,
      description: ev.description || '',
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0,16) : '',
      endDate: '',
      capacity: ev.capacity ? String(ev.capacity) : '',
      isPublic: ev.status === 'PUBLISHED',
      featured: false
    })
  }

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTarget) return
    try {
      await putJson(`/api/owner/events/${editTarget.id}`, {
        title: editEvent.title,
        description: editEvent.description || null,
        startDate: editEvent.startDate ? new Date(editEvent.startDate).toISOString() : undefined,
        endDate: editEvent.endDate ? new Date(editEvent.endDate).toISOString() : null,
        capacity: editEvent.capacity ? parseInt(editEvent.capacity) : null,
        isPublic: editEvent.isPublic,
        featured: editEvent.featured
      })
      const data = await getJson<{ events: Event[] }>(`/api/owner/events`)
      setEvents(data.events || [])
      setEditTarget(null)
    } catch (err) {
      alert('Failed to update event')
    }
  }

  if (!auth?.authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="heading-2 mb-4">Owner Login</h1>
        <p className="text-body mb-6">Enter your email to receive a one-time magic link.</p>
        <form onSubmit={requestMagic} className="space-y-4">
          <input type="email" className="input w-full" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="owner@linea.app" required />
          <button type="submit" className="btn btn-primary w-full">Send magic link</button>
        </form>
      </div>
    )
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
        <a
          href="/owner/theme"
          className="ml-4 text-indigo-600 hover:text-indigo-800 underline"
        >
          Customize Theme
        </a>
      </div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <input type="text" value={newEvent.shortDescription} onChange={(e)=>setNewEvent({ ...newEvent, shortDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input type="text" value={newEvent.productName} onChange={(e)=>setNewEvent({ ...newEvent, productName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                <input type="url" value={newEvent.heroImageUrl} onChange={(e)=>setNewEvent({ ...newEvent, heroImageUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                <textarea value={newEvent.longDescription} onChange={(e)=>setNewEvent({ ...newEvent, longDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value Proposition</label>
                <input type="text" value={newEvent.valueProposition} onChange={(e)=>setNewEvent({ ...newEvent, valueProposition: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                  <textarea value={newEvent.features} onChange={(e)=>setNewEvent({ ...newEvent, features: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Awards (one per line)</label>
                  <textarea value={newEvent.awards} onChange={(e)=>setNewEvent({ ...newEvent, awards: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input type="url" value={newEvent.socialInstagram} onChange={(e)=>setNewEvent({ ...newEvent, socialInstagram: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
                  <input type="url" value={newEvent.socialTiktok} onChange={(e)=>setNewEvent({ ...newEvent, socialTiktok: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input type="url" value={newEvent.socialFacebook} onChange={(e)=>setNewEvent({ ...newEvent, socialFacebook: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input type="url" value={newEvent.socialLinkedin} onChange={(e)=>setNewEvent({ ...newEvent, socialLinkedin: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Video URL</label>
                  <input type="url" value={newEvent.videoUrl} onChange={(e)=>setNewEvent({ ...newEvent, videoUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Press Kit URL</label>
                  <input type="url" value={newEvent.pressKitUrl} onChange={(e)=>setNewEvent({ ...newEvent, pressKitUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input type="email" value={newEvent.contactEmail} onChange={(e)=>setNewEvent({ ...newEvent, contactEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input type="tel" value={newEvent.contactPhone} onChange={(e)=>setNewEvent({ ...newEvent, contactPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">QR URL</label>
                <input type="url" value={newEvent.qrUrl} onChange={(e)=>setNewEvent({ ...newEvent, qrUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
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
                    <button onClick={() => openEdit(event)} className="text-gray-600 hover:text-gray-800 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
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

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h2>
            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" value={editEvent.title} onChange={(e)=>setEditEvent({ ...editEvent, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={editEvent.description} onChange={(e)=>setEditEvent({ ...editEvent, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input type="datetime-local" value={editEvent.startDate} onChange={(e)=>setEditEvent({ ...editEvent, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date (optional)</label>
                <input type="datetime-local" value={editEvent.endDate} onChange={(e)=>setEditEvent({ ...editEvent, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (optional)</label>
                <input type="number" value={editEvent.capacity} onChange={(e)=>setEditEvent({ ...editEvent, capacity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={editEvent.isPublic} onChange={(e)=>setEditEvent({ ...editEvent, isPublic: e.target.checked })} />
                  Public (publish)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={editEvent.featured} onChange={(e)=>setEditEvent({ ...editEvent, featured: e.target.checked })} />
                  Featured
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={()=>setEditTarget(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
