import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <main className="flex-1 relative">
        {/* Background pattern inspired by Milano Design Week */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
