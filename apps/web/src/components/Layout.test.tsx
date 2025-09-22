import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renders children content', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      </BrowserRouter>
    )
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('renders header and footer', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    )
    expect(screen.getAllByText('Linea')).toHaveLength(2) // One in header, one in footer
  })

  it('has proper structure with main content area', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="main-content">Main Content</div>
        </Layout>
      </BrowserRouter>
    )
    
    // Check that main content is rendered
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    
    // Check that header is present (there are two Linea texts - one in header, one in footer)
    expect(screen.getAllByText('Linea')).toHaveLength(2)
  })
})