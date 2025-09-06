import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000
    }
  }
});

export function setupQueryPersistence() {
  if (typeof window === 'undefined') return;
  const persister = createSyncStoragePersister({ storage: window.localStorage });
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 24 * 60 * 60 * 1000,
    buster: (import.meta as any).env?.VITE_APP_VERSION ?? 'v0'
  });
}

