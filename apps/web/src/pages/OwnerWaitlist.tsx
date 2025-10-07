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
      const loadEvents = async () => {
        try {
          const data = await getJson<{ events: Event[] }>('/api/owner/events');
          setEvents(data.events || []);
          if (data.events && data.events.length > 0) {
            setSelectedEvent(data.events[0]);
          }
        } catch (error) {
          console.error('Failed to load events:', error);
        } finally {
          setLoading(false);
        }
      };
      loadEvents();
    } else {
      setLoading(false);
    }
  }, [auth]);

  const openWaitlistModal = (event: Event) => {
    setSelectedEvent(event);
    setShowWaitlistModal(true);
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
                          {event.capacity
                            ? Math.floor(event.capacity * 0.1)
                            : 0}
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
