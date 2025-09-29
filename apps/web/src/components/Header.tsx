import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getJson } from '../lib/api'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string } } | null>(null)

  useEffect(() => {
    getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      .then(setAuth)
      .catch(() => setAuth({ authenticated: false }))
  }, [])

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-milano border-b border-neutral-200/50 dark:border-neutral-700/50 sticky top-0 z-50 transition-colors duration-300">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-milano">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-display font-semibold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
                Linea
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Events
            </Link>
            <Link 
              to="/designers" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/designers') 
                  ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Designers
            </Link>
            <Link 
              to="/salone-del-mobile" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/salone-del-mobile') 
                  ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Salone del Mobile
            </Link>
            <Link 
              to="/owner" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/owner') 
                  ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Owner Portal
            </Link>
            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/admin') 
                  ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Right side actions */}
        <div className="flex items-center space-x-2">
            <ThemeToggle />

          {auth?.authenticated && (
            <div className="hidden md:flex items-center text-sm text-neutral-600 dark:text-neutral-300 mr-2">
              <span className="truncate max-w-[160px]">{auth.user?.email}</span>
            </div>
          )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

               {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-700">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/designers"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/designers') 
                    ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Designers
              </Link>
              <Link
                to="/salone-del-mobile"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/salone-del-mobile') 
                    ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Salone del Mobile
              </Link>
              <Link
                to="/owner"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/owner') 
                    ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Owner Portal
              </Link>
              <Link
                to="/admin"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/admin') 
                    ? 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 dark:text-accent-400' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
