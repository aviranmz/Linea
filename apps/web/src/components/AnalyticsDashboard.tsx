import { useState, useEffect } from 'react'
import { getJson } from '../lib/api'

interface AnalyticsData {
  totalViews: number
  uniqueUsers: number
  totalEvents: number
  totalWaitlist: number
  totalInteractions: number
  topEvents: Array<{
    eventId: string
    eventTitle: string
    eventSlug: string
    views: number
  }>
  topCountries: Array<{
    country: string
    count: number
  }>
  topDevices: Array<{
    device: string
    count: number
  }>
}

interface AnalyticsDashboardProps {
  period?: '1d' | '7d' | '30d'
  className?: string
}

export function AnalyticsDashboard({ period = '30d', className = '' }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getJson<{ metrics: AnalyticsData }>(`/api/analytics/owner?period=${period}`)
      setAnalytics(data.metrics)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-neutral-600">{error}</p>
          <button 
            onClick={loadAnalytics}
            className="btn btn-outline btn-sm mt-2"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Analytics Dashboard</h3>
              <p className="text-sm text-neutral-600">Last {period === '1d' ? '24 hours' : period === '7d' ? '7 days' : '30 days'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Views</p>
                <p className="text-2xl font-bold text-blue-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Unique Users</p>
                <p className="text-2xl font-bold text-green-900">{analytics.uniqueUsers.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Events</p>
                <p className="text-2xl font-bold text-purple-900">{analytics.totalEvents}</p>
              </div>
              <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Waitlist Entries</p>
                <p className="text-2xl font-bold text-orange-900">{analytics.totalWaitlist.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Events */}
        {analytics.topEvents.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Events</h4>
            <div className="space-y-3">
              {analytics.topEvents.map((event, index) => (
                <div key={event.eventId} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-accent-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{event.eventTitle}</p>
                      <p className="text-sm text-neutral-600">{event.views} views</p>
                    </div>
                  </div>
                  <a 
                    href={`/events/${event.eventSlug}`}
                    className="btn btn-ghost btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Event
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geographic and Device Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Countries */}
          {analytics.topCountries.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">Top Countries</h4>
              <div className="space-y-2">
                {analytics.topCountries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-neutral-600">#{index + 1}</span>
                      <span className="text-neutral-900">{country.country || 'Unknown'}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent-600">{country.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Devices */}
          {analytics.topDevices.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">Device Types</h4>
              <div className="space-y-2">
                {analytics.topDevices.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-neutral-600">#{index + 1}</span>
                      <span className="text-neutral-900 capitalize">{device.device || 'Unknown'}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent-600">{device.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Engagement Rate */}
        {analytics.totalViews > 0 && (
          <div className="mt-6 p-4 bg-accent-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-600">Engagement Rate</p>
                <p className="text-lg font-semibold text-accent-900">
                  {((analytics.totalInteractions / analytics.totalViews) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-accent-600">
                  {analytics.totalInteractions} interactions / {analytics.totalViews} views
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
