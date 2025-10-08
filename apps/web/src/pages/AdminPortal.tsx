import React, { useState, useEffect } from 'react';
import { postJson, getJson } from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface PlatformStats {
  totalOwners: number;
  totalEvents: number;
  totalWaitlist: number;
  activeEvents: number;
}

export function AdminPortal() {
  const [auth, setAuth] = useState<{
    authenticated: boolean;
    user?: { email: string; role?: string };
  } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    getJson<{
      authenticated: boolean;
      user?: { email: string; role?: string };
    }>('/auth/me')
      .then(authData => {
        setAuth(authData);

        // Redirect owners to owner portal
        if (authData.authenticated && authData.user?.role === 'OWNER') {
          navigate('/owner');
          return;
        }

        // Redirect non-admin users to home
        if (authData.authenticated && authData.user?.role !== 'ADMIN') {
          navigate('/');
          return;
        }
      })
      .catch(() => setAuth({ authenticated: false }));
  }, [navigate]);

  const requestMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    await postJson('/auth/request-magic-link', { email: loginEmail });
    alert(t('api.magicLinkSent'));
  };
  const [stats, setStats] = useState<PlatformStats>({
    totalOwners: 0,
    totalEvents: 0,
    totalWaitlist: 0,
    activeEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load admin data if user is authenticated and has ADMIN role
    if (!auth?.authenticated || auth.user?.role !== 'ADMIN') {
      return;
    }

    const loadOverview = async () => {
      try {
        // Prefer new backend endpoint first
        const dash = await getJson<{
          stats: {
            totalOwners: number;
            totalEvents: number;
            totalWaitlist: number;
            activeRate?: number;
          };
        }>('/api/admin/dashboard');
        setStats({
          totalOwners: dash.stats.totalOwners ?? 0,
          totalEvents: dash.stats.totalEvents ?? 0,
          totalWaitlist: dash.stats.totalWaitlist ?? 0,
          activeEvents: dash.stats.totalEvents ?? 0,
        });
      } catch {
        try {
          // Backward-compat with older API
          const legacy = await getJson<{
            users?: number;
            owners?: number;
            events: number;
            shows?: number;
            waitlist: number;
          }>('/api/admin/overview');
          // Derive owners total from owners endpoint pagination if missing
          let ownersTotal = legacy.owners ?? 0;
          if (!ownersTotal) {
            try {
              const ownersResp = await getJson<{
                owners: unknown[];
                pagination: { total: number };
              }>(`/api/admin/owners?page=1&limit=1`);
              ownersTotal = ownersResp.pagination?.total ?? 0;
            } catch {
              ownersTotal = 0;
            }
          }
          setStats({
            totalOwners: ownersTotal,
            totalEvents: legacy.events,
            totalWaitlist: legacy.waitlist,
            activeEvents: legacy.events,
          });
        } catch {
          // Fallback defaults
          setStats({
            totalOwners: 0,
            totalEvents: 0,
            totalWaitlist: 0,
            activeEvents: 0,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, [auth?.authenticated, auth?.user?.role]);

  // Show loading while checking authentication
  if (auth === null) {
    return (
      <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect non-authenticated users to login
  if (!auth?.authenticated) {
    return (
      <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='heading-2 mb-4'>{t('admin.login')}</h1>
        <p className='text-body mb-6'>{t('admin.loginDescription')}</p>
        <form onSubmit={requestMagic} className='space-y-4'>
          <input
            type='email'
            className='input w-full'
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            placeholder='admin@linea.app'
            required
          />
          <button type='submit' className='btn btn-primary w-full'>
            {t('admin.sendMagicLink')}
          </button>
        </form>
      </div>
    );
  }

  // Redirect non-admin users (this should not happen due to useEffect redirect, but just in case)
  if (auth.user?.role !== 'ADMIN') {
    return (
      <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Access Denied
          </h1>
          <p className='text-gray-600 mb-6'>
            You don't have permission to access the admin portal.
          </p>
          <button onClick={() => navigate('/')} className='btn btn-primary'>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-milano-cream via-white to-milano-sage/5'>
      {/* Professional Header */}
      <div className='bg-white/95 backdrop-blur-md border-b border-neutral-200/50 shadow-milano'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-6'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-milano'>
                <span className='text-white font-bold text-xl'>L</span>
              </div>
              <div>
                <h1 className='text-3xl font-display font-semibold text-neutral-900'>
                  {t('admin.portal')}
                </h1>
                <p className='text-neutral-600 mt-1'>
                  {t('admin.portalDescription')}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <p className='text-sm text-neutral-500'>Logged in as</p>
                <p className='font-medium text-neutral-900'>
                  {auth.user?.email}
                </p>
              </div>
              <div className='w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center'>
                <span className='text-white font-semibold text-sm'>
                  {auth.user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Enhanced Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          <div className='card group hover:shadow-milano-lg transition-all duration-300'>
            <div className='p-8'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <svg
                    className='w-7 h-7 text-accent-600'
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
                <div className='text-right'>
                  <div className='w-3 h-3 bg-accent-500 rounded-full animate-pulse'></div>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-600 mb-2'>
                  {'Total Owners'}
                </p>
                <p className='text-3xl font-display font-semibold text-neutral-900 mb-1'>
                  {loading ? '...' : stats.totalOwners.toLocaleString()}
                </p>
                <p className='text-xs text-neutral-500'>Registered owners</p>
              </div>
            </div>
          </div>

          <div className='card group hover:shadow-milano-lg transition-all duration-300'>
            <div className='p-8'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-milano-terracotta/10 to-milano-terracotta/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <svg
                    className='w-7 h-7 text-milano-terracotta'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div className='text-right'>
                  <div className='w-3 h-3 bg-milano-terracotta rounded-full animate-pulse'></div>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-600 mb-2'>
                  {t('admin.totalEvents')}
                </p>
                <p className='text-3xl font-display font-semibold text-neutral-900 mb-1'>
                  {loading ? '...' : stats.totalEvents.toLocaleString()}
                </p>
                <p className='text-xs text-neutral-500'>Total events</p>
              </div>
            </div>
          </div>

          <div className='card group hover:shadow-milano-lg transition-all duration-300'>
            <div className='p-8'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-milano-sage/10 to-milano-sage/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <svg
                    className='w-7 h-7 text-milano-sage'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <div className='text-right'>
                  <div className='w-3 h-3 bg-milano-sage rounded-full animate-pulse'></div>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-600 mb-2'>
                  {t('admin.totalWaitlist')}
                </p>
                <p className='text-3xl font-display font-semibold text-neutral-900 mb-1'>
                  {loading ? '...' : stats.totalWaitlist.toLocaleString()}
                </p>
                <p className='text-xs text-neutral-500'>Waitlist entries</p>
              </div>
            </div>
          </div>

          <div className='card group hover:shadow-milano-lg transition-all duration-300'>
            <div className='p-8'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-milano-gold/10 to-milano-gold/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                  <svg
                    className='w-7 h-7 text-milano-gold'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <div className='text-right'>
                  <div className='w-3 h-3 bg-milano-gold rounded-full animate-pulse'></div>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-600 mb-2'>
                  {t('admin.activeEvents')}
                </p>
                <p className='text-3xl font-display font-semibold text-neutral-900 mb-1'>
                  {loading ? '...' : stats.activeEvents.toLocaleString()}
                </p>
                <p className='text-xs text-neutral-500'>Currently active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className='card mb-12'>
          <div className='px-8 py-6 border-b border-neutral-200/50'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-display font-semibold text-neutral-900'>
                {t('admin.quickActions')}
              </h2>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-accent-500 rounded-full animate-pulse'></div>
                <span className='text-xs text-neutral-500'>
                  Administrative tools
                </span>
              </div>
            </div>
          </div>
          <div className='p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <a
                href='/admin/users'
                className='group flex items-center p-6 bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-xl border border-accent-200/50 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
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
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-accent-700 transition-colors'>
                    Manage All Users
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    User management and permissions
                  </p>
                </div>
              </a>

              <a
                href='/admin/events'
                className='group flex items-center p-6 bg-gradient-to-br from-milano-sage/5 to-milano-sage/10 rounded-xl border border-milano-sage/20 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-milano-sage to-milano-sage/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-milano-sage transition-colors'>
                    {t('admin.reviewEvents')}
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    Event moderation and approval
                  </p>
                </div>
              </a>

              <a
                href='/admin/categories'
                className='group flex items-center p-6 bg-gradient-to-br from-milano-gold/5 to-milano-gold/10 rounded-xl border border-milano-gold/20 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-milano-gold to-milano-gold/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-milano-gold transition-colors'>
                    {t('admin.manageCategories')}
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    Event categorization system
                  </p>
                </div>
              </a>

              <a
                href='/admin/areas'
                className='group flex items-center p-6 bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-xl border border-accent-200/50 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-accent-700 transition-colors'>
                    {t('admin.manageAreas')}
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    Geographic regions and zones
                  </p>
                </div>
              </a>

              <a
                href='/admin/products'
                className='group flex items-center p-6 bg-gradient-to-br from-milano-terracotta/5 to-milano-terracotta/10 rounded-xl border border-milano-terracotta/20 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-milano-terracotta to-milano-terracotta/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-milano-terracotta transition-colors'>
                    {t('admin.manageProducts')}
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    Product catalog management
                  </p>
                </div>
              </a>

              <a
                href='/admin/settings'
                className='group flex items-center p-6 bg-gradient-to-br from-milano-sage/5 to-milano-sage/10 rounded-xl border border-milano-sage/20 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-milano-sage to-milano-sage/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-milano-sage transition-colors'>
                    System Settings
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    Platform configuration
                  </p>
                </div>
              </a>

              <button className='group flex items-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-xl border border-neutral-200/50 hover:shadow-milano-lg hover:scale-[1.02] transition-all duration-200'>
                <div className='w-12 h-12 bg-gradient-to-br from-neutral-500 to-neutral-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-milano'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <h3 className='text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors'>
                    {t('admin.advancedSettings')}
                  </h3>
                  <p className='text-xs text-neutral-600'>
                    {t('admin.comingSoon')}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {/* Recent Activity */}
          <div className='card'>
            <div className='px-8 py-6 border-b border-neutral-200/50'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-display font-semibold text-neutral-900'>
                  {t('admin.recentActivity')}
                </h2>
                <div className='w-2 h-2 bg-accent-500 rounded-full animate-pulse'></div>
              </div>
            </div>
            <div className='p-8'>
              <div className='space-y-6'>
                <div className='flex items-start space-x-4 group'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-gradient-to-br from-milano-sage/10 to-milano-sage/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200'>
                      <svg
                        className='w-6 h-6 text-milano-sage'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-neutral-900 mb-1'>
                      {t('admin.newEventCreated')} "Tech Innovation Summit"
                    </p>
                    <p className='text-xs text-neutral-500 mb-2'>
                      Event created and published
                    </p>
                    <div className='flex items-center space-x-2'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-milano-sage/10 text-milano-sage'>
                        Published
                      </span>
                      <span className='text-xs text-neutral-400'>
                        2 {t('admin.hoursAgo')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-start space-x-4 group'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200'>
                      <svg
                        className='w-6 h-6 text-accent-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-neutral-900 mb-1'>
                      {t('admin.newUserRegistered')} john@example.com
                    </p>
                    <p className='text-xs text-neutral-500 mb-2'>
                      New user account created
                    </p>
                    <div className='flex items-center space-x-2'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700'>
                        Verified
                      </span>
                      <span className='text-xs text-neutral-400'>
                        4 {t('admin.hoursAgo')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-start space-x-4 group'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-gradient-to-br from-milano-terracotta/10 to-milano-terracotta/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200'>
                      <svg
                        className='w-6 h-6 text-milano-terracotta'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-neutral-900 mb-1'>
                      {t('admin.waitlistEntryAdded')} "Design Week 2024"
                    </p>
                    <p className='text-xs text-neutral-500 mb-2'>
                      New waitlist entry submitted
                    </p>
                    <div className='flex items-center space-x-2'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-milano-terracotta/10 text-milano-terracotta'>
                        Pending
                      </span>
                      <span className='text-xs text-neutral-400'>
                        6 {t('admin.hoursAgo')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className='card'>
            <div className='px-8 py-6 border-b border-neutral-200/50'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-display font-semibold text-neutral-900'>
                  {t('admin.systemHealth')}
                </h2>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-milano-sage rounded-full animate-pulse'></div>
                  <span className='text-xs text-neutral-500'>
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
            <div className='p-8'>
              <div className='space-y-6'>
                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-milano-sage/5 to-milano-sage/10 rounded-xl'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-milano-sage/20 rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-milano-sage'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-neutral-900'>
                        {t('admin.apiStatus')}
                      </p>
                      <p className='text-xs text-neutral-600'>
                        REST API endpoints
                      </p>
                    </div>
                  </div>
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-milano-sage/20 text-milano-sage border border-milano-sage/30'>
                    {t('admin.healthy')}
                  </span>
                </div>

                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-milano-sage/5 to-milano-sage/10 rounded-xl'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-milano-sage/20 rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-milano-sage'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-neutral-900'>
                        {t('admin.database')}
                      </p>
                      <p className='text-xs text-neutral-600'>
                        PostgreSQL connection
                      </p>
                    </div>
                  </div>
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-milano-sage/20 text-milano-sage border border-milano-sage/30'>
                    {t('admin.connected')}
                  </span>
                </div>

                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-milano-gold/5 to-milano-gold/10 rounded-xl'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-milano-gold/20 rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-milano-gold'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 10V3L4 14h7v7l9-11h-7z'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-neutral-900'>
                        {t('admin.redisCache')}
                      </p>
                      <p className='text-xs text-neutral-600'>Caching layer</p>
                    </div>
                  </div>
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-milano-gold/20 text-milano-gold border border-milano-gold/30'>
                    {t('admin.notConfigured')}
                  </span>
                </div>

                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-milano-gold/5 to-milano-gold/10 rounded-xl'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-milano-gold/20 rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-milano-gold'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-neutral-900'>
                        {t('admin.emailService')}
                      </p>
                      <p className='text-xs text-neutral-600'>
                        SMTP configuration
                      </p>
                    </div>
                  </div>
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-milano-gold/20 text-milano-gold border border-milano-gold/30'>
                    {t('admin.notConfigured')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
