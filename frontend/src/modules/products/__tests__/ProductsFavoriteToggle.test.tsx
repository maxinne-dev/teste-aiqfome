import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from '../pages/ProductsPage';
import { http } from '@shared/http/client';
import { SelectedCustomerProvider } from '@shared/customers/SelectedCustomerContext';

describe('Products favorite toggle', () => {
  it('toggles favorite on product card for selected customer', async () => {
    const products = [
      { id: 1, title: 'Shirt', price: 10, description: 'Nice', category: 'clothes', image: '' },
      { id: 2, title: 'Phone', price: 100, description: 'Smart', category: 'electronics', image: '' }
    ];

    const getMock = vi.spyOn(http, 'get');
    getMock.mockResolvedValueOnce({ data: products } as any); // products list
    getMock.mockResolvedValueOnce({ data: { data: [] } } as any); // favorites initial after setting customer
    getMock.mockResolvedValueOnce({ data: { data: [{ customer_id: 1, product_id: 2 }] } } as any); // after add
    getMock.mockResolvedValueOnce({ data: { data: [] } } as any); // after remove

    const postMock = vi.spyOn(http, 'post').mockResolvedValueOnce({ status: 201 } as any);
    const delMock = vi.spyOn(http, 'delete').mockResolvedValueOnce({ status: 204 } as any);

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([{ path: '/products', element: <ProductsPage /> }], {
      initialEntries: ['/products']
    });

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <SelectedCustomerProvider initialId={1}>
            <RouterProvider router={router} />
          </SelectedCustomerProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );

    // initial products render
    const card = await screen.findByLabelText('product-2');

    // selected customer id is provided via context
    await waitFor(() => expect(getMock).toHaveBeenCalledTimes(2));

    // Click Favoritar, then expect button to become Desfavoritar
    fireEvent.click(within(card).getAllByRole('button', { name: /favoritar/i })[0]);
    await waitFor(() => expect(postMock).toHaveBeenCalled());
    await within(card).findByRole('button', { name: /desfavoritar/i });

    // Click Desfavoritar
    fireEvent.click(within(card).getAllByRole('button', { name: /desfavoritar/i })[0]);
    await waitFor(() => expect(delMock).toHaveBeenCalled());
    await within(card).findByRole('button', { name: /favoritar/i });
  });
});
