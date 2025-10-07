import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJson } from '../lib/api';

interface EventAnalyticsData {
  eventId: string;
  period: string;
  metrics: {
    totalViews: number;
    uniqueUsers: number;
    totalInteractions: number;
    topCountries: Array<{ country: string; count: number }>;
    topDevices: Array<{ device: string; count: number }>;
    recentViews: Array<{
      id: string;
      userId: string | null;
      userName: string | null;
      userEmail: string | null;
      country: string | null;
      deviceType: string | null;
      createdAt: string;
    }>;
  };
}

export default function EventAnalytics() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<EventAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'1d' | '7d' | '30d'>('7d');
  const [eventTitle, setEventTitle] = useState<string>('');

  useEffect(() => {
    if (eventId) {
      loadAnalytics();
    }
  }, [eventId, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getJson<EventAnalyticsData>(
        `/api/analytics/event/${eventId}?period=${period}`
      );
      setAnalytics(data);

      // Also fetch event title for display
      try {
        const eventData = await getJson<{ event: { title: string } }>(
          `/api/owner/events/${eventId}`
        );
        setEventTitle(eventData.event.title);
      } catch {
        setEventTitle('Event Analytics');
      }
    } catch (err: unknown) {
      console.error('Analytics error:', err);
      const error = err as { status?: number; message?: string };
      if (error.status === 404) {
        setError(
          `Event not found. The event with ID "${eventId}" does not exist or may have been deleted.`
        );
      } else if (error.status === 403) {
        setError(
          'Access denied. You do not have permission to view analytics for this event.'
        );
        // Redirect to owner portal after 3 seconds
        setTimeout(() => navigate('/owner'), 3000);
      } else {
        setError(
          `Failed to load analytics data. Error: ${error.message || 'Unknown error'}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='animate-pulse space-y-6'>
          <div className='h-8 bg-neutral-200 rounded w-1/3'></div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-24 bg-neutral-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Access Denied
          </h1>
          <p className='text-gray-600 mb-6'>{error}</p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/owner')}
              className='btn btn-primary'
            >
              Back to Owner Portal
            </button>
            <button onClick={loadAnalytics} className='btn btn-outline'>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='heading-1'>Event Analytics</h1>
            <p className='text-body mt-2'>{eventTitle}</p>
          </div>
          <div className='flex items-center space-x-4'>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value as '1d' | '7d' | '30d')}
              className='input'
            >
              <option value='1d'>Last 24 hours</option>
              <option value='7d'>Last 7 days</option>
              <option value='30d'>Last 30 days</option>
            </select>
            <button
              onClick={() => navigate('/owner')}
              className='btn btn-outline'
            >
              Back to Portal
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
        <div className='card p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-neutral-600'>
                Total Views
              </p>
              <p className='text-3xl font-bold text-neutral-900'>
                {analytics.metrics.totalViews.toLocaleString()}
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='card p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-neutral-600'>
                Unique Users
              </p>
              <p className='text-3xl font-bold text-neutral-900'>
                {analytics.metrics.uniqueUsers.toLocaleString()}
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='card p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-neutral-600'>
                Interactions
              </p>
              <p className='text-3xl font-bold text-neutral-900'>
                {analytics.metrics.totalInteractions.toLocaleString()}
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='card p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-neutral-600'>
                Engagement Rate
              </p>
              <p className='text-3xl font-bold text-neutral-900'>
                {analytics.metrics.totalViews > 0
                  ? (
                      (analytics.metrics.totalInteractions /
                        analytics.metrics.totalViews) *
                      100
                    ).toFixed(1)
                  : '0'}
                %
              </p>
            </div>
            <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-orange-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic and Device Data */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
        {/* Top Countries */}
        {analytics.metrics.topCountries.length > 0 && (
          <div className='card p-6'>
            <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
              Top Countries
            </h3>
            <div className='space-y-3'>
              {analytics.metrics.topCountries.map((country, index) => (
                <div
                  key={country.country}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center'>
                      <span className='text-xs font-semibold text-accent-600'>
                        #{index + 1}
                      </span>
                    </div>
                    <span className='text-neutral-900'>
                      {country.country || 'Unknown'}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-accent-600'>
                    {country.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Devices */}
        {analytics.metrics.topDevices.length > 0 && (
          <div className='card p-6'>
            <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
              Device Types
            </h3>
            <div className='space-y-3'>
              {analytics.metrics.topDevices.map((device, index) => (
                <div
                  key={device.device}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center'>
                      <span className='text-xs font-semibold text-accent-600'>
                        #{index + 1}
                      </span>
                    </div>
                    <span className='text-neutral-900 capitalize'>
                      {device.device || 'Unknown'}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-accent-600'>
                    {device.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Views */}
      {analytics.metrics.recentViews.length > 0 && (
        <div className='card p-6'>
          <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
            Recent Views
          </h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-neutral-200'>
                  <th className='text-left py-3 px-4 text-sm font-medium text-neutral-600'>
                    User
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-neutral-600'>
                    Location
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-neutral-600'>
                    Device
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-neutral-600'>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.metrics.recentViews.map(view => (
                  <tr key={view.id} className='border-b border-neutral-100'>
                    <td className='py-3 px-4'>
                      <div>
                        <p className='text-sm font-medium text-neutral-900'>
                          {view.userName || view.userEmail || 'Anonymous'}
                        </p>
                        {view.userEmail && view.userName && (
                          <p className='text-xs text-neutral-500'>
                            {view.userEmail}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className='py-3 px-4 text-sm text-neutral-600'>
                      {view.country || 'Unknown'}
                    </td>
                    <td className='py-3 px-4 text-sm text-neutral-600 capitalize'>
                      {view.deviceType || 'Unknown'}
                    </td>
                    <td className='py-3 px-4 text-sm text-neutral-600'>
                      {new Date(view.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
