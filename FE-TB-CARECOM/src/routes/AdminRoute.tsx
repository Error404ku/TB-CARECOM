import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // if (!user) return <Navigate to="/login" />;
  // if (user?.role !== 'admin') return <Navigate to="/dashboarduser" />;
  return children;
};

export const PMORoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // if (!user) return <Navigate to="/login" />;
  // if (user?.role !== 'pmo') return <Navigate to="/dashboarduser" />;
  return children;
};

export const PerawatRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // if (!user) return <Navigate to="/login" />;
  // if (user?.role !== 'perawat') return <Navigate to="/dashboarduser" />;
  return children;
};
