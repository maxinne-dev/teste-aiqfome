import axios from 'axios'
import { getApiBaseUrl } from '@/config/env'
import { tokenStore, triggerLogout } from '@/auth/tokenStore'
import { showError } from '@/lib/toast'
import { toProblem } from '@/lib/problemDetails'

export const http = axios.create({
  baseURL: getApiBaseUrl()
})

http.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const status = error?.response?.status
    const problem = toProblem(error)
    if (status === 401) {
      triggerLogout()
    }
    // Prefer detail/title for user feedback
    const message = (problem.detail || problem.title || 'Request failed') as string
    showError(message)
    return Promise.reject(error)
  }
)

