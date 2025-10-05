import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getJson } from '../lib/api'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '../hooks/useLanguage'

export function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: { email: string; role?: string } } | null>(null)
  const { t } = useLanguage()

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

  const signOut = async () => {
    try {
      await fetch('/auth/signout', { method: 'POST', credentials: 'include' })
    } catch {
      // Ignore signout errors
    }
    // Refresh auth state
    try {
      const me = await getJson<{ authenticated: boolean; user?: { email: string } }>('/auth/me')
      setAuth(me)
    } catch {
      setAuth({ authenticated: false })
    }
  }

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-milano border-b border-neutral-200/50 sticky top-0 z-50 transition-colors duration-300">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-milano">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-display font-semibold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
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
                  ? 'text-accent-600 bg-accent-50' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('nav.events')}
            </Link>
            <Link 
              to="/designers" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/designers') 
                  ? 'text-accent-600 bg-accent-50' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('nav.designers')}
            </Link>
            {auth?.authenticated && (
              <Link 
                to="/favorites" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/favorites') 
                    ? 'text-accent-600 bg-accent-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {t('nav.favorites')}
              </Link>
            )}
            <Link 
              to="/salone-del-mobile" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/salone-del-mobile') 
                  ? 'text-accent-600 bg-accent-50' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('nav.salone')}
            </Link>
            {auth?.authenticated && (auth.user?.role === 'OWNER' || auth.user?.role === 'ADMIN') && (
              <Link 
                to="/owner" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/owner') 
                    ? 'text-accent-600 bg-accent-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {t('nav.owner')}
              </Link>
            )}
            {auth?.authenticated && auth.user?.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/admin') 
                    ? 'text-accent-600 bg-accent-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          {/* Right side actions */}
        <div className="flex items-center space-x-3">
            {/* Favorites Heart Icon */}
            <Link 
              to="/favorites" 
              className={`hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                isActive('/favorites') 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-neutral-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title={t('nav.favorites')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </Link>

            <LanguageSwitcher className="hidden md:block" />

          {auth?.authenticated && (
            <div className="hidden md:flex items-center text-sm text-neutral-600 mr-2">
              <span className="truncate max-w-[160px]">{auth.user?.email}</span>
                  <button onClick={signOut} className="ml-3 px-2 py-1 text-xs rounded border border-neutral-300 hover:bg-neutral-100">
                    {t('nav.signOut')}
                  </button>
            </div>
          )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors duration-200"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-neutral-200">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-accent-600 bg-accent-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.events')}
                  </Link>
              <Link
                to="/designers"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/designers') 
                    ? 'text-accent-600 bg-accent-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.designers')}
                  </Link>
              {auth?.authenticated && (
                <Link
                  to="/favorites"
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive('/favorites') 
                      ? 'text-accent-600 bg-accent-50' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.favorites')}
                    </Link>
              )}
              <Link
                to="/salone-del-mobile"
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive('/salone-del-mobile') 
                    ? 'text-accent-600 bg-accent-50' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.salone')}
                  </Link>
              {auth?.authenticated && (auth.user?.role === 'OWNER' || auth.user?.role === 'ADMIN') && (
                <Link
                  to="/owner"
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive('/owner') 
                      ? 'text-accent-600 bg-accent-50' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.owner')}
                    </Link>
              )}
              {auth?.authenticated && auth.user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive('/admin') 
                      ? 'text-accent-600 bg-accent-50' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.admin')}
                    </Link>
              )}
              <div className="px-4 py-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
