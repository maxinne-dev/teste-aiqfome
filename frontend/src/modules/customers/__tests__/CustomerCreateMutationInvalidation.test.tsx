import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CustomerCreatePage from '../pages/CustomerCreatePage';
import CustomersListPage from '../pages/CustomersListPage';
import { http } from '@shared/http/client';

describe('Customer create invalidation', () => {
  it('navigates to list and refetches after create', async () => {
    const postSpy = vi.spyOn(http, 'post').mockResolvedValueOnce({
      data: { id: 3, name: 'Carol', email: 'carol@example.com' }
    } as any);

    const getSpy = vi.spyOn(http, 'get').mockResolvedValueOnce({
      data: { data: [{ id: 3, name: 'Carol', email: 'carol@example.com' }] }
    } as any);

    const theme = createTheme();
    const qc = new QueryClient();
    const router = createMemoryRouter(
      [
        { path: '/customers', element: <CustomersListPage /> },
        { path: '/customers/new', element: <CustomerCreatePage /> }
      ],
      { initialEntries: ['/customers/new'] }
    );

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    fireEvent.change(await screen.findByLabelText(/Nome/i), { target: { value: 'Carol' } });
    fireEvent.change(await screen.findByLabelText(/Email/i), { target: { value: 'carol@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => expect(postSpy).toHaveBeenCalled());

    // After navigate, list should render with new item (refetch triggered)
    await screen.findByText('Clientes');
    await screen.findByText('Carol');
    expect(getSpy).toHaveBeenCalled();
  });
});
