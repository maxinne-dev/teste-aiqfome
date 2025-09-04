export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL as string | undefined
  return url && url.length > 0 ? url : '/api'
}

