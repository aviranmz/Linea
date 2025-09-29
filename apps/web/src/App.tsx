import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { EventPage } from './pages/EventPage'
import { OwnerPortal } from './pages/OwnerPortal'
import OwnerTheme from './pages/OwnerTheme'
import OwnerWaitlist from './pages/OwnerWaitlist'
import OwnerEventEditor from './pages/OwnerEventEditor'
import OwnerProfile from './pages/OwnerProfile'
import DesignersPage from './pages/DesignersPage'
import { AdminPortal } from './pages/AdminPortal'
import AdminOwners from './pages/AdminOwners'
import AdminEvents from './pages/AdminEvents'
import AdminCategories from './pages/AdminCategories'
import AdminAreas from './pages/AdminAreas'
import AdminProducts from './pages/AdminProducts'
import SaloneDelMobile from './pages/SaloneDelMobile'
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
          <Route path="/designers" element={<DesignersPage />} />
          <Route path="/owner/*" element={<OwnerPortal />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/owner/theme" element={<OwnerTheme />} />
          <Route path="/owner/waitlist/:eventId" element={<OwnerWaitlist />} />
          <Route path="/owner/events/:id/edit-advanced" element={<OwnerEventEditor />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/admin/owners" element={<AdminOwners />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/areas" element={<AdminAreas />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/salone-del-mobile" element={<SaloneDelMobile />} />
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
