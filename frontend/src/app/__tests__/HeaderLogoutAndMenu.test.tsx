import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Shell from '@app/layout/Shell';
import ProductsPage from '@modules/products/pages/ProductsPage';
import CustomersListPage from '@modules/customers/pages/CustomersListPage';
import { AuthProvider } from '@shared/auth/AuthContext';
import { setToken } from '@shared/auth/tokenStore';
import { http } from '@shared/http/client';

describe('Header and side menu', () => {
  it('opens menu and navigates to Customers, and logs out back to login', async () => {
    setToken('abc');
    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter([
      { path: '/login', element: <div>Login</div> },
      {
        path: '/',
        element: <Shell />,
        children: [
          { index: true, element: <div>Home</div> },
          { path: 'customers', element: <CustomersListPage /> },
          { path: 'products', element: <ProductsPage /> }
        ]
      }
    ], { initialEntries: ['/products'] });

    // Stub API
    vi.spyOn(http, 'get').mockResolvedValue({ data: [] } as any);

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );

    // Open menu
    fireEvent.click(await screen.findByLabelText(/open menu/i));
    // Navigate to customers
    fireEvent.click(await screen.findByText(/Clientes/i));

    // Click Logout
    fireEvent.click(await screen.findByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});

