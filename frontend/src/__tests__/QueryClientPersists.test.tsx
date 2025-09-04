import { useEffect } from 'react'
import { render } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

function Writer({ client }: { client: QueryClient }) {
  useEffect(() => {
    client.setQueryData(['test-key'], { ok: true })
  }, [client])
  return null
}

describe('QueryClientPersistsTest', () => {
  it('persists cache to localStorage', async () => {
    const client = new QueryClient()
    const persister = createSyncStoragePersister({ storage: window.localStorage, key: 'rq-cache' })

    render(
      <PersistQueryClientProvider client={client} persistOptions={{ persister }}>
        <Writer client={client} />
      </PersistQueryClientProvider>
    )

    // allow microtask to flush persist
    await new Promise((r) => setTimeout(r, 0))

    const raw = window.localStorage.getItem('rq-cache')
    expect(raw).toBeTruthy()
    expect(raw).toContain('test-key')
  })
})

