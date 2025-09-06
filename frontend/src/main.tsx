import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './app/routes';
import { AppErrorBoundary } from './app/providers/ErrorBoundary';
import { queryClient, setupQueryPersistence } from './root/queryClient';

// Initialize query cache persistence to localStorage
setupQueryPersistence();

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7C3AED' }, // placeholder aligned with design-guide accent
    secondary: { main: '#00BFA6' }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);
