import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { EventPage } from './pages/EventPage'
import { OwnerPortal } from './pages/OwnerPortal'
import OwnerTheme from './pages/OwnerTheme'
import OwnerWaitlist from './pages/OwnerWaitlist'
import { AdminPortal } from './pages/AdminPortal'
import { Layout } from './components/Layout'
import HelpCenter from './pages/HelpCenter'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:slug" element={<EventPage />} />
          <Route path="/owner/*" element={<OwnerPortal />} />
          <Route path="/owner/theme" element={<OwnerTheme />} />
          <Route path="/owner/waitlist/:eventId" element={<OwnerWaitlist />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
