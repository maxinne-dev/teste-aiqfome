import React from 'react';
import { Box, Button, Typography } from '@mui/material';

type State = { hasError: boolean; error?: Error };

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Global error boundary caught', error, info);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Oops! Algo deu errado.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tente recarregar a página ou voltar mais tarde.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Recarregar
            </Button>
          </Box>
        </Box>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

