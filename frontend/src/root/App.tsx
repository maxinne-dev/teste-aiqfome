import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          aiqfome SPA
        </Typography>
        <Typography variant="body1">
          Frontend bootstrap pronto. Explore clientes, produtos e favoritos — em breve.
        </Typography>
      </Box>
    </Container>
  );
}

