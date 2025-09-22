import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AdminPortal } from './AdminPortal'

describe('AdminPortal', () => {
  it('renders admin portal header', () => {
    render(
      <BrowserRouter>
        <AdminPortal />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Admin Portal')).toBeInTheDocument()
    expect(screen.getByText('Platform administration and analytics dashboard')).toBeInTheDocument()
  })

  it('displays platform statistics', () => {
    render(
      <BrowserRouter>
        <AdminPortal />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active Events')).toBeInTheDocument()
    expect(screen.getByText('Total Waitlist')).toBeInTheDocument()
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
  })

  it('displays recent activity section', () => {
    render(
      <BrowserRouter>
        <AdminPortal />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })
})