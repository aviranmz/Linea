import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ] as const

  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        <span className="text-lg">{currentTheme.icon}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-neutral-800 rounded-lg shadow-milano-lg border border-neutral-200 dark:border-neutral-700 z-20 animate-scale-in">
            <div className="py-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value as 'light' | 'dark' | 'system')
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                    theme === themeOption.value
                      ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/20 dark:text-accent-400'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="mr-3 text-base">{themeOption.icon}</span>
                  {themeOption.label}
                  {theme === themeOption.value && (
                    <span className="ml-auto text-accent-600 dark:text-accent-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

