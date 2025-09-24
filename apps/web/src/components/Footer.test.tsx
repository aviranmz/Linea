import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders footer content', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Linea')).toBeInTheDocument()
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText(/© 2025 Linea. All rights reserved. Version/)).toBeInTheDocument()
  })

  it('renders all quick links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Owner Portal')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders all support links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Help Center')).toBeInTheDocument()
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('renders social media icons', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    
    // Check for social media links by their href attributes
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })

  it('displays version information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    
    expect(screen.getByText(/Version/)).toBeInTheDocument()
  })

  it('has proper link structure', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    
    const eventsLink = screen.getByRole('link', { name: 'Events' })
    const ownerPortalLink = screen.getByRole('link', { name: 'Owner Portal' })
    const adminLink = screen.getByRole('link', { name: 'Admin' })
    
    expect(eventsLink).toHaveAttribute('href', '/')
    expect(ownerPortalLink).toHaveAttribute('href', '/owner')
    expect(adminLink).toHaveAttribute('href', '/admin')
  })
})
