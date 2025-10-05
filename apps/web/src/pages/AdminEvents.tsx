import { useEffect, useMemo, useState } from 'react'
import { getJson, postJson } from '../lib/api'
import { Event } from '../types/Event'
import { useLanguage } from '../hooks/useLanguage'

type EventsResponse = {
  events: Event[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export default function AdminEvents() {
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const { t } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | 'DRAFT'|'PUBLISHED'|'CANCELLED'|'COMPLETED'>('')
  const [totalPages, setTotalPages] = useState(1)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<'title'|'ownerName'|'waitlistCount'|'status'|'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    return params.toString()
  }, [page, limit, search, status])

  useEffect(() => {
    let mounted = true
    getJson<{ authenticated: boolean; user?: { role?: string } }>('/auth/me')
      .then((res) => { if (!mounted) return; setIsAdmin(!!res.user && res.user.role === 'ADMIN') })
      .catch(() => { if (!mounted) return; setIsAdmin(false) })
      .finally(() => { if (mounted) setAuthLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await getJson<EventsResponse>(`/api/admin/events?${query}`)
        if (!active) return
        setEvents([...data.events])
        setTotalPages(data.pagination.totalPages)
      } catch {
        if (!active) return
        setEvents([])
        setTotalPages(1)
      } finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [query])

  const sortedEvents = useMemo(() => {
    const rows = [...events]
    const dir = sortDir === 'asc' ? 1 : -1
    rows.sort((a,b) => {
      switch (sortKey) {
        case 'title': return a.title.localeCompare(b.title) * dir
        case 'ownerName': return (a.owner?.name || '').localeCompare(b.owner?.name || '') * dir
        case 'waitlistCount': return ((a._count?.waitlist || 0) - (b._count?.waitlist || 0)) * dir
        case 'status': return a.status.localeCompare(b.status) * dir
        case 'createdAt': default: return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      }
    })
    return rows
  }, [events, sortKey, sortDir])

  const setSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const exportCsv = () => {
    const header = ['id','title','slug','ownerName','status','waitlistCount','createdAt']
    const rows = sortedEvents.map(e => [e.id, e.title, e.slug, e.owner?.name || '', e.status, String(e._count?.waitlist || 0), e.createdAt])
    const csv = [header, ...rows].map(r => r.map(v => v.includes(',')?`"${v.replace(/"/g,'""')}"`:v).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `events-page${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const approve = async (id: string) => {
    try {
      setBusyId(id)
      await postJson(`/api/admin/events/${id}/approve`, {})
      setEvents(prev => prev.map(e => e.id===id ? { ...e, status: 'PUBLISHED' } : e))
    } finally { setBusyId(null) }
  }
  const reject = async (id: string) => {
    const reason = prompt(t('admin.events.reasonForRejection')) || undefined
    try {
      setBusyId(id)
      await postJson(`/api/admin/events/${id}/reject`, { reason })
      setEvents(prev => prev.map(e => e.id===id ? { ...e, status: 'CANCELLED' } : e))
    } finally { setBusyId(null) }
  }

  if (authLoading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{t('admin.events.loading')}</div>
  if (!isAdmin) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{t('admin.events.forbidden')}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.events.title')}</h1>
          <p className="text-sm text-gray-600">{t('admin.events.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder={t('admin.events.searchPlaceholder')}
            value={search}
            onChange={(e)=>{ setPage(1); setSearch(e.target.value) }}
          />
          <select
            className="input"
            value={status}
            onChange={(e)=>{ setPage(1); setStatus(e.target.value as '' | 'DRAFT'|'PUBLISHED'|'CANCELLED'|'COMPLETED') }}
          >
            <option value="">{t('admin.events.all')}</option>
            <option value="DRAFT">{t('admin.events.draft')}</option>
            <option value="PUBLISHED">{t('admin.events.published')}</option>
            <option value="CANCELLED">{t('admin.events.cancelled')}</option>
            <option value="COMPLETED">{t('admin.events.completed')}</option>
          </select>
          <button className="btn btn-outline" onClick={exportCsv}>{t('admin.events.exportCsv')}</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={()=>setSort('title')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">{t('admin.events.event')}</th>
              <th onClick={()=>setSort('ownerName')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">{t('admin.events.owner')}</th>
              <th onClick={()=>setSort('waitlistCount')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">{t('admin.events.waitlist')}</th>
              <th onClick={()=>setSort('status')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">{t('admin.events.status')}</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={5}>{t('admin.events.loading')}</td></tr>
            ) : sortedEvents.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={5}>{t('admin.events.noEventsFound')}</td></tr>
            ) : sortedEvents.map(ev => (
              <tr key={ev.id}>
                <td className="px-4 py-2">
                  <div className="text-sm font-medium text-gray-900">{ev.title}</div>
                  <div className="text-xs text-gray-500">/{ev.slug}</div>
                </td>
                <td className="px-4 py-2 text-sm">{ev.owner?.name || 'N/A'}</td>
                <td className="px-4 py-2 text-sm">{ev._count?.waitlist || 0}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{ev.status}</span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-outline" disabled={busyId===ev.id} onClick={()=>approve(ev.id)}>{t('admin.events.approve')}</button>
                    <button className="btn btn-outline" disabled={busyId===ev.id} onClick={()=>reject(ev.id)}>{t('admin.events.reject')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <button 
              className="btn btn-outline" 
              disabled={page <= 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              {t('admin.events.previous')}
            </button>
            <button 
              className="btn btn-outline ml-3" 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
            >
              {t('admin.events.next')}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {t('admin.events.showing')} <span className="font-medium">{((page - 1) * limit) + 1}</span> {t('admin.events.to')}{' '}
                <span className="font-medium">{Math.min(page * limit, events.length)}</span> {t('admin.events.of')}{' '}
                <span className="font-medium">{events.length}</span> {t('admin.events.results')}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.events.previous')}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                  if (pageNum > totalPages) return null
                  
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
                  )
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.events.next')}
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


