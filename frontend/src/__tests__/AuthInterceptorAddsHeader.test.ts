import { http } from '@/lib/httpClient'
import { tokenStore } from '@/auth/tokenStore'

describe('AuthInterceptorAddsHeaderTest', () => {
  it('adds Authorization header when token present', async () => {
    tokenStore.set('test-token-123')
    const res = await http.get('/hello', {
      // Custom adapter to intercept request config without making a network call
      adapter: async (config) => {
        expect(config.headers?.['Authorization']).toBe('Bearer test-token-123')
        return {
          data: { ok: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
      }
    })
    expect(res.status).toBe(200)
  })
})

