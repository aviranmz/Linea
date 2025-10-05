import React, { useState, useEffect } from 'react'
import { getJson, postJson, putJson, deleteJson } from '../lib/api'
import { useLanguage } from '../hooks/useLanguage'

interface Area {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminAreas() {
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const { t } = useLanguage()
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [message, setMessage] = useState('')
  const [newArea, setNewArea] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    icon: '📍',
    isActive: true
  })

  useEffect(() => {
    let mounted = true
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then((res) => { if (!mounted) return; setIsAdmin(!!res.user && res.user.role === 'ADMIN') })
      .catch(() => { if (!mounted) return; setIsAdmin(false) })
      .finally(() => { if (mounted) setAuthLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      loadAreas()
    }
  }, [isAdmin])

  const loadAreas = async () => {
    try {
      const data = await getJson<{ areas: Area[] }>('/api/admin/areas')
      setAreas(data.areas || [])
    } catch (error) {
      console.error('Failed to load areas:', error)
      setMessage('Failed to load areas')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postJson('/api/admin/areas', newArea)
      setMessage('Area created successfully!')
      setNewArea({ name: '', slug: '', description: '', color: '#3b82f6', icon: '📍', isActive: true })
      setShowCreateForm(false)
      loadAreas()
    } catch (error) {
      console.error('Failed to create area:', error)
      setMessage('Failed to create area')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingArea) return

    try {
      await putJson(`/api/admin/areas/${editingArea.id}`, editingArea)
      setMessage('Area updated successfully!')
      setEditingArea(null)
      loadAreas()
    } catch (error) {
      console.error('Failed to update area:', error)
      setMessage('Failed to update area')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm.deleteArea'))) return

    try {
      await deleteJson(`/api/admin/areas/${id}`)
      setMessage('Area deleted successfully!')
      loadAreas()
    } catch (error) {
      console.error('Failed to delete area:', error)
      setMessage('Failed to delete area')
    }
  }

  const toggleActive = async (area: Area) => {
    try {
      await putJson(`/api/admin/areas/${area.id}`, {
        ...area,
        isActive: !area.isActive
      })
      setMessage(`Area ${!area.isActive ? 'activated' : 'deactivated'} successfully!`)
      loadAreas()
    } catch (error) {
      console.error('Failed to toggle area status:', error)
      setMessage('Failed to update area status')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (authLoading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading...</div>
  if (!isAdmin) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Forbidden: Admins only.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin • Areas</h1>
          <p className="text-sm text-gray-600">Manage business areas and districts</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Create Area
        </button>
      </div>

      {message && (
        <div className="bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg mb-6" role="alert">
          {message}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Businesses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {areas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{area.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{area.name}</div>
                          {area.description && (
                            <div className="text-sm text-gray-500">{area.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {area.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        area.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {area.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* TODO: Add business count */}
                      0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingArea(area)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(area)}
                          className={area.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {area.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Area Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Area</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={newArea.name}
                    onChange={(e) => setNewArea(prev => ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={newArea.slug}
                    onChange={(e) => setNewArea(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input w-full"
                    value={newArea.description}
                    onChange={(e) => setNewArea(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      className="input w-full h-10"
                      value={newArea.color}
                      onChange={(e) => setNewArea(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={newArea.icon}
                      onChange={(e) => setNewArea(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="📍"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="mr-2"
                    checked={newArea.isActive}
                    onChange={(e) => setNewArea(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Area Modal */}
      {editingArea && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Area</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={editingArea.name}
                    onChange={(e) => setEditingArea(prev => prev ? ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }) : null)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={editingArea.slug}
                    onChange={(e) => setEditingArea(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input w-full"
                    value={editingArea.description || ''}
                    onChange={(e) => setEditingArea(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      className="input w-full h-10"
                      value={editingArea.color || '#3b82f6'}
                      onChange={(e) => setEditingArea(prev => prev ? ({ ...prev, color: e.target.value }) : null)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={editingArea.icon || '📍'}
                      onChange={(e) => setEditingArea(prev => prev ? ({ ...prev, icon: e.target.value }) : null)}
                      placeholder="📍"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    className="mr-2"
                    checked={editingArea.isActive}
                    onChange={(e) => setEditingArea(prev => prev ? ({ ...prev, isActive: e.target.checked }) : null)}
                  />
                  <label htmlFor="editIsActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingArea(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
