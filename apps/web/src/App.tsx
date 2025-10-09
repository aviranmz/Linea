import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import { OwnerPortal } from './pages/OwnerPortal';
import OwnerTheme from './pages/OwnerTheme';
import OwnerWaitlist from './pages/OwnerWaitlist';
import OwnerEventEditor from './pages/OwnerEventEditor';
import OwnerProfile from './pages/OwnerProfile';
import EventAnalytics from './pages/EventAnalytics';
import DesignersPage from './pages/DesignersPage';
import FavoritesPage from './pages/FavoritesPage';
import { AdminPortal } from './pages/AdminPortal';
import AdminUsers from './pages/AdminUsers';
import AdminEvents from './pages/AdminEvents';
import AdminCategories from './pages/AdminCategories';
import AdminAreas from './pages/AdminAreas';
import AdminProducts from './pages/AdminProducts';
import AdminSystemSettings from './pages/AdminSystemSettings';
import SaloneDelMobile from './pages/SaloneDelMobile';
import { CreateEventPage } from './pages/CreateEventPage';
import { QRScanner } from './pages/QRScanner';
import { ArrivalPage } from './pages/ArrivalPage';
import { Layout } from './components/Layout';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { Sitemap } from './pages/Sitemap';
import { Robots } from './pages/Robots';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import DesignerProfile from './pages/DesignerProfile.tsx';

function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path='/' element={<HomePage />} />
              <Route path='/events' element={<EventsPage />} />
              <Route path='/events/:id' element={<EventPage />} />
              <Route path='/events/:eventId/arrival/:hash' element={<ArrivalPage />} />
            <Route path='/designers' element={<DesignersPage />} />
            <Route path='/designers/:id' element={<DesignerProfile />} />
            <Route path='/favorites' element={<FavoritesPage />} />
            <Route path='/owner/*' element={<OwnerPortal />} />
            <Route path='/owner/profile' element={<OwnerProfile />} />
            <Route path='/owner/theme' element={<OwnerTheme />} />
            <Route path='/owner/events/create' element={<CreateEventPage />} />
            <Route path='/owner/scanner' element={<QRScanner />} />
            <Route
              path='/owner/waitlist/:eventId'
              element={<OwnerWaitlist />}
            />
            <Route
              path='/owner/events/:id/edit-advanced'
              element={<OwnerEventEditor />}
            />
            <Route
              path='/owner/events/:eventId/analytics'
              element={<EventAnalytics />}
            />
            <Route path='/admin/*' element={<AdminPortal />} />
            <Route path='/admin/users' element={<AdminUsers />} />
            <Route path='/admin/events' element={<AdminEvents />} />
            <Route path='/admin/categories' element={<AdminCategories />} />
            <Route path='/admin/areas' element={<AdminAreas />} />
            <Route path='/admin/products' element={<AdminProducts />} />
            <Route path='/admin/settings' element={<AdminSystemSettings />} />
            <Route path='/salone-del-mobile' element={<SaloneDelMobile />} />
            <Route path='/help' element={<HelpCenter />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/privacy' element={<PrivacyPolicy />} />
            <Route path='/terms' element={<TermsOfService />} />
            <Route path='/sitemap.xml' element={<Sitemap />} />
            <Route path='/robots.txt' element={<Robots />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;
