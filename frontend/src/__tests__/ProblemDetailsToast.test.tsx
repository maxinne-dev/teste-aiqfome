import { http } from '@/lib/httpClient'
import * as toast from '@/lib/toast'

describe('ProblemDetailsToastTest', () => {
  it('parses Problem Details and shows toast', async () => {
    const spy = vi.spyOn(toast, 'showError').mockImplementation(() => {})

    await http
      .get('/will-fail', {
        adapter: async () => {
          // Simulate Axios rejection with Problem Details payload
          return Promise.reject({
            isAxiosError: true,
            response: {
              status: 400,
              data: {
                type: 'https://example.com/validation-error',
                title: 'Bad Request',
                status: 400,
                detail: 'Invalid input provided'
              }
            }
          } as any)
        }
      })
      .catch(() => undefined)

    expect(spy).toHaveBeenCalled()
    const message = spy.mock.calls[0]?.[0]
    expect(message).toMatch(/invalid input/i)
    spy.mockRestore()
  })
})

