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

    const getSpy = vi.spyOn(http, 'get');
    // First GET: dev users list for login page
    getSpy.mockResolvedValueOnce({ data: { users: [{ id: 1, email: 'test@example.com', name: 'Test', isDefault: true }] } } as any);
    // Second GET: products after login
    getSpy.mockResolvedValueOnce({ data: [] } as any);
    const postSpy = vi.spyOn(http, 'post').mockResolvedValueOnce({ data: { token: 'token-123' } } as any);

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

    // Wait for the user selector to load and submit with default user selected
    await screen.findByLabelText(/usuário/i);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Should navigate to /products and trigger fetch
    await waitFor(() => expect(postSpy).toHaveBeenCalled());
    await waitFor(() => expect(getSpy).toHaveBeenCalledTimes(2));
  });
});
