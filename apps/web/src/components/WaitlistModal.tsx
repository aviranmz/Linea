import { useState, useEffect } from 'react';
import { getJson, postJson } from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';

interface WaitlistEntry {
  id: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  position: number;
  user?: {
    id: string;
    name: string;
    businessName?: string;
  };
}

interface Event {
  id: string;
  title: string;
  slug: string;
  capacity?: number;
  currentWaitlist: number;
  startDate: string;
}

interface WaitlistModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ event, isOpen, onClose }: WaitlistModalProps) {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  const [message, setMessage] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && event) {
      loadWaitlist();
    }
  }, [isOpen, event, filters, pagination.page]);

  const loadWaitlist = async () => {
    if (!event) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());

      const data = await getJson<{
        entries: WaitlistEntry[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/api/owner/events/${event.id}/waitlist?${params}`);

      setWaitlistEntries(data.entries || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to load waitlist:', error);
      setMessage('Failed to load waitlist entries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    entryId: string,
    newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  ) => {
    try {
      await postJson(`/api/owner/events/${event?.id}/waitlist/${entryId}`, {
        status: newStatus,
      });
      setMessage('Status updated successfully');
      loadWaitlist(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to update status:', error);
      setMessage('Failed to update status');
    }
  };

  const exportWaitlist = () => {
    if (!event) return;

    const csvContent = [
      ['Position', 'Email', 'Name', 'Status', 'Joined Date'],
      ...waitlistEntries.map(entry => [
        entry.position.toString(),
        entry.email,
        entry.user?.name || '',
        entry.status,
        new Date(entry.createdAt).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_waitlist.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '✅';
      case 'CANCELLED':
        return '❌';
      default:
        return '⏳';
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className='fixed inset-0 z-[9999] overflow-y-auto'>
      <div className='flex min-h-screen items-start justify-center p-4 pt-20'>
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[9998]'
          onClick={onClose}
        />

        {/* Modal */}
        <div className='relative w-full max-w-6xl bg-white rounded-lg shadow-xl z-[10000] max-h-[calc(100vh-8rem)] flex flex-col'>
          {/* Header - Always visible */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg flex-shrink-0'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                Waitlist: {event.title}
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                {event.currentWaitlist} people on waitlist
                {event.capacity && ` • Capacity: ${event.capacity}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className='p-6 border-b border-gray-200 bg-gray-50'>
            <div className='flex flex-wrap gap-4 items-center'>
              <div className='flex-1 min-w-64'>
                <input
                  type='text'
                  placeholder='Search by email or name...'
                  value={filters.search}
                  onChange={e =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
              <select
                value={filters.status}
                onChange={e =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Status</option>
                <option value='PENDING'>Pending</option>
                <option value='CONFIRMED'>Confirmed</option>
                <option value='CANCELLED'>Cancelled</option>
              </select>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={e => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({
                    ...filters,
                    sortBy,
                    sortOrder: sortOrder as 'asc' | 'desc',
                  });
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='createdAt-desc'>Newest First</option>
                <option value='createdAt-asc'>Oldest First</option>
                <option value='position-asc'>Position (Low to High)</option>
                <option value='position-desc'>Position (High to Low)</option>
                <option value='email-asc'>Email A-Z</option>
                <option value='email-desc'>Email Z-A</option>
              </select>
              <button
                onClick={exportWaitlist}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                📊 Export CSV
              </button>
            </div>
          </div>

          {/* Table - Scrollable content */}
          <div className='flex-1 overflow-hidden flex flex-col'>
            <div className='p-6 flex-1 overflow-y-auto'>
              {message && (
                <div className='mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg'>
                  {message}
                </div>
              )}

              {loading ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <span className='ml-3 text-gray-600'>
                    {t('api.loadingWaitlist')}
                  </span>
                </div>
              ) : waitlistEntries.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-gray-400 text-6xl mb-4'>📝</div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {t('api.noWaitlistEntries')}
                  </h3>
                  <p className='text-gray-600'>
                    {t('api.noWaitlistEntriesDescription')}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50 sticky top-0 z-10'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Position
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Contact
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Joined
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {waitlistEntries.map(entry => (
                        <tr key={entry.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <span className='text-sm font-medium text-gray-900'>
                                #{entry.position}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div>
                              <div className='text-sm font-medium text-gray-900'>
                                {entry.email}
                              </div>
                              {entry.user?.name && (
                                <div className='text-sm text-gray-500'>
                                  {entry.user.name}
                                </div>
                              )}
                              {entry.user?.businessName && (
                                <div className='text-xs text-gray-400'>
                                  {entry.user.businessName}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}
                            >
                              {getStatusIcon(entry.status)} {entry.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {new Date(entry.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <div className='flex space-x-2'>
                              {entry.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() =>
                                      updateStatus(entry.id, 'CONFIRMED')
                                    }
                                    className='text-green-600 hover:text-green-900'
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateStatus(entry.id, 'CANCELLED')
                                    }
                                    className='text-red-600 hover:text-red-900'
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {entry.status === 'CONFIRMED' && (
                                <button
                                  onClick={() =>
                                    updateStatus(entry.id, 'PENDING')
                                  }
                                  className='text-yellow-600 hover:text-yellow-900'
                                >
                                  Revert
                                </button>
                              )}
                              {entry.status === 'CANCELLED' && (
                                <button
                                  onClick={() =>
                                    updateStatus(entry.id, 'PENDING')
                                  }
                                  className='text-blue-600 hover:text-blue-900'
                                >
                                  Restore
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-sm text-gray-600'>
                Showing {waitlistEntries.length} of {pagination.total} entries
              </div>
              <div className='flex space-x-3'>
                <button
                  onClick={onClose}
                  className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Close
                </button>
              </div>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className='flex items-center justify-center space-x-2'>
                <button
                  onClick={() =>
                    setPagination(prev => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Previous
                </button>

                <div className='flex space-x-1'>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum =
                        Math.max(
                          1,
                          Math.min(
                            pagination.totalPages - 4,
                            pagination.page - 2
                          )
                        ) + i;
                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() =>
                            setPagination(prev => ({ ...prev, page: pageNum }))
                          }
                          className={`px-3 py-1 text-sm border rounded ${
                            pageNum === pagination.page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setPagination(prev => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
