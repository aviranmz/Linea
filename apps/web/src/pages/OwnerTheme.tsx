import React, { useEffect, useState } from 'react'
import { getJson, putJson } from '../lib/api'
import { useLanguage } from '../hooks/useLanguage'

type Theme = {
  primary?: string
  secondary?: string
  text?: string
  background?: string
  logo?: string
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
}

export default function OwnerTheme() {
  const [theme, setTheme] = useState<Theme>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    getJson<{ theme: Theme | null }>('/api/owner/theme').then(r => {
      const themeData = r.theme || {}
      setTheme(themeData)
      if (themeData.logo) {
        setLogoPreview(themeData.logo)
      }
    }).catch(() => {})
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogoPreview(result)
        setTheme({ ...theme, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Customize Theme</h1>
      <form onSubmit={save} className="space-y-8">
        {/* Colors Section */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Primary Color</label>
              <input type="color" value={theme.primary || '#4f46e5'} onChange={(e)=>setTheme({ ...theme, primary: e.target.value })} className="w-full h-10 rounded border" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Secondary Color</label>
              <input type="color" value={theme.secondary || '#a855f7'} onChange={(e)=>setTheme({ ...theme, secondary: e.target.value })} className="w-full h-10 rounded border" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Text Color</label>
              <input type="color" value={theme.text || '#111827'} onChange={(e)=>setTheme({ ...theme, text: e.target.value })} className="w-full h-10 rounded border" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Background</label>
              <input type="color" value={theme.background || '#ffffff'} onChange={(e)=>setTheme({ ...theme, background: e.target.value })} className="w-full h-10 rounded border" />
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Upload Logo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
                className="w-full p-2 border rounded"
              />
            </div>
            {logoPreview && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Preview</label>
                <img src={logoPreview} alt={t('theme.logoPreview')} className="max-h-20 max-w-40 object-contain border rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Typography Section */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Font Family</label>
              <select 
                value={theme.fontFamily || 'Inter'} 
                onChange={(e)=>setTheme({ ...theme, fontFamily: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="Inter">{t('theme.fontInter')}</option>
                <option value="Roboto">{t('theme.fontRoboto')}</option>
                <option value="Open Sans">{t('theme.fontOpenSans')}</option>
                <option value="Lato">{t('theme.fontLato')}</option>
                <option value="Montserrat">{t('theme.fontMontserrat')}</option>
                <option value="Poppins">{t('theme.fontPoppins')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Font Size</label>
              <select 
                value={theme.fontSize || '16px'} 
                onChange={(e)=>setTheme({ ...theme, fontSize: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="14px">Small (14px)</option>
                <option value="16px">Medium (16px)</option>
                <option value="18px">Large (18px)</option>
                <option value="20px">Extra Large (20px)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Font Weight</label>
              <select 
                value={theme.fontWeight || '400'} 
                onChange={(e)=>setTheme({ ...theme, fontWeight: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div 
            className="p-6 rounded-lg border-2 border-dashed"
            style={{
              backgroundColor: theme.background || '#ffffff',
              color: theme.text || '#111827',
              fontFamily: theme.fontFamily || 'Inter',
              fontSize: theme.fontSize || '16px',
              fontWeight: theme.fontWeight || '400'
            }}
          >
            <div className="flex items-center mb-4">
              {logoPreview && (
                <img src={logoPreview} alt={t('theme.logo')} className="h-8 mr-3" />
              )}
              <h3 className="text-2xl font-bold" style={{ color: theme.primary || '#4f46e5' }}>Your Brand</h3>
            </div>
            <p className="mb-4">This is how your content will look with the selected theme.</p>
            <button 
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: theme.primary || '#4f46e5' }}
            >
              Primary Button
            </button>
            <button 
              className="px-4 py-2 rounded ml-2 border"
              style={{ 
                color: theme.secondary || '#a855f7',
                borderColor: theme.secondary || '#a855f7'
              }}
            >
              Secondary Button
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Theme'}</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </form>
    </div>
  )
}


