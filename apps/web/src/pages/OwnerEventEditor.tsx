import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getJson, putJson } from '../lib/api'

type EventDto = {
  id: string
  title: string
  description?: string | null
  shortDescription?: string | null
  startDate: string
  endDate?: string | null
  capacity?: number | null
  isPublic?: boolean
  featured?: boolean
  metadata?: Metadata | null
}

type Metadata = {
  productName?: string | null
  heroImageUrl?: string | null
  longDescription?: string | null
  valueProposition?: string | null
  features?: string[]
  awards?: string[]
  social?: {
    instagram?: string
    tiktok?: string
    facebook?: string
    linkedin?: string
  }
  videoUrl?: string | null
  pressKitUrl?: string | null
  contact?: {
    email?: string
    phone?: string
  }
  schedule?: Array<{ title: string; startsAt: string; endsAt?: string }>
  qrUrl?: string | null
}

export default function OwnerEventEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [ev, setEv] = useState<EventDto | null>(null)
  const [tab, setTab] = useState<'basics'|'product'|'media'|'social'|'schedule'>('basics')

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getJson<{ event: EventDto }>(`/api/events/${id}`)
        if (active) setEv(res.event)
      } finally { if (active) setLoading(false) }
    }
    if (id) load()
    return () => { active = false }
  }, [id])

  const meta = useMemo<Metadata>(() => ({ ...(ev?.metadata || {}) }), [ev])

  const update = (patch: Partial<EventDto>) => setEv(prev => prev ? ({ ...prev, ...patch }) : prev)
  const updateMeta = (patch: Partial<Metadata>) => setEv(prev => prev ? ({ ...prev, metadata: { ...(prev.metadata || {}), ...patch } }) : prev)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ev || !id) return
    setSaving(true)
    setMessage(null)
    try {
      await putJson(`/api/owner/events/${id}`, {
        title: ev.title,
        description: ev.description ?? null,
        shortDescription: ev.shortDescription ?? null,
        startDate: ev.startDate,
        endDate: ev.endDate ?? null,
        capacity: typeof ev.capacity === 'number' ? ev.capacity : (ev.capacity ? Number(ev.capacity) : null),
        isPublic: !!ev.isPublic,
        featured: !!ev.featured,
        // metadata fields
        productName: meta.productName ?? null,
        heroImageUrl: meta.heroImageUrl ?? null,
        longDescription: meta.longDescription ?? null,
        valueProposition: meta.valueProposition ?? null,
        features: Array.isArray(meta.features) ? meta.features : (typeof meta.features === 'string' ? String(meta.features).split('\n').map((s)=>s.trim()).filter(Boolean) : []),
        awards: Array.isArray(meta.awards) ? meta.awards : (typeof meta.awards === 'string' ? String(meta.awards).split('\n').map((s)=>s.trim()).filter(Boolean) : []),
        social: meta.social || null,
        videoUrl: meta.videoUrl ?? null,
        pressKitUrl: meta.pressKitUrl ?? null,
        contact: meta.contact || null,
        schedule: Array.isArray(meta.schedule) ? meta.schedule : [],
        qrUrl: meta.qrUrl ?? null,
      })
      setMessage('Saved!')
    } catch {
      setMessage('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !ev) {
    return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <button className="btn btn-outline" onClick={()=>navigate(-1)}>Back</button>
      </div>

      <div className="mb-4 border-b border-gray-200">
        {(['basics','product','media','social','schedule'] as const).map(t => (
          <button key={t} className={`px-3 py-2 mr-2 text-sm ${tab===t?'border-b-2 border-indigo-600 font-medium':'text-gray-600'}`} onClick={()=>setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-6">
        {tab==='basics' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input className="input w-full" value={ev.title} onChange={(e)=>update({ title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Short Description</label>
              <input className="input w-full" value={ev.shortDescription||''} onChange={(e)=>update({ shortDescription: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea className="input w-full" rows={4} value={ev.description||''} onChange={(e)=>update({ description: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input type="datetime-local" className="input w-full" value={new Date(ev.startDate).toISOString().slice(0,16)} onChange={(e)=>update({ startDate: new Date(e.target.value).toISOString() })} />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input type="datetime-local" className="input w-full" value={ev.endDate ? new Date(ev.endDate).toISOString().slice(0,16) : ''} onChange={(e)=>update({ endDate: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm mb-1">Capacity</label>
                <input type="number" className="input w-full" value={ev.capacity ?? ''} onChange={(e)=>update({ capacity: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!ev.isPublic} onChange={(e)=>update({ isPublic: e.target.checked })}/> Public</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!ev.featured} onChange={(e)=>update({ featured: e.target.checked })}/> Featured</label>
            </div>
          </div>
        )}

        {tab==='product' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Product Name</label>
              <input className="input w-full" value={meta.productName || ''} onChange={(e)=>updateMeta({ productName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Value Proposition</label>
              <input className="input w-full" value={meta.valueProposition || ''} onChange={(e)=>updateMeta({ valueProposition: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Long Description</label>
              <textarea className="input w-full" rows={5} value={meta.longDescription || ''} onChange={(e)=>updateMeta({ longDescription: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Features (one per line)</label>
                <textarea className="input w-full" rows={4} value={(meta.features || []).join('\n')} onChange={(e)=>updateMeta({ features: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean) })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Awards (one per line)</label>
                <textarea className="input w-full" rows={4} value={(meta.awards || []).join('\n')} onChange={(e)=>updateMeta({ awards: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean) })} />
              </div>
            </div>
          </div>
        )}

        {tab==='media' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Hero Image URL</label>
              <input className="input w-full" value={meta.heroImageUrl || ''} onChange={(e)=>updateMeta({ heroImageUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Product Video URL (YouTube/Vimeo)</label>
              <input className="input w-full" value={meta.videoUrl || ''} onChange={(e)=>updateMeta({ videoUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Press Kit URL</label>
              <input className="input w-full" value={meta.pressKitUrl || ''} onChange={(e)=>updateMeta({ pressKitUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">QR Image URL</label>
              <input className="input w-full" value={meta.qrUrl || ''} onChange={(e)=>updateMeta({ qrUrl: e.target.value })} />
            </div>
          </div>
        )}

        {tab==='social' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Instagram</label>
                <input className="input w-full" value={meta.social?.instagram || ''} onChange={(e)=>updateMeta({ social: { ...(meta.social || {}), instagram: e.target.value } })} />
              </div>
              <div>
                <label className="block text-sm mb-1">TikTok</label>
                <input className="input w-full" value={meta.social?.tiktok || ''} onChange={(e)=>updateMeta({ social: { ...(meta.social || {}), tiktok: e.target.value } })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Facebook</label>
                <input className="input w-full" value={meta.social?.facebook || ''} onChange={(e)=>updateMeta({ social: { ...(meta.social || {}), facebook: e.target.value } })} />
              </div>
              <div>
                <label className="block text-sm mb-1">LinkedIn</label>
                <input className="input w-full" value={meta.social?.linkedin || ''} onChange={(e)=>updateMeta({ social: { ...(meta.social || {}), linkedin: e.target.value } })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Contact Email</label>
                <input className="input w-full" value={meta.contact?.email || ''} onChange={(e)=>updateMeta({ contact: { ...(meta.contact || {}), email: e.target.value } })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact Phone</label>
                <input className="input w-full" value={meta.contact?.phone || ''} onChange={(e)=>updateMeta({ contact: { ...(meta.contact || {}), phone: e.target.value } })} />
              </div>
            </div>
          </div>
        )}

        {tab==='schedule' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">(Optional) Add schedule items via CSV later. For now, save other changes.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </form>
    </div>
  )
}


