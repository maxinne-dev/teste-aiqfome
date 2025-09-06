import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

describe('QueryClient persistence', () => {
  it('persists queries to localStorage', async () => {
    const qc = new QueryClient();
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'TEST_REACT_QUERY_CACHE'
    });
    const spy = vi.fn(persister.persistClient.bind(persister) as any);
    // override to observe calls
    (persister as any).persistClient = spy;
    persistQueryClient({ queryClient: qc, persister, maxAge: 1000 * 60 * 60, throttleTime: 0 });

    await qc.prefetchQuery({ queryKey: ['persist-test'], queryFn: async () => 'ok' });

    // allow persist to flush
    await new Promise((r) => setTimeout(r, 25));

    expect(spy).toHaveBeenCalled();
  });
});
