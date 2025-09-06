import React from 'react';
import { Grid2 as Grid, Skeleton } from '@mui/material';

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={2} data-testid="loading-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <Skeleton variant="rectangular" height={160} />
        </Grid>
      ))}
    </Grid>
  );
}

