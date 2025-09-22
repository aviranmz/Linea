import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it.skip('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument()
    expect(screen.getByText('We\'re sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the issue persists.')).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Error Details')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  it('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.queryByText('Error Details')).not.toBeInTheDocument()
    
    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })
})
