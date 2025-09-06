import { render, screen, cleanup } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsPage from '../pages/ProductsPage';
import { http } from '@shared/http/client';
import { SelectedCustomerProvider } from '@shared/customers/SelectedCustomerContext';

describe('Products cache reuse', () => {
  it('reuses cached list without refetch', async () => {
    const items = [
      { id: 1, title: 'Shirt', price: 10, description: 'Nice', category: 'clothes', image: '' },
      { id: 2, title: 'Phone', price: 100, description: 'Smart', category: 'electronics', image: '' }
    ];
    const spy = vi.spyOn(http, 'get').mockResolvedValueOnce({ data: items } as any);

    const theme = createTheme();
    const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } } });

    function mount() {
      render(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={qc}>
            <SelectedCustomerProvider>
              <ProductsPage />
            </SelectedCustomerProvider>
          </QueryClientProvider>
        </ThemeProvider>
      );
    }

    // First mount fetches
    mount();
    await screen.findByLabelText('product-1');
    expect(spy).toHaveBeenCalledTimes(1);

    // Second mount should use cache
    cleanup();
    mount();
    await screen.findByLabelText('product-2');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
