import { render, screen } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from '../root/App';
import { queryClient } from '../root/queryClient';

function renderWithProviders(ui: React.ReactElement) {
  const theme = createTheme();
  const router = createMemoryRouter([
    { path: '/', element: ui }
  ], { initialEntries: ['/'] });

  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

describe('App', () => {
  it('renders the placeholder on root route', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /aiqfome spa/i })).toBeInTheDocument();
    expect(screen.getByText(/Frontend bootstrap pronto/i)).toBeInTheDocument();
  });
});

