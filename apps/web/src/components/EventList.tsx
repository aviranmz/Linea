import { Event } from '../types/Event';
import { useLanguage } from '../hooks/useLanguage';

interface EventListProps {
  events: Event[];
  variant?: 'table' | 'grid' | 'list';
  showOwner?: boolean;
  showCategory?: boolean;
  showStatus?: boolean;
  showWaitlist?: boolean;
  className?: string;
  onEventClick?: (event: Event) => void;
}

export function EventList({
  events,
  variant = 'grid',
  showOwner = true,
  showCategory = true,
  showStatus = false,
  showWaitlist = true,
  className = '',
  onEventClick,
}: EventListProps) {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return t('common.published');
      case 'DRAFT':
        return t('common.draft');
      case 'CANCELLED':
        return t('common.cancelled');
      case 'COMPLETED':
        return t('common.completed');
      case 'PENDING_REVIEW':
        return t('common.pendingReview');
      default:
        return status;
    }
  };

  if (variant === 'table') {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
      >
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Event
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date & Time
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Location
              </th>
              {showOwner && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Owner
                </th>
              )}
              {showCategory && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
              )}
              {showStatus && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              )}
              {showWaitlist && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Waitlist
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {events.map(event => {
              // const listData = getEventListData(event)
              // const fallbacks = getEventFallbacks(event)

              return (
                <tr
                  key={event.id}
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => onEventClick?.(event)}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <img
                          src={
                            event.metadata?.heroImageUrl ||
                            '/images/event-placeholder.jpg'
                          }
                          alt={event.title}
                          className='h-10 w-10 rounded-lg object-cover'
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {event.title}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {event.shortDescription || t('common.noDescription')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatDate(event.startDate)}
                    {event.endDate && (
                      <div className='text-gray-500'>
                        to {formatDate(event.endDate)}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {event.venue ? (
                      <div>
                        <div className='font-medium'>{event.venue.name}</div>
                        <div className='text-gray-500'>
                          {event.venue.city}, {event.venue.country}
                        </div>
                      </div>
                    ) : (
                      <div className='text-gray-500'>Location TBA</div>
                    )}
                  </td>
                  {showOwner && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {event.owner ? (
                        <div>
                          <div className='font-medium'>{event.owner.name}</div>
                          {event.owner.businessName && (
                            <div className='text-gray-500'>
                              {event.owner.businessName}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='text-gray-500'>Unknown</div>
                      )}
                    </td>
                  )}
                  {showCategory && (
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {event.category ? (
                        <span
                          className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
                          style={{
                            backgroundColor: event.category.color + '20',
                            color: event.category.color,
                          }}
                        >
                          {event.category.icon} {event.category.name}
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          📅 General
                        </span>
                      )}
                    </td>
                  )}
                  {showStatus && (
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </td>
                  )}
                  {showWaitlist && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {event._count?.waitlist || 0} people
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {events.map(event => {
          // const listData = getEventListData(event)
          // const fallbacks = getEventFallbacks(event)

          return (
            <div
              key={event.id}
              className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer'
              onClick={() => onEventClick?.(event)}
            >
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0'>
                  <img
                    src={(() => {
                      const url = event.metadata?.heroImageUrl;
                      if (
                        typeof url === 'string' &&
                        (url.startsWith('http') ||
                          url.startsWith('/assets/') ||
                          url.startsWith('/uploads/'))
                      ) {
                        return url;
                      }
                      if (
                        typeof url === 'string' &&
                        url.includes('/images/events/')
                      ) {
                        return '/images/design-events.jpg';
                      }
                      return '/assets/linea_light.png';
                    })()}
                    alt={event.title}
                    className='w-16 h-16 rounded-lg object-cover'
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/linea_light.png';
                    }}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {event.title}
                    </h3>
                    <div className='flex items-center space-x-2'>
                      {event.featured && (
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                          ⭐ Featured
                        </span>
                      )}
                      {showStatus && (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                        >
                          {getStatusText(event.status)}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className='text-gray-600 mt-1'>
                    {event.shortDescription ||
                      t('common.noDescriptionAvailable')}
                  </p>

                  <div className='mt-2 flex items-center space-x-4 text-sm text-gray-500'>
                    <div className='flex items-center'>
                      <span className='mr-1'>📅</span>
                      {formatDate(event.startDate)}
                    </div>
                    <div className='flex items-center'>
                      <span className='mr-1'>📍</span>
                      {event.venue
                        ? `${event.venue.city}, ${event.venue.country}`
                        : t('common.locationTBA')}
                    </div>
                    {showOwner && event.owner && (
                      <div className='flex items-center'>
                        <span className='mr-1'>👤</span>
                        {event.owner.businessName || event.owner.name}
                      </div>
                    )}
                    {showWaitlist && (
                      <div className='flex items-center'>
                        <span className='mr-1'>👥</span>
                        {event._count?.waitlist || 0} people
                      </div>
                    )}
                  </div>

                  <div className='mt-2 flex flex-wrap gap-1'>
                    {event.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {events.map(event => (
        <div
          key={event.id}
          className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
          onClick={() => onEventClick?.(event)}
        >
          <div className='relative'>
            <img
              src={
                event.metadata?.heroImageUrl || '/images/event-placeholder.jpg'
              }
              alt={event.title}
              className='w-full h-48 object-cover'
            />
            {event.featured && (
              <div className='absolute top-2 right-2'>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                  ⭐ Featured
                </span>
              </div>
            )}
            {showCategory && event.category && (
              <div className='absolute top-2 left-2'>
                <span
                  className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white'
                  style={{ backgroundColor: event.category.color }}
                >
                  {event.category.icon} {event.category.name}
                </span>
              </div>
            )}
          </div>

          <div className='p-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {event.title}
            </h3>

            <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
              {event.shortDescription || t('common.noDescriptionAvailable')}
            </p>

            <div className='space-y-2 mb-4'>
              <div className='flex items-center text-sm text-gray-500'>
                <span className='mr-2'>📅</span>
                {formatDate(event.startDate)}
              </div>
              <div className='flex items-center text-sm text-gray-500'>
                <span className='mr-2'>📍</span>
                {event.venue
                  ? `${event.venue.city}, ${event.venue.country}`
                  : t('common.locationTBA')}
              </div>
              {showOwner && event.owner && (
                <div className='flex items-center text-sm text-gray-500'>
                  <span className='mr-2'>👤</span>
                  {event.owner.businessName || event.owner.name}
                </div>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex flex-wrap gap-1'>
                {event.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {showWaitlist && (
                <span className='text-base text-blue-600 font-medium'>
                  {event._count?.waitlist || 0} people
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
