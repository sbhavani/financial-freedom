import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../app/page'

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ id: 1, name: 'Test User' }),
  })
) as jest.Mock;

describe('Home', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the initial loading state', () => {
    render(<Home />)

    expect(screen.getByText('Financial Freedom Next.js Frontend')).toBeInTheDocument()
    expect(screen.getByText('API Connection Status: Loading...')).toBeInTheDocument()
  })

  it('renders data fetched from API', async () => {
    render(<Home />)

    expect(screen.getByText('API Connection Status: Loading...')).toBeInTheDocument()

    await waitFor(() => {
        expect(screen.getByText(/Test User/)).toBeInTheDocument()
    })
  })

  it('handles 401 unauthenticated response', async () => {
     (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthenticated' }),
      })
    );

    render(<Home />)

    await waitFor(() => {
        expect(screen.getByText(/Unauthenticated \(as expected if not logged in\)/)).toBeInTheDocument()
    })
  })
})
