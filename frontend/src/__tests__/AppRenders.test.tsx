import { render, screen } from '@testing-library/react'
import { App } from '../modules/app/App'

describe('AppRendersTest', () => {
  it('renders root route placeholder', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /frontend ready/i })).toBeInTheDocument()
    expect(screen.getByText(/spa bootstrap placeholder/i)).toBeInTheDocument()
  })
})
