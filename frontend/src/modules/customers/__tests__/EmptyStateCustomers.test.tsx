import { render, screen } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CustomersListPage from '../pages/CustomersListPage';
import { http } from '@shared/http/client';

describe('Empty state customers', () => {
  it('shows standardized empty state when no customers', async () => {
    vi.spyOn(http, 'get').mockResolvedValueOnce({ data: { data: [] } } as any);

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([{ path: '/customers', element: <CustomersListPage /> }], {
      initialEntries: ['/customers']
    });

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(await screen.findByText('Nenhum cliente encontrado')).toBeInTheDocument();
  });
});

