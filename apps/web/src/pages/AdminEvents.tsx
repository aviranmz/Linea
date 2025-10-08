import { useEffect, useMemo, useState } from 'react';
import { getJson, postJson } from '../lib/api';
import { Event } from '../types/Event';
import { useLanguage } from '../hooks/useLanguage';

type EventsResponse = {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function AdminEvents() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<
    '' | 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  >('');
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [featured, setFeatured] = useState<'' | 'true' | 'false'>('');
  const [totalPages, setTotalPages] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<
    | 'title'
    | 'ownerName'
    | 'waitlistCount'
    | 'status'
    | 'createdAt'
    | 'startDate'
  >('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (category) params.set('category', category);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (featured) params.set('featured', featured);
    return params.toString();
  }, [page, limit, search, status, category, dateFrom, dateTo, featured]);

  useEffect(() => {
    let mounted = true;
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then(res => {
        if (!mounted) return;
        setIsAdmin(!!res.user && res.user.role === 'ADMIN');
      })
      .catch(() => {
        if (!mounted) return;
        setIsAdmin(false);
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getJson<EventsResponse>(
          `/api/admin/events?${query}`
        );
        if (!active) return;
        setEvents([...data.events]);
        setTotalPages(data.pagination.totalPages);
      } catch {
        if (!active) return;
        setEvents([]);
        setTotalPages(1);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [query]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getJson<{
          categories: Array<{ id: string; name: string }>;
        }>('/api/admin/categories');
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  const sortedEvents = useMemo(() => {
    const rows = [...events];
    const dir = sortDir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      switch (sortKey) {
        case 'title':
          return a.title.localeCompare(b.title) * dir;
        case 'ownerName':
          return (a.owner?.name || '').localeCompare(b.owner?.name || '') * dir;
        case 'waitlistCount':
          return ((a._count?.waitlist || 0) - (b._count?.waitlist || 0)) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'startDate':
          return (
            (new Date(a.startDate).getTime() -
              new Date(b.startDate).getTime()) *
            dir
          );
        case 'createdAt':
        default:
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            dir
          );
      }
    });
    return rows;
  }, [events, sortKey, sortDir]);

  const setSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const exportCsv = () => {
    const header = [
      'id',
      'title',
      'slug',
      'ownerName',
      'status',
      'waitlistCount',
      'createdAt',
    ];
    const rows = sortedEvents.map(e => [
      e.id,
      e.title,
      e.slug,
      e.owner?.name || '',
      e.status,
      String(e._count?.waitlist || 0),
      e.createdAt,
    ]);
    const csv = [header, ...rows]
      .map(r =>
        r
          .map(v => (v.includes(',') ? `"${v.replace(/"/g, '""')}"` : v))
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const approve = async (id: string) => {
    try {
      setBusyId(id);
      await postJson(`/api/admin/events/${id}/approve`, {});
      setEvents(prev =>
        prev.map(e => (e.id === id ? { ...e, status: 'PUBLISHED' } : e))
      );
    } finally {
      setBusyId(null);
    }
  };
  const reject = async (id: string) => {
    const reason = prompt(t('admin.events.reasonForRejection')) || undefined;
    try {
      setBusyId(id);
      await postJson(`/api/admin/events/${id}/reject`, { reason });
      setEvents(prev =>
        prev.map(e => (e.id === id ? { ...e, status: 'CANCELLED' } : e))
      );
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading)
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {t('admin.events.loading')}
      </div>
    );
  if (!isAdmin)
    return (
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {t('admin.events.forbidden')}
      </div>
    );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold'>{t('admin.events.title')}</h1>
        <p className='text-sm text-gray-600'>{t('admin.events.subtitle')}</p>
      </div>

      {/* Filters Section */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {/* Search */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Search
            </label>
            <input
              className='input w-full'
              placeholder={t('admin.events.searchPlaceholder')}
              value={search}
              onChange={e => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          {/* Status Filter */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Status
            </label>
            <select
              className='input w-full'
              value={status}
              onChange={e => {
                setPage(1);
                setStatus(
                  e.target.value as
                    | ''
                    | 'DRAFT'
                    | 'PUBLISHED'
                    | 'CANCELLED'
                    | 'COMPLETED'
                );
              }}
            >
              <option value=''>{t('admin.events.all')}</option>
              <option value='DRAFT'>{t('admin.events.draft')}</option>
              <option value='PUBLISHED'>{t('admin.events.published')}</option>
              <option value='CANCELLED'>{t('admin.events.cancelled')}</option>
              <option value='COMPLETED'>{t('admin.events.completed')}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Category
            </label>
            <select
              className='input w-full'
              value={category}
              onChange={e => {
                setPage(1);
                setCategory(e.target.value);
              }}
            >
              <option value=''>All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Type
            </label>
            <select
              className='input w-full'
              value={featured}
              onChange={e => {
                setPage(1);
                setFeatured(e.target.value as '' | 'true' | 'false');
              }}
            >
              <option value=''>All Events</option>
              <option value='true'>Featured Only</option>
              <option value='false'>Non-Featured</option>
            </select>
          </div>

          {/* Date From */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              From Date
            </label>
            <input
              type='date'
              className='input w-full'
              value={dateFrom}
              onChange={e => {
                setPage(1);
                setDateFrom(e.target.value);
              }}
            />
          </div>

          {/* Date To */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              To Date
            </label>
            <input
              type='date'
              className='input w-full'
              value={dateTo}
              onChange={e => {
                setPage(1);
                setDateTo(e.target.value);
              }}
            />
          </div>

          {/* Export Button */}
          <div className='space-y-2 flex items-end'>
            <button className='btn btn-outline w-full' onClick={exportCsv}>
              {t('admin.events.exportCsv')}
            </button>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                onClick={() => setSort('title')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                {t('admin.events.event')}
              </th>
              <th
                onClick={() => setSort('ownerName')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                {t('admin.events.owner')}
              </th>
              <th
                onClick={() => setSort('waitlistCount')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                {t('admin.events.waitlist')}
              </th>
              <th
                onClick={() => setSort('startDate')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                Start Date
              </th>
              <th
                onClick={() => setSort('status')}
                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              >
                {t('admin.events.status')}
              </th>
              <th className='px-4 py-2' />
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td className='px-4 py-6' colSpan={6}>
                  {t('admin.events.loading')}
                </td>
              </tr>
            ) : sortedEvents.length === 0 ? (
              <tr>
                <td className='px-4 py-6' colSpan={6}>
                  {t('admin.events.noEventsFound')}
                </td>
              </tr>
            ) : (
              sortedEvents.map(ev => (
                <tr key={ev.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2'>
                    <div className='text-sm font-medium text-gray-900'>
                      <a 
                        href={`/events/${ev.slug}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 hover:underline'
                      >
                        {ev.title}
                      </a>
                    </div>
                    <div className='text-xs text-gray-500'>/{ev.slug}</div>
                    {ev.featured && (
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1'>
                        ⭐ Featured
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-2 text-sm'>
                    {ev.owner?.name || 'N/A'}
                  </td>
                  <td className='px-4 py-2 text-sm'>
                    {ev._count?.waitlist || 0}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-500'>
                    {ev.startDate ? new Date(ev.startDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className='px-4 py-2'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ev.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : ev.status === 'DRAFT'
                            ? 'bg-gray-100 text-gray-800'
                            : ev.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : ev.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className='px-4 py-2 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        className='btn btn-outline'
                        disabled={busyId === ev.id}
                        onClick={() => approve(ev.id)}
                      >
                        {t('admin.events.approve')}
                      </button>
                      <button
                        className='btn btn-outline'
                        disabled={busyId === ev.id}
                        onClick={() => reject(ev.id)}
                      >
                        {t('admin.events.reject')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between mt-6'>
          <div className='flex items-center'>
            <button
              className='btn btn-outline'
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              {t('admin.events.previous')}
            </button>
            <button
              className='btn btn-outline ml-3'
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              {t('admin.events.next')}
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                {t('admin.events.showing')}{' '}
                <span className='font-medium'>{(page - 1) * limit + 1}</span>{' '}
                {t('admin.events.to')}{' '}
                <span className='font-medium'>
                  {Math.min(page * limit, events.length)}
                </span>{' '}
                {t('admin.events.of')}{' '}
                <span className='font-medium'>{events.length}</span>{' '}
                {t('admin.events.results')}
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'
              >
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {t('admin.events.previous')}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {t('admin.events.next')}
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
