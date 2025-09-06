import { render, screen } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CustomerEditPage from '../pages/CustomerEditPage';
import { http } from '@shared/http/client';

describe('Customer edit form', () => {
  it('prefills values from API', async () => {
    vi.spyOn(http, 'get').mockResolvedValueOnce({
      data: { id: 10, name: 'Dave', email: 'dave@example.com' }
    } as any);

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter(
      [{ path: '/customers/:id', element: <CustomerEditPage /> }],
      { initialEntries: ['/customers/10'] }
    );

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(await screen.findByDisplayValue('Dave')).toBeInTheDocument();
    expect(screen.getByDisplayValue('dave@example.com')).toBeInTheDocument();
  });
});

