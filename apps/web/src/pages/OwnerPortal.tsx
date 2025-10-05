import React from 'react'
import { useState, useEffect } from 'react'
import { postJson, getJson, putJson, deleteJson } from '../lib/api'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDate: string
  status: string
  capacity?: number
  featured?: boolean
  currentWaitlist?: number
  metadata?: Record<string, unknown>
}

interface RegisteredUser {
  id: string
  email: string
  name?: string
  businessName?: string
  eventCount: number
  uniqueEvents: number
  totalWaitlistEntries?: number
  createdAt?: string
  events: Array<{
    eventId: string
    eventTitle: string
    joinedAt: string
    status?: string
  }>
}

export function OwnerPortal() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string }} | null>(null)
  const [userProfile, setUserProfile] = useState<{ businessName?: string; logoUrl?: string } | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }))
  }, [])

  // Load user profile data when authenticated
  useEffect(() => {
    if (auth?.authenticated) {
      getJson<{ businessName?: string; logoUrl?: string }>('/api/owner/profile')
        .then(setUserProfile)
        .catch(() => setUserProfile(null))
    }
  }, [auth?.authenticated])

  const requestMagic = async (e: React.FormEvent) => {
    e.preventDefault()
    await postJson('/auth/request-magic-link', { email: loginEmail })
    alert('Magic link sent if the email exists. Check your inbox.')
  }
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Event | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    featured: '',
    dateFrom: '',
    dateTo: ''
  })
  // Registered users state
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userFilters, setUserFilters] = useState({
    search: '',
    eventId: ''
  })
  const [availableEvents, setAvailableEvents] = useState<Event[]>([])
  const [userPagination, setUserPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [bulkEmailModal, setBulkEmailModal] = useState(false)
  const [bulkEmailData, setBulkEmailData] = useState({
    subject: '',
    message: ''
  })

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
        setFilteredEvents(data.events || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Load registered users
  const loadRegisteredUsers = async () => {
    setUsersLoading(true)
    try {
      const params = new URLSearchParams()
      if (userFilters.search) params.append('search', userFilters.search)
      if (userFilters.eventId) params.append('eventId', userFilters.eventId)
      params.append('page', userPagination.page.toString())
      params.append('limit', userPagination.limit.toString())
      
      const data = await getJson<{ 
        users: RegisteredUser[], 
        events: Event[],
        pagination: {
          page: number,
          limit: number,
          total: number,
          totalPages: number
        }
      }>(`/api/owner/registered-users?${params}`)
      console.log('Registered users API response:', data)
      setRegisteredUsers(data.users || [])
      setAvailableEvents(data.events || [])
      if (data.pagination) {
        setUserPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to load registered users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  // Load registered users when authenticated
  useEffect(() => {
    if (auth?.authenticated) {
      loadRegisteredUsers()
    }
  }, [auth?.authenticated, userFilters, userPagination.page, userPagination.limit])

  // Export users to CSV
  const exportUsersToCSV = async () => {
    try {
      // Fetch all users for export (not paginated)
      const params = new URLSearchParams()
      if (userFilters.search) params.append('search', userFilters.search)
      if (userFilters.eventId) params.append('eventId', userFilters.eventId)
      params.append('page', '1')
      params.append('limit', '10000') // Large limit to get all users
      
      const data = await getJson<{ 
        users: RegisteredUser[], 
        events: Event[],
        pagination: {
          page: number,
          limit: number,
          total: number,
          totalPages: number
        }
      }>(`/api/owner/registered-users?${params}`)
      
      const headers = ['Name', 'Email', 'Events', 'Total Entries', 'Joined Date']
      const csvContent = [
        headers.join(','),
        ...data.users.map(user => [
          `"${user.name || 'No Name'}"`,
          `"${user.email}"`,
          user.uniqueEvents,
          user.totalWaitlistEntries || 0,
          user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `registered-users-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export users:', error)
      alert('Failed to export users')
    }
  }

  // Send bulk email
  const sendBulkEmail = async () => {
    if (selectedUsers.size === 0) {
      alert('Please select users to send email to')
      return
    }
    
    try {
      await postJson('/api/owner/bulk-email', {
        userIds: Array.from(selectedUsers),
        subject: bulkEmailData.subject,
        message: bulkEmailData.message
      })
      alert(`Email sent to ${selectedUsers.size} users`)
      setBulkEmailModal(false)
      setBulkEmailData({ subject: '', message: '' })
      setSelectedUsers(new Set())
    } catch (error) {
      console.error('Failed to send bulk email:', error)
      alert('Failed to send email')
    }
  }

  // Filter events based on current filters
  useEffect(() => {
    let filtered = [...events]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        (event.description && event.description.toLowerCase().includes(searchLower))
      )
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status)
    }

    // Featured filter
    if (filters.featured === 'true') {
      filtered = filtered.filter(event => event.featured === true)
    } else if (filters.featured === 'false') {
      filtered = filtered.filter(event => event.featured === false)
    }

    // Date range filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter(event => new Date(event.startDate) >= fromDate)
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      filtered = filtered.filter(event => new Date(event.startDate) <= toDate)
    }

    setFilteredEvents(filtered)
  }, [events, filters])

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
    if (!confirm(t('confirm.deleteEvent'))) return
    try {
      await deleteJson(`/api/owner/events/${id}`)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch {
      alert('Failed to delete event')
    }
  }

  // Removed unused openEdit helper

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
      {/* Professional Header */}
      <div className="card mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-accent-800 to-accent-900 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {userProfile?.logoUrl && (
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src={userProfile.logoUrl} 
                    alt="Business Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="heading-1 text-white">{t('nav.owner')}</h1>
                {userProfile?.businessName && (
                  <h2 className="heading-3 text-accent-100 mt-1">{userProfile.businessName}</h2>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-accent-100 text-sm">{t('common.welcomeBack')}</p>
              <p className="text-white font-semibold">{auth?.user?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="px-8 py-6">
          <p className="text-gray-600 mb-6">
            {t('owner.manageEvents')}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary px-6 py-3 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{t('owner.createNewEvent')}</span>
            </button>
            
            <Link
              to="/owner/profile"
              className="btn btn-secondary px-6 py-3 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{t('owner.businessProfile')}</span>
            </Link>
            
            <Link
              to="/owner/theme"
              className="btn btn-outline px-6 py-3 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              <span>{t('owner.customizeTheme')}</span>
            </Link>
            
          </div>
        </div>
      </div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <div>
                <label htmlFor="event-title" className="block text-sm font-medium text-neutral-700 mb-2">
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
                <label htmlFor="event-description" className="block text-sm font-medium text-neutral-700 mb-2">
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Short Description</label>
                  <input type="text" value={newEvent.shortDescription} onChange={(e)=>setNewEvent({ ...newEvent, shortDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name</label>
                  <input type="text" value={newEvent.productName} onChange={(e)=>setNewEvent({ ...newEvent, productName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Hero Image URL</label>
                <input type="url" value={newEvent.heroImageUrl} onChange={(e)=>setNewEvent({ ...newEvent, heroImageUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Long Description</label>
                <textarea value={newEvent.longDescription} onChange={(e)=>setNewEvent({ ...newEvent, longDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Value Proposition</label>
                <input type="text" value={newEvent.valueProposition} onChange={(e)=>setNewEvent({ ...newEvent, valueProposition: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Features (one per line)</label>
                  <textarea value={newEvent.features} onChange={(e)=>setNewEvent({ ...newEvent, features: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Awards (one per line)</label>
                  <textarea value={newEvent.awards} onChange={(e)=>setNewEvent({ ...newEvent, awards: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Instagram</label>
                  <input type="url" value={newEvent.socialInstagram} onChange={(e)=>setNewEvent({ ...newEvent, socialInstagram: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">TikTok</label>
                  <input type="url" value={newEvent.socialTiktok} onChange={(e)=>setNewEvent({ ...newEvent, socialTiktok: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Facebook</label>
                  <input type="url" value={newEvent.socialFacebook} onChange={(e)=>setNewEvent({ ...newEvent, socialFacebook: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">LinkedIn</label>
                  <input type="url" value={newEvent.socialLinkedin} onChange={(e)=>setNewEvent({ ...newEvent, socialLinkedin: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Product Video URL</label>
                  <input type="url" value={newEvent.videoUrl} onChange={(e)=>setNewEvent({ ...newEvent, videoUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Press Kit URL</label>
                  <input type="url" value={newEvent.pressKitUrl} onChange={(e)=>setNewEvent({ ...newEvent, pressKitUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Contact Email</label>
                  <input type="email" value={newEvent.contactEmail} onChange={(e)=>setNewEvent({ ...newEvent, contactEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Contact Phone</label>
                  <input type="tel" value={newEvent.contactPhone} onChange={(e)=>setNewEvent({ ...newEvent, contactPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">QR URL</label>
                <input type="url" value={newEvent.qrUrl} onChange={(e)=>setNewEvent({ ...newEvent, qrUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="event-start-date" className="block text-sm font-medium text-neutral-700 mb-2">
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
                <label htmlFor="event-capacity" className="block text-sm font-medium text-neutral-700 mb-2">
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
      <div className="card overflow-hidden">
        <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="heading-2">{t('owner.yourEvents')}</h2>
                <p className="text-body text-sm">{t('owner.manageEventPerformance')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-caption">{t('owner.totalEvents')}</p>
              <p className="heading-2 text-accent-600">{events.length}</p>
            </div>
          </div>
        </div>

        {/* Events Filters */}
        <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
{t('owner.filterEvents')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('common.search')}
              </label>
              <input
                type="text"
                className="input w-full"
                placeholder={t('owner.searchEvents')}
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('common.status')}
              </label>
              <select
                className="input w-full"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">{t('owner.allStatus')}</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Featured */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('common.featured')}
              </label>
              <select
                className="input w-full"
                value={filters.featured}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
              >
                <option value="">{t('owner.allEvents')}</option>
                <option value="true">{t('owner.featuredOnly')}</option>
                <option value="false">{t('owner.nonFeatured')}</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('owner.fromDate')}
              </label>
              <input
                type="date"
                className="input w-full"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('owner.toDate')}
              </label>
              <input
                type="date"
                className="input w-full"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
{t('owner.showing')} {filteredEvents.length} {t('owner.of')} {events.length} {t('owner.events')}
            </div>
            <button
              type="button"
              onClick={() => setFilters({ search: '', status: '', featured: '', dateFrom: '', dateTo: '' })}
              className="btn btn-outline btn-sm"
            >
{t('owner.clearFilters')}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredEvents.map((event) => {
              // Get event image - prioritize heroImageUrl, fallback to youtubeUrl thumbnail
  const getEventImage = (): string => {
    if (event.metadata?.heroImageUrl && typeof event.metadata.heroImageUrl === 'string') {
      return event.metadata.heroImageUrl
    }
    if (event.metadata?.videoUrl && typeof event.metadata.videoUrl === 'string') {
      // Extract YouTube video ID and create thumbnail URL
      const videoId = event.metadata.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }
    return '/assets/linea_light.png' // Fallback to default image
  }

              return (
                <div key={event.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100">
                        <img
                          src={getEventImage() || '/assets/linea_light.png'}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/assets/linea_light.png'
                          }}
                        />
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{event.title}</h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            <span className="capitalize font-medium">{event.status.toLowerCase()}</span>
                            {event.capacity && <span>• Capacity: {event.capacity}</span>}
                            {event.currentWaitlist && <span>• Waitlist: {event.currentWaitlist}</span>}
                          </div>
                        </div>

                        {/* Action Links */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            to={`/events/${event.slug}`}
                            className="btn btn-ghost btn-sm"
                          >
                            View
                          </Link>
                          <Link 
                            to={`/owner/waitlist/${event.id}`} 
                            className="btn btn-ghost btn-sm"
                          >
                            Waitlist
                          </Link>
                          <Link 
                            to={`/owner/events/${event.slug}/edit-advanced`} 
                            className="btn btn-ghost btn-sm"
                          >
                            Edit
                          </Link>
                          <Link 
                            to={`/owner/events/${event.slug}/edit-advanced`} 
                            className="btn btn-ghost btn-sm"
                          >
                            Advanced
                          </Link>
                          <Link 
                            to={`/owner/events/${event.id}/analytics`} 
                            className="btn btn-ghost btn-sm"
                          >
                            Analytics
                          </Link>
                          <button 
                            onClick={() => handleDelete(event.id)} 
                            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {events.length === 0 ? 'No events yet' : 'No events match your filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {events.length === 0 ? 'Create your first event to get started.' : 'Try adjusting your filters or clear them to see all events.'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Event
            </button>
          </div>
        )}
      </div>


      {/* Registered Users Section */}
      {auth?.authenticated && (
        <div className="mt-8">
          <div className="card overflow-hidden">
            <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="heading-2">Registered Users</h2>
                    <p className="text-body text-sm">View all users who registered to your events</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-caption">Total Users</p>
                    <p className="heading-2 text-accent-600">{userPagination.total}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={exportUsersToCSV}
                      className="btn btn-outline btn-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export CSV
                    </button>
                    <button
                      onClick={() => setBulkEmailModal(true)}
                      className="btn btn-primary btn-sm"
                      disabled={selectedUsers.size === 0}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email ({selectedUsers.size})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Filters */}
            <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filter Users
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Search by Email
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Search users..."
                    value={userFilters.search}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Filter by Event
                  </label>
                  <select
                    className="input w-full"
                    value={userFilters.eventId}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, eventId: e.target.value }))}
                  >
                    <option value="">All Events</option>
                    {availableEvents.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Users List */}
            {usersLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-neutral-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : registeredUsers.length > 0 ? (
              <>
                <div className="divide-y divide-neutral-200">
                  {registeredUsers.map((user, index) => (
                    <div key={user.id || index} className="p-4 hover:bg-neutral-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedUsers.has(user.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedUsers)
                                if (e.target.checked) {
                                  newSelected.add(user.id)
                                } else {
                                  newSelected.delete(user.id)
                                }
                                setSelectedUsers(newSelected)
                              }}
                              className="w-4 h-4 text-accent-600 border-neutral-300 rounded focus:ring-accent-500"
                            />
                            <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                              <span className="text-neutral-600 font-medium text-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-neutral-900">
                                  {user.name || 'No Name'}
                                </span>
                                <span className="text-sm text-neutral-500">•</span>
                                <span className="text-sm text-neutral-600">{user.email}</span>
                              </div>
                              <div className="text-xs text-neutral-500 mt-1">
                                Events: {user.uniqueEvents} • Total: {user.totalWaitlistEntries}
                                {user.createdAt && ` • Joined: ${new Date(user.createdAt).toLocaleDateString()}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {userPagination.totalPages > 1 && (
                  <div className="bg-neutral-50 px-8 py-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-600">
                          Showing {((userPagination.page - 1) * userPagination.limit) + 1} to {Math.min(userPagination.page * userPagination.limit, userPagination.total)} of {userPagination.total} users
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setUserPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={userPagination.page <= 1}
                          className="btn btn-outline btn-sm"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-neutral-600">
                          Page {userPagination.page} of {userPagination.totalPages}
                        </span>
                        <button
                          onClick={() => setUserPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={userPagination.page >= userPagination.totalPages}
                          className="btn btn-outline btn-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 text-center">
                <div className="text-neutral-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No registered users found</h3>
                <p className="text-neutral-500 mb-4">
                  No users have registered for your events yet, or they don't match your current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h2>
            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                <input type="text" value={editEvent.title} onChange={(e)=>setEditEvent({ ...editEvent, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea value={editEvent.description} onChange={(e)=>setEditEvent({ ...editEvent, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Start Date</label>
                <input type="datetime-local" value={editEvent.startDate} onChange={(e)=>setEditEvent({ ...editEvent, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">End Date (optional)</label>
                <input type="datetime-local" value={editEvent.endDate} onChange={(e)=>setEditEvent({ ...editEvent, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Capacity (optional)</label>
                <input type="number" value={editEvent.capacity} onChange={(e)=>setEditEvent({ ...editEvent, capacity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" checked={editEvent.isPublic} onChange={(e)=>setEditEvent({ ...editEvent, isPublic: e.target.checked })} />
                  Public (publish)
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
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

      {/* Bulk Email Modal */}
      {bulkEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Bulk Email</h2>
            <form onSubmit={(e) => { e.preventDefault(); sendBulkEmail(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  value={bulkEmailData.subject} 
                  onChange={(e) => setBulkEmailData(prev => ({ ...prev, subject: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                <textarea 
                  value={bulkEmailData.message} 
                  onChange={(e) => setBulkEmailData(prev => ({ ...prev, message: e.target.value }))} 
                  rows={4} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                This email will be sent to {selectedUsers.size} selected users.
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setBulkEmailModal(false)} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
