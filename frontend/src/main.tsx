import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './app/routes';
import { AppErrorBoundary } from './app/providers/ErrorBoundary';
import { AuthProvider } from '@shared/auth/AuthContext';
import { queryClient, setupQueryPersistence } from './root/queryClient';
import './styles/aiq-tokens.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';

// Initialize query cache persistence to localStorage
setupQueryPersistence();

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7b1fa2', dark: '#580f78', light: '#eecffc' },
    secondary: { main: '#00a296' },
    error: { main: '#f93632' },
    success: { main: '#43a047' },
    warning: { main: '#ff5722' },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: '#263238', secondary: '#6d6f73' },
    divider: '#bfbfbf'
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Nunito", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    allVariants: {
      textTransform: 'none'
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);
