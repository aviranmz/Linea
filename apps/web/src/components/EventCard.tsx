import { Event, getEventDisplayData, getEventFallbacks } from '../types/Event'
import { FavoriteButton } from './FavoriteButton'

interface EventCardProps {
  event: Event
  variant?: 'default' | 'compact' | 'featured'
  showOwner?: boolean
  showCategory?: boolean
  showWaitlist?: boolean
  showFavorite?: boolean
  className?: string
  onEventClick?: (event: Event) => void
}

export function EventCard({ 
  event, 
  variant = 'default', 
  showOwner = true, 
  showCategory = true, 
  showWaitlist = true,
  showFavorite = true,
  className = '',
}: EventCardProps) {
  const displayData = getEventDisplayData(event)
  const fallbacks = getEventFallbacks(event)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatDateRange = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    
    if (!end || start.toDateString() === end.toDateString()) {
      return formatDate(startDate)
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate!)}`
  }
  
  const getEventImage = () => {
    if (event.metadata?.heroImageUrl) return event.metadata.heroImageUrl
    return '/assets/linea_light.png'
  }
  
  const getEventDescription = () => {
    return displayData.shortDescription || fallbacks.shortDescription
  }
  
  const getEventLocation = () => {
    if (displayData.venue) {
      return `${displayData.venue.city}, ${displayData.venue.country}`
    }
    return fallbacks.venue ? `${fallbacks.venue.city}, ${fallbacks.venue.country}` : 'Location TBA'
  }
  
  const getWaitlistText = () => {
    if (!showWaitlist || !displayData._count) return null
    
    const count = displayData._count.waitlist
    if (count === 0) return 'No waitlist'
    if (count === 1) return '1 person on waitlist'
    return `${count} people on waitlist`
  }
  
  const getCapacityText = () => {
    if (!event.capacity) return null
    return `${event.currentWaitlist || 0}/${event.capacity} capacity`
  }
  
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img
              src={getEventImage()}
              alt={displayData.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {displayData.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatDateRange(displayData.startDate, displayData.endDate)}
            </p>
            <p className="text-xs text-gray-500">
              {getEventLocation()}
            </p>
            {showWaitlist && getWaitlistText() && (
              <p className="text-xs text-blue-600 mt-1">
                {getWaitlistText()}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === 'featured') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 hover:shadow-lg transition-shadow ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {displayData.category && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: displayData.category.color + '20', color: displayData.category.color }}
              >
                {displayData.category.icon} {displayData.category.name}
              </span>
            )}
            {displayData.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <img
            src={getEventImage()}
            alt={displayData.title}
            className="w-full h-48 rounded-lg object-cover"
          />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {displayData.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {getEventDescription()}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2 text-gray-400">Date:</span>
            {formatDateRange(displayData.startDate, displayData.endDate)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2 text-gray-400">Location:</span>
            {getEventLocation()}
          </div>
          {showOwner && displayData.owner && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2 text-gray-400">By:</span>
              {displayData.owner.businessName || displayData.owner.name}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {displayData.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          {showWaitlist && getWaitlistText() && (
            <span className="text-sm text-blue-600">
              {getWaitlistText()}
            </span>
          )}
        </div>
      </div>
    )
  }
  
  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="relative">
        <img
          src={getEventImage()}
          alt={displayData.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/assets/linea_light.png'
          }}
        />
        {displayData.featured && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⭐ Featured
            </span>
          </div>
        )}
        {displayData.category && showCategory && (
          <div className="absolute top-2 left-2">
            <span 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: displayData.category.color }}
            >
              {displayData.category.icon} {displayData.category.name}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {displayData.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          {getEventDescription()}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2 text-gray-400">Date:</span>
            {formatDateRange(displayData.startDate, displayData.endDate)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2 text-gray-400">Location:</span>
            {getEventLocation()}
          </div>
          {showOwner && displayData.owner && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2 text-gray-400">By:</span>
              {displayData.owner.businessName || displayData.owner.name}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {displayData.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {showWaitlist && getWaitlistText() && (
              <span className="text-sm text-blue-600">
                {getWaitlistText()}
              </span>
            )}
            {showFavorite && (
              <FavoriteButton
                eventId={event.id}
                eventTitle={displayData.title}
                size="sm"
              />
            )}
          </div>
        </div>
        
        {getCapacityText() && (
          <div className="mt-2 text-sm text-gray-500">
            {getCapacityText()}
          </div>
        )}
      </div>
    </div>
  )
}
