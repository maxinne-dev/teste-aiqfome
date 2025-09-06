import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CustomerEditPage from '@modules/customers/pages/CustomerEditPage';
import { http } from '@shared/http/client';

function setup(initialEntries: string[]) {
  const theme = createTheme();
  const qc = new QueryClient();
  const router = createMemoryRouter([{ path: '/customers/:id', element: <CustomerEditPage /> }], {
    initialEntries
  });

  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={qc}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

describe('Favorites UI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows empty state when no favorites', async () => {
    vi.spyOn(http, 'get')
      .mockResolvedValueOnce({ data: { id: 1, name: 'User', email: 'u@e.com' } } as any) // get customer
      .mockResolvedValueOnce({ data: { data: [] } } as any); // favorites list

    setup(['/customers/1']);

    expect(await screen.findByText('Favoritos')).toBeInTheDocument();
    expect(await screen.findByText('Nenhum favorito')).toBeInTheDocument();
  });

  it('adds favorite idempotently (no duplicates)', async () => {
    const getMock = vi.spyOn(http, 'get');
    // customer
    getMock.mockResolvedValueOnce({ data: { id: 1, name: 'User', email: 'u@e.com' } } as any);
    // initial favorites empty
    getMock.mockResolvedValueOnce({ data: { data: [] } } as any);
    // after add, returns one item
    getMock.mockResolvedValueOnce({ data: { data: [{ customer_id: 1, product_id: 5 }] } } as any);
    // after duplicate add, still one item
    getMock.mockResolvedValueOnce({ data: { data: [{ customer_id: 1, product_id: 5 }] } } as any);

    const postMock = vi.spyOn(http, 'post')
      .mockResolvedValueOnce({ status: 201, data: { customer_id: 1, product_id: 5 } } as any)
      .mockResolvedValueOnce({ status: 200, data: { customer_id: 1, product_id: 5 } } as any);

    setup(['/customers/1']);

    // Add favorite 5
    fireEvent.change(await screen.findByLabelText('Product ID'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    await waitFor(() => expect(postMock).toHaveBeenCalled());
    expect(await screen.findByText('Produto #5')).toBeInTheDocument();

    // Add again idempotently
    fireEvent.change(screen.getByLabelText('Product ID'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(2));

    // Still a single entry
    const items = await screen.findAllByText('Produto #5');
    expect(items).toHaveLength(1);
  });

  it('removes favorite from list', async () => {
    const getMock = vi.spyOn(http, 'get');
    // customer
    getMock.mockResolvedValueOnce({ data: { id: 2, name: 'User', email: 'u@e.com' } } as any);
    // initial favorites has item
    getMock.mockResolvedValueOnce({ data: { data: [{ customer_id: 2, product_id: 9 }] } } as any);
    // after delete, empty
    getMock.mockResolvedValueOnce({ data: { data: [] } } as any);

    const delMock = vi.spyOn(http, 'delete').mockResolvedValueOnce({ status: 204 } as any);

    setup(['/customers/2']);

    expect(await screen.findByText('Produto #9')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /remover/i }));
    await waitFor(() => expect(delMock).toHaveBeenCalled());
    expect(await screen.findByText('Nenhum favorito')).toBeInTheDocument();
  });
});

