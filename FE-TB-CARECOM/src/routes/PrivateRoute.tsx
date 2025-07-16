// routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import type { ReactNode } from 'react';

export const PrivateRoute = ({ children }: { children: ReactNode  }) => {
  const { user } = useAuth();
  // jangan direct kemana mana
  // if (!user) return <Navigate to="/login" />;
  return children;
};
