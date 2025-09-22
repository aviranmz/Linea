import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { EventPage } from './EventPage'

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ slug: 'test-event' })
  }
})

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('EventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.skip('shows loading state while fetching event', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    // Should show loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('displays event details when loaded', async () => {
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      slug: 'test-event',
      description: 'Test event description',
      startDate: '2024-12-01T10:00:00Z',
      endDate: '2024-12-01T18:00:00Z',
      status: 'PUBLISHED',
      capacity: 100,
      youtubeUrl: 'https://youtube.com/watch?v=test'
    }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ event: mockEvent })
    })

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
      expect(screen.getByText('Test event description')).toBeInTheDocument()
      expect(screen.getByText('Capacity: 100')).toBeInTheDocument()
    })
  })

  it('shows not found when event does not exist', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ event: null })
    })

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument()
      expect(screen.getByText('The event you\'re looking for doesn\'t exist.')).toBeInTheDocument()
    })
  })

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument()
    })
  })

  it('allows joining waitlist', async () => {
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      slug: 'test-event',
      description: 'Test event description',
      startDate: '2024-12-01T10:00:00Z',
      status: 'PUBLISHED'
    }

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ event: mockEvent })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ waitlistEntry: { id: '1', email: 'test@example.com', eventId: '1', status: 'PENDING' } })
      })

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const joinButton = screen.getByText('Join Waitlist')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(joinButton)

    await waitFor(() => {
      expect(screen.getByText('Successfully joined the waitlist!')).toBeInTheDocument()
    })
  })

  it('shows YouTube video when available', async () => {
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      slug: 'test-event',
      description: 'Test event description',
      startDate: '2024-12-01T10:00:00Z',
      status: 'PUBLISHED',
      youtubeUrl: 'https://youtube.com/watch?v=test'
    }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ event: mockEvent })
    })

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Event Video')).toBeInTheDocument()
      expect(screen.getByTitle('Test Event')).toBeInTheDocument()
    })
  })

  it('validates email input', async () => {
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      slug: 'test-event',
      description: 'Test event description',
      startDate: '2024-12-01T10:00:00Z',
      status: 'PUBLISHED'
    }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ event: mockEvent })
    })

    render(
      <BrowserRouter>
        <EventPage />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    const joinButton = screen.getByText('Join Waitlist')
    fireEvent.click(joinButton)

    // Should not submit without email
    expect(screen.queryByText('Successfully joined the waitlist!')).not.toBeInTheDocument()
  })
})
