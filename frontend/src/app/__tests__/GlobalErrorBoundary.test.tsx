import { render, screen } from '@testing-library/react';
import { AppErrorBoundary } from '@app/providers/ErrorBoundary';

function Boom() {
  throw new Error('Boom');
}

describe('Global error boundary', () => {
  it('renders fallback UI when a child throws', () => {
    render(
      <AppErrorBoundary>
        <Boom />
      </AppErrorBoundary>
    );
    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recarregar/i })).toBeInTheDocument();
  });
});

