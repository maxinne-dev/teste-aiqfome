import { render, screen } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from '../pages/ProductsPage';
import { http } from '@shared/http/client';
import { SelectedCustomerProvider } from '@shared/customers/SelectedCustomerContext';

describe('Products initial fetch', () => {
  it('renders products from API', async () => {
    const items = [
      { id: 1, title: 'Shirt', price: 10, description: 'Nice', category: 'clothes', image: '' },
      { id: 2, title: 'Pants', price: 20, description: 'Blue', category: 'clothes', image: '' }
    ];
    const spy = vi.spyOn(http, 'get').mockResolvedValueOnce({ data: items } as any);

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([{ path: '/products', element: <ProductsPage /> }], {
      initialEntries: ['/products']
    });

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <SelectedCustomerProvider>
            <RouterProvider router={router} />
          </SelectedCustomerProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );

    expect(await screen.findByLabelText('product-1')).toBeInTheDocument();
    expect(screen.getByLabelText('product-2')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
