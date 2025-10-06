import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { OwnerPortal } from './OwnerPortal'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

vi.mock('../hooks/useLanguage', async () => ({
  useLanguage: () => ({
    language: 'en', setLanguage: () => {},
    t: (key: string) => ({
      'nav.owner': 'Owner Portal',
      'common.welcomeBack': 'Welcome back',
      'owner.manageEvents': 'Manage your events and track waitlist performance',
      'owner.createNewEvent': 'Create New Event',
      'owner.yourEvents': 'Your Events',
      'owner.manageEventPerformance': 'Manage and track your event performance',
      'owner.totalEvents': 'Total Events'
    } as Record<string, string>)[key] ?? key
  })
}))

describe('OwnerPortal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders portal header', async () => {
    // First call: /auth/me, Second call: /api/owner/events
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ authenticated: true, user: { email: 'o@o.com' } }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ events: [] }) })

    render(
      <BrowserRouter>
        <OwnerPortal />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Owner Portal')).toBeInTheDocument()
      expect(screen.getByText('Manage your events and track waitlist performance')).toBeInTheDocument()
      expect(screen.getByText('Create New Event')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching events', async () => {
    // /auth/me resolves authed, events never resolves
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ authenticated: true }) })
      .mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(
      <BrowserRouter>
        <OwnerPortal />
      </BrowserRouter>
    )
    
    // Wait until the authenticated view is rendered
    await waitFor(() => {
      expect(screen.getByText('Owner Portal')).toBeInTheDocument()
    })
    // Should show loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows empty state when no events', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ authenticated: true }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ events: [] }) })

    render(
      <BrowserRouter>
        <OwnerPortal />
      </BrowserRouter>
    )
    
    await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
    
    expect(screen.getByText('No events yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first event to get started.')).toBeInTheDocument()
  })

  it('opens create event modal when button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ authenticated: true }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ events: [] }) })

    render(
      <BrowserRouter>
        <OwnerPortal />
      </BrowserRouter>
    )
    
    const createButton = await screen.findByRole('button', { name: /create new event/i })
    fireEvent.click(createButton)

    // Check for modal title specifically
    expect(screen.getByRole('heading', { name: 'Create New Event' })).toBeInTheDocument()
    expect(screen.getByLabelText('Event Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Capacity (optional)')).toBeInTheDocument()
  })

  it('closes create event modal when cancel is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ authenticated: true }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ events: [] }) })

    render(
      <BrowserRouter>
        <OwnerPortal />
      </BrowserRouter>
    )
    
    const createButton = await screen.findByRole('button', { name: /create new event/i })
    fireEvent.click(createButton)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    // Modal should be closed - check that the modal title is gone
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Create New Event' })).not.toBeInTheDocument()
    })
  })
})