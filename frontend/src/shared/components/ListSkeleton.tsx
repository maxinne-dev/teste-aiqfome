import React from 'react';
import { Skeleton, Stack } from '@mui/material';

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Stack spacing={1} data-testid="loading-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={32} />
      ))}
    </Stack>
  );
}

