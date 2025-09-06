export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export function toProblem(err: unknown): ProblemDetails {
  const anyErr = err as any;
  const resp = anyErr?.response;
  if (resp?.data && typeof resp.data === 'object') return resp.data as ProblemDetails;
  return {
    title: 'Erro inesperado',
    status: resp?.status ?? 0
  };
}

