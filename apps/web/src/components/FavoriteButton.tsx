import { useState, useEffect } from 'react'
import { getJson, postJson } from '../lib/api'

interface FavoriteButtonProps {
  eventId: string
  eventTitle: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  onToggle?: (isFavorited: boolean) => void
}

export function FavoriteButton({ 
  eventId, 
  eventTitle, 
  className = '', 
  size = 'md',
  showText = false,
  onToggle 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check if event is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await getJson<{ isFavorited: boolean }>(`/api/favorites/${eventId}`)
        setIsFavorited(response.isFavorited)
      } catch (error) {
        console.error('Failed to check favorite status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkFavoriteStatus()
  }, [eventId])

  const handleToggle = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await postJson<{ isFavorited: boolean; action: string }>(`/api/favorites/${eventId}/toggle`, {})
      setIsFavorited(response.isFavorited)
      onToggle?.(response.isFavorited)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      // Show user-friendly error message
      alert('Failed to update favorites. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <button
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        <HeartIcon size={size} filled={false} />
        {showText && <span className="ml-2">Loading...</span>}
      </button>
    )
  }

  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  }


  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${className}
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-full border-2 transition-all duration-200
        ${isFavorited 
          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' 
          : 'border-gray-300 bg-white text-gray-600 hover:border-red-300 hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      `}
      title={isFavorited ? `Remove ${eventTitle} from favorites` : `Add ${eventTitle} to favorites`}
    >
      <HeartIcon size={size} filled={isFavorited} />
      {showText && (
        <span className="ml-2 font-medium">
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </button>
  )
}

interface HeartIconProps {
  size: 'sm' | 'md' | 'lg'
  filled: boolean
}

function HeartIcon({ size, filled }: HeartIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <svg
      className={`${sizeClasses[size]} transition-all duration-200`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}
