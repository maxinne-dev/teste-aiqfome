import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
// Note: assuming aiq-design-system exposes a ThemeProvider compatible with React context
// If the package API differs, adjust here in Step 15.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ThemeProvider } from 'aiq-design-system'
import { AppRoutes } from './routes'
import { LogoutListener } from '@/modules/auth/LogoutListener'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      gcTime: 1000 * 60 * 60 // 1h
    }
  }
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'rq-cache'
})

export function App() {
  return (
    <ThemeProvider>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <LogoutListener />
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  )
}
