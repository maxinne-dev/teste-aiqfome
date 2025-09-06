import { render, screen, fireEvent } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from '../pages/ProductsPage';
import { http } from '@shared/http/client';

describe('Products search + category filter', () => {
  it('filters client-side without refetch', async () => {
    const items = [
      { id: 1, title: 'Shirt', price: 10, description: 'Nice', category: 'clothes', image: '' },
      { id: 2, title: 'Pants', price: 20, description: 'Blue', category: 'clothes', image: '' },
      { id: 3, title: 'Phone', price: 100, description: 'Smart', category: 'electronics', image: '' }
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
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    // Wait initial render
    await screen.findByLabelText('product-1');

    // Apply search
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'Ph' } });

    // Should hide clothes and show only electronics
    expect(screen.queryByLabelText('product-1')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('product-2')).not.toBeInTheDocument();
    expect(screen.getByLabelText('product-3')).toBeInTheDocument();

    // Change category to clothes via Select menu
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    const option = await screen.findByRole('option', { name: 'clothes' });
    fireEvent.click(option);
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: '' } });

    expect(screen.getByLabelText('product-1')).toBeInTheDocument();
    expect(screen.getByLabelText('product-2')).toBeInTheDocument();
    expect(screen.queryByLabelText('product-3')).not.toBeInTheDocument();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
