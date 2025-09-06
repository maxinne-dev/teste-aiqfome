import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from '@modules/products/pages/ProductsPage';
import { RequireAuth } from '@app/RequireAuth';
import LoginPage from '@modules/auth/pages/LoginPage';
import { AuthProvider } from '@shared/auth/AuthContext';
import { SelectedCustomerProvider } from '@shared/customers/SelectedCustomerContext';
import { http } from '@shared/http/client';

describe('Login flow', () => {
  it('redirects to login when accessing protected route, then proceeds after login', async () => {
    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([
      { path: '/login', element: <LoginPage /> },
      {
        path: '/products',
        element: (
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        )
      }
    ], { initialEntries: ['/products'] });

    const spy = vi.spyOn(http, 'get').mockResolvedValueOnce({ data: [] } as any);

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <AuthProvider>
            <SelectedCustomerProvider>
              <RouterProvider router={router} />
            </SelectedCustomerProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );

    // We should land on Login
    expect(await screen.findByText(/login/i)).toBeInTheDocument();

    // Fill token and submit
    fireEvent.change(await screen.findByPlaceholderText(/paste your token here/i), { target: { value: 'token-123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Should navigate to /products and trigger fetch
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
});
