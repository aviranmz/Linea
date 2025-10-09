import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson, postJson } from '../lib/api';
import { WaitlistModal } from '../components/WaitlistModal';
import { useLanguage } from '../hooks/useLanguage';

interface Event {
  id: string;
  title: string;
  slug: string;
  capacity?: number;
  currentWaitlist: number;
  startDate: string;
}

export default function OwnerWaitlist() {
  const [auth, setAuth] = useState<{
    authenticated: boolean;
    user?: { email: string };
  } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [message] = useState('');
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }));
  }, []);

  const requestMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    await postJson('/auth/request-magic-link', { email: loginEmail });
    alert(t('waitlist.magicLinkSent'));
  };

  useEffect(() => {
    if (auth?.authenticated) {
      loadEvents();
    } else {
      setLoading(false);
    }
  }, [auth, pagination.page, search, statusFilter]);

  const loadEvents = async () => {
    if (!auth?.authenticated) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const data = await getJson<{ 
        events: Event[]; 
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/api/owner/events?${params}`);
      
      setEvents(data.events || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      if (data.events && data.events.length > 0) {
        setSelectedEvent(data.events[0]);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWaitlistModal = (event: Event) => {
    setSelectedEvent(event);
    setShowWaitlistModal(true);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadEvents();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (!auth?.authenticated) {
    return (
      <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='heading-2 mb-4'>{t('waitlist.ownerLogin')}</h1>
        <p className='text-body mb-6'>{t('waitlist.loginDescription')}</p>
        <form onSubmit={requestMagic} className='space-y-4'>
          <div>
            <label htmlFor='email' className='sr-only'>
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
              className='input w-full'
              placeholder={t('waitlist.enterEmail')}
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary w-full'>
            {t('waitlist.requestMagicLink')}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='animate-pulse space-y-6'>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-40 bg-gray-200 rounded'></div>
          <div className='h-40 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='heading-2'>{t('waitlist.waitlistManagement')}</h1>
        <Link to='/owner' className='btn btn-outline'>
          {t('common.back')} to Dashboard
        </Link>
      </div>

      {message && (
        <div
          className='bg-indigo-100 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-lg mb-6'
          role='alert'
        >
          {message}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className='bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Search */}
          <form onSubmit={handleSearch} className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search events...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='input w-full pl-10'
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </div>
          </form>
          
          {/* Status Filter */}
          <div className='flex gap-2'>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className='input'
            >
              <option value=''>All Status</option>
              <option value='DRAFT'>Draft</option>
              <option value='PUBLISHED'>Published</option>
              <option value='CANCELLED'>Cancelled</option>
              <option value='COMPLETED'>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <svg
              className='mx-auto h-12 w-12'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {t('waitlist.noEvents')}
          </h3>
          <p className='text-gray-500 mb-4'>{t('waitlist.createFirstEvent')}</p>
          <Link to='/owner' className='btn btn-primary'>
            {t('owner.createEvent')}
          </Link>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden'>
          <div className='px-4 sm:px-6 py-4 border-b border-neutral-200'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {t('waitlist.eventsWithWaitlists')}
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              {t('waitlist.clickEventToManage')}
            </p>
          </div>

          <div className='overflow-hidden'>
            <table className='w-full divide-y divide-neutral-200 table-fixed'>
              <thead className='bg-neutral-50'>
                <tr>
                  <th className='px-3 sm:px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-2/5'>
                    {t('waitlist.event')}
                  </th>
                  <th className='px-3 sm:px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/5'>
                    {t('waitlist.date')}
                  </th>
                  <th className='px-3 sm:px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/6'>
                    {t('waitlist.waitlist')}
                  </th>
                  <th className='px-3 sm:px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/6'>
                    {t('waitlist.capacity')}
                  </th>
                  <th className='px-3 sm:px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-1/6'>
                    {t('waitlist.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-neutral-200'>
                {events.map(event => (
                  <tr key={event.id} className='hover:bg-neutral-50'>
                    <td className='px-3 sm:px-4 py-4'>
                      <div className='flex items-center'>
                        <div className='min-w-0 flex-1'>
                          <div className='text-sm font-medium text-gray-900 truncate'>
                            {event.title}
                          </div>
                          <div className='text-sm text-gray-500 truncate'>
                            {event.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className='px-3 sm:px-4 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          {event.currentWaitlist || 0}
                        </span>
                        <span className='text-sm text-gray-500 ml-1'>
                          people
                        </span>
                      </div>
                    </td>
                    <td className='px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {event.capacity ? (
                        <span className='flex items-center'>
                          <span>{event.capacity}</span>
                          <span className='text-gray-500 ml-1'>spots</span>
                        </span>
                      ) : (
                        <span className='text-gray-500'>Unlimited</span>
                      )}
                    </td>
                    <td className='px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => openWaitlistModal(event)}
                        className='text-blue-600 hover:text-blue-900 font-medium'
                      >
                        {t('waitlist.manageWaitlist')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='px-4 sm:px-6 py-4 border-t border-neutral-200 bg-neutral-50'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-700'>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className='px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const startPage = Math.max(1, pagination.page - 2);
                    const pageNum = startPage + i;
                    if (pageNum > pagination.totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className='px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal
        event={selectedEvent}
        isOpen={showWaitlistModal}
        onClose={() => {
          setShowWaitlistModal(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
