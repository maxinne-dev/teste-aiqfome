import { http } from '@shared/http/client';
import { subscribeToast } from '@shared/notifications/toastBus';

describe('Problem Details toast', () => {
  it('emits toast when API returns problem', async () => {
    const spy = vi.fn();
    const unsub = subscribeToast(spy);

    await expect(
      http.get('/fail', {
        adapter: async (config) => {
          return Promise.reject({
            isAxiosError: true,
            config,
            response: {
              status: 400,
              data: { title: 'Bad Request', detail: 'Invalid data', status: 400 },
              statusText: 'Bad Request',
              headers: {},
              config
            }
          });
        }
      })
    ).rejects.toBeTruthy();

    unsub();

    expect(spy).toHaveBeenCalledWith({ title: 'Bad Request', detail: 'Invalid data', status: 400 });
  });
});

