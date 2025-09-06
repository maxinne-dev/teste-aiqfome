import { http } from '@shared/http/client';
import { setLogoutHandler, setToken } from '@shared/auth/tokenStore';

describe('Auth unauthorized flow', () => {
  it('calls logout handler on 401', async () => {
    setToken('abc');
    const logout = vi.fn();
    setLogoutHandler(logout);

    await expect(
      http.get('/secure', {
        adapter: async (config) => {
          return Promise.reject({
            isAxiosError: true,
            config,
            response: {
              status: 401,
              data: { title: 'Unauthorized' },
              statusText: 'Unauthorized',
              headers: {},
              config
            }
          });
        }
      })
    ).rejects.toBeTruthy();

    expect(logout).toHaveBeenCalled();
  });
});

