import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import React from 'react'
import { LanguageProvider } from '../contexts/LanguageContext'

// Simplify Helmet during tests to avoid provider/context issues
vi.mock('react-helmet-async', async () => {
  return {
    HelmetProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Helmet: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  }
})
import { EventPage } from './EventPage'

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' })
  }
})

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

vi.mock('../hooks/useLanguage', async () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: () => {},
    t: (key: string) => ({
      'event.notFound': 'Event Not Found',
      'event.notFoundDescription': "The event you're looking for doesn't exist.",
      'event.video': 'Event Video',
      'event.joinWaitlist': 'Join Waitlist',
      'event.enterEmail': 'Enter your email address',
      'event.joinWaitlistSuccess': 'Successfully joined the waitlist!'
    } as Record<string, string>)[key] ?? key
  })
}))

describe('EventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.skip('shows loading state while fetching event', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(
      <HelmetProvider>
        <BrowserRouter>
          <EventPage />
        </BrowserRouter>
      </HelmetProvider>
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
      <HelmetProvider>
        <BrowserRouter>
          <EventPage />
        </BrowserRouter>
      </HelmetProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
      expect(screen.getByText('Test event description')).toBeInTheDocument()
      // Match the whole capacity line to avoid node split issues
      expect(screen.getByText(/event\.capacity\s*:\s*100/i)).toBeInTheDocument()
    })
  })

  it('shows not found when event does not exist', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ event: null })
    })

    render(
      <HelmetProvider>
        <BrowserRouter>
          <EventPage />
        </BrowserRouter>
      </HelmetProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument()
      expect(screen.getByText('The event you\'re looking for doesn\'t exist.')).toBeInTheDocument()
    })
  })

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(
      <HelmetProvider>
        <BrowserRouter>
          <EventPage />
        </BrowserRouter>
      </HelmetProvider>
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
      <HelmetProvider>
        <BrowserRouter>
          <EventPage />
        </BrowserRouter>
      </HelmetProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const joinButton = screen.getByRole('button', { name: /Join Waitlist/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(joinButton)

    await waitFor(() => {
      // ensure join API was called
      expect(mockFetch).toHaveBeenCalledTimes(2)
      const postCall = mockFetch.mock.calls.find(([, options]) => options && options.method === 'POST')
      expect(postCall).toBeTruthy()
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

    const joinButton = screen.getByRole('button', { name: /Join Waitlist/i })
    fireEvent.click(joinButton)

    // Should not submit without email
    expect(screen.queryByText('Successfully joined the waitlist!')).not.toBeInTheDocument()
  })
})
