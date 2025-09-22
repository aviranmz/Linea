import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Linea
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Events
            </Link>
            <Link 
              to="/owner" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/owner') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Owner Portal
            </Link>
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/admin') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/owner"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/owner') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Owner Portal
              </Link>
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/admin') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
