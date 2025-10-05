import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getJson } from '../lib/api'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [actualTheme, setActualTheme] = useState<'light'>('light')

  useEffect(() => {
    // Always use light theme
    setTheme('light')
    setActualTheme('light')
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    
    // Always use light theme - remove any dark classes
    setActualTheme('light')
    root.classList.remove('dark')
    
    // Save theme preference
    localStorage.setItem('theme', 'light')
  }, [theme])

  // Load owner theme variables (colors, typography, logo) once on mount
  useEffect(() => {
    getJson<{ theme: Record<string,string> | null }>('/api/owner/theme')
      .then((res) => {
        const t = res.theme || {}
        const root = window.document.documentElement
        
        // Colors
        if (t.primary) root.style.setProperty('--color-primary', String(t.primary))
        if (t.secondary) root.style.setProperty('--color-secondary', String(t.secondary))
        if (t.text) root.style.setProperty('--color-text', String(t.text))
        if (t.background) root.style.setProperty('--color-bg', String(t.background))
        
        // Typography
        if (t.fontFamily) root.style.setProperty('--font-family', String(t.fontFamily))
        if (t.fontSize) root.style.setProperty('--font-size', String(t.fontSize))
        if (t.fontWeight) root.style.setProperty('--font-weight', String(t.fontWeight))
        
        // Logo
        if (t.logo) root.style.setProperty('--owner-logo', `url(${String(t.logo)})`)
      })
      .catch(() => {})
  }, [])


  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
