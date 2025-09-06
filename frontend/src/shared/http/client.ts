import axios from 'axios';
import { env } from '@app/env';
import { getToken, triggerLogout } from '@shared/auth/tokenStore';
import { emitToast } from '@shared/notifications/toastBus';
import { toProblem } from './problem';

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    const problem = toProblem(error);

    if (status === 401) {
      triggerLogout();
    }

    // Emit a toast notification for user feedback
    emitToast({ title: problem.title ?? 'Erro', detail: problem.detail as string | undefined, status: problem.status });

    return Promise.reject(error);
  }
);

