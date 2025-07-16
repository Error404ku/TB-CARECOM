// routes/PrivateRoute.tsx
import type { ReactNode } from 'react';

export const PrivateRoute = ({ children }: { children: ReactNode  }) => {
  // jangan direct kemana mana
  // if (!user) return <Navigate to="/login" />;
  return children;
};
