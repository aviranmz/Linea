import React, { useState, useEffect } from 'react'
import { getJson, putJson } from '../lib/api'
import { Link } from 'react-router-dom'
import { PhotoGallery } from '../components/PhotoGallery'

interface Area {
  id: string
  name: string
  slug: string
  color: string
  icon: string
}

interface Product {
  id: string
  name: string
  slug: string
  color: string
  icon: string
}

interface OwnerProfile {
  name: string
  email: string
  phone: string
  businessName: string
  website: string
  address: string
  city: string
  country: string
  businessIntro: string
  logoUrl: string
  profilePictureUrl: string
  latitude: number
  longitude: number
  areaId: string
  area: Area
  productId: string
  product: Product
  facebookUrl?: string
  instagramUrl?: string
}

export default function OwnerProfile() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string }} | null>(null)
  const [profile, setProfile] = useState<OwnerProfile>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    website: '',
    address: '',
    city: '',
    country: '',
    businessIntro: '',
    logoUrl: '',
    profilePictureUrl: '',
    latitude: 0,
    longitude: 0,
    areaId: '',
    area: { id: '', name: '', slug: '', color: '', icon: '' },
    productId: '',
    product: { id: '', name: '', slug: '', color: '', icon: '' },
    facebookUrl: '',
    instagramUrl: ''
  })
  const [areas, setAreas] = useState<Area[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }))
  }, [])

  useEffect(() => {
    if (auth?.authenticated) {
      loadProfile()
      loadAreas()
      loadProducts()
    }
  }, [auth])

  const loadProfile = async () => {
    try {
      const data = await getJson<OwnerProfile>('/api/owner/profile')
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadAreas = async () => {
    try {
      const data = await getJson<{ areas: Area[] }>('/api/areas')
      setAreas(data.areas || [])
    } catch (err) {
      console.error('Failed to load areas:', err)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await getJson<{ products: Product[] }>('/api/products')
      setProducts(data.products || [])
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File too large. Maximum size is 5MB.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload JPEG, PNG, or WebP images.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/owner/upload/logo', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      setProfile(prev => ({ ...prev, logoUrl: result.logoUrl }))
      setMessage('Logo uploaded successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to upload logo. Please try again.')
      console.error('Failed to upload logo:', err)
    }
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File too large. Maximum size is 5MB.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload JPEG, PNG, or WebP images.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/owner/upload/profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      setProfile(prev => ({ ...prev, profilePictureUrl: result.profilePictureUrl }))
      setMessage('Profile picture uploaded successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to upload profile picture. Please try again.')
      console.error('Failed to upload profile picture:', err)
    }
  }

  const handleGeocodeAddress = async () => {
    if (!profile.address || !profile.city || !profile.country) {
      setMessage('Please fill in address, city, and country first.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setGeocoding(true)
    try {
      const fullAddress = `${profile.address}, ${profile.city}, ${profile.country}`
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`)
      
      if (!response.ok) {
        throw new Error('Geocoding failed')
      }

      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        setProfile(prev => ({ 
          ...prev, 
          latitude: parseFloat(lat), 
          longitude: parseFloat(lon) 
        }))
        setMessage('Address geocoded successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Address not found. Please check your address details.')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setMessage('Failed to geocode address. Please try again.')
      console.error('Geocoding failed:', err)
    } finally {
      setGeocoding(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      await putJson('/api/owner/profile', profile)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update profile. Please try again.')
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  if (!auth?.authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="heading-2 mb-4">Owner Login</h1>
        <p className="text-body mb-6">Please log in to access your profile.</p>
        <Link to="/owner" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="heading-2 mb-2">Business Profile</h1>
        <p className="text-body">
          Manage your business information and contact details for your design events.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="heading-4 mb-4">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                className="input w-full"
                value={profile.businessName}
                onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Studio Nova Cucine"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be displayed on your event pages and business card
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Logo
              </label>
              <div className="space-y-3">
                {profile.logoUrl && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={profile.logoUrl} 
                      alt="Current logo" 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Current logo</p>
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, logoUrl: '' }))}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove logo
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoUpload}
                  className="input w-full"
                />
                <p className="text-xs text-gray-500">
                  Upload a logo for your business (JPEG, PNG, WebP, max 5MB)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designer/Business Picture
              </label>
              <div className="space-y-3">
                {profile.profilePictureUrl && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={profile.profilePictureUrl} 
                      alt="Current profile picture" 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Current profile picture</p>
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, profilePictureUrl: '' }))}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove picture
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfilePictureUpload}
                  className="input w-full"
                />
                <p className="text-xs text-gray-500">
                  Upload a profile picture for the designer or business (JPEG, PNG, WebP, max 5MB)
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Introduction
              </label>
              <textarea
                className="input w-full h-24 resize-none"
                value={profile.businessIntro}
                onChange={(e) => setProfile(prev => ({ ...prev, businessIntro: e.target.value }))}
                placeholder="Tell visitors about your design philosophy, specialties, and what makes your work unique..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                A brief description of your business that will appear on your business card
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designer Name
              </label>
              <input
                type="text"
                className="input w-full"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Luca Bianchi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className="input w-full"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="luca@studionovacucine.it"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                className="input w-full"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+39 02 1234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                className="input w-full"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://studionovacucine.it"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </span>
                </label>
                <input
                  type="url"
                  className="input w-full"
                  value={profile.facebookUrl || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/yourpage"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your Facebook business page URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </span>
                </label>
                <input
                  type="url"
                  className="input w-full"
                  value={profile.instagramUrl || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/yourhandle"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your Instagram profile URL
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                className="input w-full"
                value={profile.city}
                onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Milano"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              className="input w-full"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Via Brera 15, 20121 Milano"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <select
              className="input w-full"
              value={profile.country}
              onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
            >
              <option value="">Select Country</option>
              <option value="Italy">Italy</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
              <option value="Denmark">Denmark</option>
              <option value="Sweden">Sweden</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Austria">Austria</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Design District / Area
            </label>
            <select
              className="input w-full"
              value={profile.areaId}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                areaId: e.target.value,
                area: areas.find(a => a.id === e.target.value) || { id: '', name: '', slug: '', color: '', icon: '' }
              }))}
            >
              <option value="">Select Design District</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.icon} {area.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose the design district where your business is located
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Specialties
            </label>
            <select
              className="input w-full"
              value={profile.productId}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                productId: e.target.value,
                product: products.find(p => p.id === e.target.value) || { id: '', name: '', slug: '', color: '', icon: '' }
              }))}
            >
              <option value="">Select Product Specialty</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.icon} {product.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose your main product specialty (e.g., Recessed lights, Spotlights)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-4">Location & Map</h2>
            <button
              type="button"
              onClick={handleGeocodeAddress}
              disabled={geocoding || !profile.address || !profile.city || !profile.country}
              className="btn btn-outline btn-sm"
            >
              {geocoding ? 'Geocoding...' : 'Get Coordinates'}
            </button>
          </div>
          
          {(profile.latitude !== 0 && profile.longitude !== 0) && (
            <div className="mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Latitude:</span> {profile.latitude.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {profile.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Map Preview (coordinates will be used to show your location on event pages)
            </p>
            {profile.latitude !== 0 && profile.longitude !== 0 ? (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">📍</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Map will be displayed here<br />
                    Coordinates: {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">🗺️</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fill in your address and click "Get Coordinates" to see your location on the map
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link to="/owner" className="btn btn-outline">
            Back to Dashboard
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Photo Gallery Section */}
      <div className="mt-8">
        <PhotoGallery isEditable={true} maxPhotos={12} />
      </div>
    </div>
  )
}
