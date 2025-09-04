import type { AxiosError } from 'axios'

export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  [key: string]: unknown
}

export function toProblem(err: unknown): ProblemDetails {
  const ax = err as AxiosError
  const data = (ax?.response?.data ?? {}) as any
  if (data && (data.title || data.detail || data.status)) return data as ProblemDetails
  return {
    title: 'Unexpected error',
    status: ax?.response?.status ?? 0
  }
}

