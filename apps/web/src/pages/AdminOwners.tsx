import { useEffect, useMemo, useState } from 'react'
import { getJson } from '../lib/api'

type OwnerRow = {
  id: string
  email: string
  name: string | null
  organizationName: string | null
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  eventCount: number
}

type OwnersResponse = {
  owners: OwnerRow[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export default function AdminOwners() {
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [owners, setOwners] = useState<OwnerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | 'ACTIVE' | 'SUSPENDED'>('')
  const [totalPages, setTotalPages] = useState(1)
  const [sortKey, setSortKey] = useState<'name'|'email'|'eventCount'|'status'|'createdAt'>('createdAt')
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
        const data = await getJson<OwnersResponse>(`/api/admin/owners?${query}`)
        if (!active) return
        const rows = [...data.owners]
        setOwners(rows)
        setTotalPages(data.pagination.totalPages)
      } catch {
        if (!active) return
        setOwners([])
        setTotalPages(1)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [query])

  const sortedOwners = useMemo(() => {
    const rows = [...owners]
    rows.sort((a,b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'name': return ((a.name||'').localeCompare(b.name||'')) * dir
        case 'email': return a.email.localeCompare(b.email) * dir
        case 'eventCount': return (a.eventCount - b.eventCount) * dir
        case 'status': return a.status.localeCompare(b.status) * dir
        case 'createdAt': default: return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      }
    })
    return rows
  }, [owners, sortKey, sortDir])

  const setSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const exportCsv = () => {
    const header = ['id','email','name','status','createdAt','eventCount']
    const rows = sortedOwners.map(o => [o.id, o.email, o.name||'', o.status, o.createdAt, String(o.eventCount)])
    const csv = [header, ...rows].map(r => r.map(v => v.includes(',')?`"${v.replace(/"/g,'""')}"`:v).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `owners-page${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (authLoading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading...</div>
  if (!isAdmin) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Forbidden: Admins only.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Admin • Owners</h1>
          <p className="text-sm text-gray-600">Manage owner accounts</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Search email or name"
            value={search}
            onChange={(e)=>{ setPage(1); setSearch(e.target.value) }}
          />
          <select
            className="input"
            value={status}
            onChange={(e)=>{ setPage(1); setStatus(e.target.value as '' | 'ACTIVE' | 'SUSPENDED') }}
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button className="btn btn-outline" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={()=>setSort('name')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Owner</th>
              <th onClick={()=>setSort('eventCount')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Events</th>
              <th onClick={()=>setSort('status')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Status</th>
              <th onClick={()=>setSort('createdAt')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={4}>Loading...</td></tr>
            ) : sortedOwners.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={4}>No owners found.</td></tr>
            ) : sortedOwners.map(o => (
              <tr key={o.id}>
                <td className="px-4 py-2">
                  <div className="text-sm font-medium text-gray-900">{o.name || '—'}</div>
                  <div className="text-xs text-gray-500">{o.email}</div>
                </td>
                <td className="px-4 py-2 text-sm">{o.eventCount}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${o.status==='ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
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


