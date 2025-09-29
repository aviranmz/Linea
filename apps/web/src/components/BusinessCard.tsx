import React, { useState, useEffect } from 'react'
import { getJson } from '../lib/api'
import { SocialLinks } from './SocialLinks'
import { PublicPhotoGallery } from './PublicPhotoGallery'

interface Owner {
  id: string
  name: string
  businessName: string
  businessIntro?: string
  logoUrl?: string
  profilePictureUrl?: string
  website?: string
  address?: string
  city?: string
  country?: string
  facebookUrl?: string
  instagramUrl?: string
  area?: {
    id: string
    name: string
    slug: string
    color: string
    icon: string
  }
  product?: {
    id: string
    name: string
    slug: string
    color: string
    icon: string
  }
}

interface BusinessCardProps {
  ownerId: string
  showPhotos?: boolean
  showSocialLinks?: boolean
  className?: string
}

export function BusinessCard({ 
  ownerId, 
  showPhotos = true, 
  showSocialLinks = true,
  className = ''
}: BusinessCardProps) {
  const [owner, setOwner] = useState<Owner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOwner = async () => {
      try {
        const data = await getJson<{ owner: Owner }>(`/api/owners/${ownerId}/profile`)
        setOwner(data.owner)
      } catch (err) {
        console.error('Failed to load owner:', err)
        setError('Failed to load business card')
      } finally {
        setLoading(false)
      }
    }

    if (ownerId) {
      loadOwner()
    }
  }, [ownerId])

  if (loading) {
    return (
      <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error || !owner) {
    return (
      <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error || 'Business card not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header with logo and basic info */}
      <div className="flex items-start mb-6">
        <div className="flex-shrink-0 mr-4">
          {owner.logoUrl ? (
            <img
              src={owner.logoUrl}
              alt={`${owner.businessName} logo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                {owner.businessName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {owner.businessName}
          </h2>
          {owner.name && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              by {owner.name}
            </p>
          )}
          
          {/* Location and specializations */}
          <div className="flex flex-wrap gap-2 mb-3">
            {owner.city && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                📍 {owner.city}
              </span>
            )}
            {owner.area && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${owner.area.color}20`,
                  color: owner.area.color
                }}
              >
                {owner.area.icon} {owner.area.name}
              </span>
            )}
            {owner.product && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${owner.product.color}20`,
                  color: owner.product.color
                }}
              >
                {owner.product.icon} {owner.product.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Business description */}
      {owner.businessIntro && (
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {owner.businessIntro}
          </p>
        </div>
      )}

      {/* Contact information */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Contact Information
        </h3>
        <div className="space-y-2">
          {owner.address && (
            <div className="flex items-start">
              <span className="text-gray-400 dark:text-gray-500 mr-2">📍</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{owner.address}</span>
            </div>
          )}
          {owner.website && (
            <div className="flex items-center">
              <span className="text-gray-400 dark:text-gray-500 mr-2">🌐</span>
              <a
                href={owner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
              >
                {owner.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      {showSocialLinks && (owner.facebookUrl || owner.instagramUrl || owner.website) && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Follow Us
          </h3>
          <SocialLinks
            facebookUrl={owner.facebookUrl}
            instagramUrl={owner.instagramUrl}
            website={owner.website}
            size="md"
            showLabels={false}
          />
        </div>
      )}

      {/* Photo Gallery */}
      {showPhotos && (
        <div>
          <PublicPhotoGallery
            photos={[]} // This would be loaded separately
            maxPhotos={6}
            showTitles={false}
            gridCols={3}
          />
        </div>
      )}
    </div>
  )
}
