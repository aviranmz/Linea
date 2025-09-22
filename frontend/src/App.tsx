import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { EventPage } from './pages/EventPage'
import { OwnerPortal } from './pages/OwnerPortal'
import { AdminPortal } from './pages/AdminPortal'
import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:slug" element={<EventPage />} />
        <Route path="/owner/*" element={<OwnerPortal />} />
        <Route path="/admin/*" element={<AdminPortal />} />
      </Routes>
    </Layout>
  )
}

export default App
