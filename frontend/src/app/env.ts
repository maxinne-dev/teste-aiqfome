export const env = {
  apiBaseUrl: (import.meta as any).env?.VITE_API_BASE_URL || '/api',
  appVersion: (import.meta as any).env?.VITE_APP_VERSION || 'dev'
};

