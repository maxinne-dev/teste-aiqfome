import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/auth/AuthContext';

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?to=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
}

