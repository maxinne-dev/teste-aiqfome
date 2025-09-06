import { http } from '@shared/http/client';
import { setToken } from '@shared/auth/tokenStore';

describe('Auth interceptor', () => {
  it('adds Authorization header when token present', async () => {
    setToken('abc123');

    const result = await http.get('/test', {
      // Custom adapter to avoid real network and capture headers
      adapter: async (config) => {
        return {
          data: { ok: true },
          status: 200,
          statusText: 'OK',
          headers: config.headers as any,
          config
        };
      }
    });

    expect((result.config.headers as any)['Authorization']).toBe('Bearer abc123');
  });
});

