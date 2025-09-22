import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'

// Mock useLocation hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' })
  }
})

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Linea')).toBeInTheDocument()
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Owner Portal')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('shows mobile menu button on small screens', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('toggles mobile menu when button is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i })
    
    // Initially mobile menu should not be visible (only desktop nav)
    expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument() // Desktop nav
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton)
    
    // Mobile menu should now be visible - check for mobile-specific classes
    const mobileNav = document.querySelector('.md\\:hidden .space-y-1')
    expect(mobileNav).toBeInTheDocument()
  })

  it('closes mobile menu when link is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i })
    
    // Open mobile menu
    fireEvent.click(mobileMenuButton)
    
    // Click on a link (use getAllByText to get the mobile version)
    const eventsLinks = screen.getAllByText('Events')
    const mobileEventsLink = eventsLinks.find(link => 
      link.closest('.md\\:hidden')
    )
    expect(mobileEventsLink).toBeInTheDocument()
    fireEvent.click(mobileEventsLink!)
    
    // Mobile menu should be closed (button should show "open" again)
    expect(screen.getByRole('button', { name: /open main menu/i })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i })
    // The button uses sr-only text instead of aria-label
    expect(screen.getByText('Open main menu')).toBeInTheDocument()
  })
})