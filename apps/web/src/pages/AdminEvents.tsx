import { useEffect, useMemo, useState } from 'react'
import { getJson, postJson } from '../lib/api'

type EventRow = {
  id: string
  title: string
  slug: string
  status: 'DRAFT'|'PUBLISHED'|'CANCELLED'|'COMPLETED'
  ownerName: string
  waitlistCount: number
  createdAt: string
}

type EventsResponse = {
  events: EventRow[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export default function AdminEvents() {
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [events, setEvents] = useState<EventRow[]>([])
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
        case 'ownerName': return a.ownerName.localeCompare(b.ownerName) * dir
        case 'waitlistCount': return (a.waitlistCount - b.waitlistCount) * dir
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
    const rows = sortedEvents.map(e => [e.id, e.title, e.slug, e.ownerName, e.status, String(e.waitlistCount), e.createdAt])
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
    const reason = prompt('Reason for rejection (optional)') || undefined
    try {
      setBusyId(id)
      await postJson(`/api/admin/events/${id}/reject`, { reason })
      setEvents(prev => prev.map(e => e.id===id ? { ...e, status: 'CANCELLED' } : e))
    } finally { setBusyId(null) }
  }

  if (authLoading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading...</div>
  if (!isAdmin) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Forbidden: Admins only.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Admin • Events</h1>
          <p className="text-sm text-gray-600">Review and moderate events</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Search title or description"
            value={search}
            onChange={(e)=>{ setPage(1); setSearch(e.target.value) }}
          />
          <select
            className="input"
            value={status}
            onChange={(e)=>{ setPage(1); setStatus(e.target.value as '' | 'DRAFT'|'PUBLISHED'|'CANCELLED'|'COMPLETED') }}
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button className="btn btn-outline" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={()=>setSort('title')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Event</th>
              <th onClick={()=>setSort('ownerName')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Owner</th>
              <th onClick={()=>setSort('waitlistCount')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Waitlist</th>
              <th onClick={()=>setSort('status')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={5}>Loading...</td></tr>
            ) : sortedEvents.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={5}>No events found.</td></tr>
            ) : sortedEvents.map(ev => (
              <tr key={ev.id}>
                <td className="px-4 py-2">
                  <div className="text-sm font-medium text-gray-900">{ev.title}</div>
                  <div className="text-xs text-gray-500">/{ev.slug}</div>
                </td>
                <td className="px-4 py-2 text-sm">{ev.ownerName}</td>
                <td className="px-4 py-2 text-sm">{ev.waitlistCount}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{ev.status}</span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-outline" disabled={busyId===ev.id} onClick={()=>approve(ev.id)}>Approve</button>
                    <button className="btn btn-outline" disabled={busyId===ev.id} onClick={()=>reject(ev.id)}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button className="btn btn-outline" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button className="btn btn-outline" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}


