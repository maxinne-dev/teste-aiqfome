import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CustomersListPage from '../pages/CustomersListPage';
import { http } from '@shared/http/client';

describe('Customers list', () => {
  it('fetches and renders customers', async () => {
    const spy = vi.spyOn(http, 'get').mockResolvedValueOnce({
      data: {
        data: [
          { id: 1, name: 'Alice', email: 'alice@example.com' },
          { id: 2, name: 'Bob', email: 'bob@example.com' }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as any);

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([
      { path: '/customers', element: <CustomersListPage /> }
    ], { initialEntries: ['/customers'] });

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
  });
});

