import React from 'react';
import { getToken as getStoredToken, setLogoutHandler, setToken as setStoredToken } from './tokenStore';

type AuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => getStoredToken());

  const login = React.useCallback((t: string) => {
    setStoredToken(t);
    setToken(t);
  }, []);

  const logout = React.useCallback(() => {
    setStoredToken(null);
    setToken(null);
  }, []);

  React.useEffect(() => {
    setLogoutHandler(() => logout());
  }, [logout]);

  const value = React.useMemo(() => ({ token, login, logout }), [token, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

