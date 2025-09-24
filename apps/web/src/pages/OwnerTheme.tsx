import React, { useEffect, useState } from 'react'
import { getJson, putJson } from '../lib/api'

type Theme = {
  primary?: string
  secondary?: string
  text?: string
  background?: string
}

export default function OwnerTheme() {
  const [theme, setTheme] = useState<Theme>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    getJson<{ theme: Theme | null }>('/api/owner/theme').then(r => setTheme(r.theme || {})).catch(() => {})
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await putJson('/api/owner/theme', theme)
      setMessage('Saved!')
    } catch (err) {
      setMessage('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Customize Theme</h1>
      <form onSubmit={save} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Primary Color</label>
            <input type="color" value={theme.primary || '#4f46e5'} onChange={(e)=>setTheme({ ...theme, primary: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Secondary Color</label>
            <input type="color" value={theme.secondary || '#a855f7'} onChange={(e)=>setTheme({ ...theme, secondary: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Text Color</label>
            <input type="color" value={theme.text || '#111827'} onChange={(e)=>setTheme({ ...theme, text: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Background</label>
            <input type="color" value={theme.background || '#ffffff'} onChange={(e)=>setTheme({ ...theme, background: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </form>
    </div>
  )
}


