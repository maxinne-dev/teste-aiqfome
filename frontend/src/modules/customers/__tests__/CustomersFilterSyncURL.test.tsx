import { render, screen, fireEvent } from '@testing-library/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CustomersListPage from '../pages/CustomersListPage';

function setupRouter(initial = '/customers') {
  return createMemoryRouter([{ path: '/customers', element: <CustomersListPage /> }], {
    initialEntries: [initial]
  });
}

describe('Customers filters', () => {
  it('syncs search to URL', async () => {
    const theme = createTheme();
    const qc = new QueryClient();
    const router = setupRouter();

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    const input = screen.getByLabelText('Buscar');
    fireEvent.change(input, { target: { value: 'ali' } });
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(router.state.location.search).toContain('q=ali');
    expect(router.state.location.search).toContain('page=1');
  });
});

