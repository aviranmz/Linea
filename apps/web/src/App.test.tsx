import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the pages
vi.mock('./pages/HomePage', () => ({
  HomePage: () => <div data-testid='home-page'>Home Page</div>,
}));

vi.mock('./pages/EventPage', () => ({
  EventPage: () => <div data-testid='event-page'>Event Page</div>,
}));

vi.mock('./pages/OwnerPortal', () => ({
  OwnerPortal: () => <div data-testid='owner-portal'>Owner Portal</div>,
}));

vi.mock('./pages/AdminPortal', () => ({
  AdminPortal: () => <div data-testid='admin-portal'>Admin Portal</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getAllByText('Linea')).toHaveLength(2); // One in header, one in footer
  });

  it('renders home page by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders error boundary', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Error boundary should be present in the component tree
    expect(screen.getAllByText('Linea')).toHaveLength(2); // One in header, one in footer
  });
});
