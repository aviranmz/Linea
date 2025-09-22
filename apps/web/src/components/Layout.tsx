import React, { ReactNode, useEffect, useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ThemeProvider } from '../contexts/ThemeContext'
import { postJson } from '../lib/api'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const seen = localStorage.getItem('visitor_email')
    if (!seen) setShowEmailModal(true)
  }, [])

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await postJson('/collect-email', { email })
    } catch (err) {
      // Best-effort; ignore failures but log in dev
      if (import.meta.env && import.meta.env.DEV) {
        console.warn('collect-email failed', err)
      }
    }
    localStorage.setItem('visitor_email', email)
    setShowEmailModal(false)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col milano-gradient dark:bg-neutral-900 transition-colors duration-300">
        <Header />
        <main className="flex-1 relative">
          {/* Milano Design Week inspired background pattern */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)]"></div>
          </div>
          
          {/* Subtle geometric accents */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-accent-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-milano-sage/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            {children}
          </div>
          {showEmailModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 w-full max-w-md shadow-milano">
                <h2 className="heading-3 mb-2">Stay in the loop</h2>
                <p className="text-body mb-4">Enter your email to get quick access to waitlists and event updates.</p>
                <form onSubmit={submitEmail} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input w-full"
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowEmailModal(false)} className="btn btn-ghost">Not now</button>
                    <button type="submit" className="btn btn-primary">Continue</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
