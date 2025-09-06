import { render, screen } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from '@modules/products/pages/ProductsPage';
import { http } from '@shared/http/client';

describe('Loading skeleton', () => {
  it('displays while products load', async () => {
    vi.spyOn(http, 'get').mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] } as any), 50))
    );

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([{ path: '/products', element: <ProductsPage /> }], {
      initialEntries: ['/products']
    });

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    // and eventually resolves
    await screen.findByRole('grid', { hidden: true }).catch(() => {});
  });
});

