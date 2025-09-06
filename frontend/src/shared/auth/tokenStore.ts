let tokenMemory: string | null = null;

const STORAGE_KEY = 'auth_token';

export function setToken(token: string | null) {
  tokenMemory = token;
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function getToken(): string | null {
  if (tokenMemory) return tokenMemory;
  try {
    tokenMemory = localStorage.getItem(STORAGE_KEY);
  } catch {}
  return tokenMemory;
}

type LogoutHandler = () => void;
let logoutHandler: LogoutHandler | null = null;

export function setLogoutHandler(handler: LogoutHandler) {
  logoutHandler = handler;
}

export function triggerLogout() {
  setToken(null);
  if (logoutHandler) logoutHandler();
}

