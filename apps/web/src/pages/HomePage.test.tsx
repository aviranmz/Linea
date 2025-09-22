import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HomePage } from './HomePage'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.skip('renders hero section', () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ events: [] })
    })

    render(<HomePage />)
    
    expect(screen.getByText('Discover Extraordinary Events')).toBeInTheDocument()
    expect(screen.getByText('Join exclusive events through our innovative waitlist platform. Experience the future of event management with email-only access.')).toBeInTheDocument()
  })

  it.skip('renders call-to-action buttons', () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ events: [] })
    })

    render(<HomePage />)
    
    expect(screen.getByText('Explore Events')).toBeInTheDocument()
    expect(screen.getByText('Create Event')).toBeInTheDocument()
  })

  it.skip('shows loading state while fetching events', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(<HomePage />)
    
    // Should show loading skeleton
    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(3)
  })

  it.skip('displays events when loaded', async () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Test Event',
        slug: 'test-event',
        description: 'Test description',
        startDate: '2024-12-01T10:00:00Z',
        status: 'PUBLISHED'
      }
    ]

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ events: mockEvents })
    })

    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })
  })

  it.skip('shows empty state when no events', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ events: [] })
    })

    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('No events yet')).toBeInTheDocument()
      expect(screen.getByText('Check back soon for exciting events!')).toBeInTheDocument()
    })
  })

  it.skip('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('No events yet')).toBeInTheDocument()
    })
  })

  it.skip('renders features section', () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ events: [] })
    })

    render(<HomePage />)
    
    expect(screen.getByText('Why Choose Linea?')).toBeInTheDocument()
    expect(screen.getByText('Email-Only Access')).toBeInTheDocument()
    expect(screen.getByText('Waitlist Management')).toBeInTheDocument()
    expect(screen.getByText('Nearby Discoveries')).toBeInTheDocument()
  })

  it.skip('renders CTA section', () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ events: [] })
    })

    render(<HomePage />)
    
    expect(screen.getByText('Ready to create your event?')).toBeInTheDocument()
    expect(screen.getByText('Start building your community today.')).toBeInTheDocument()
  })
})
