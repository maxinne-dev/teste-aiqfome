import React from 'react';
import { Box, Typography } from '@mui/material';

export function EmptyState({ message }: { message: string }) {
  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

