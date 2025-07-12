// Auth Layout component
// TODO: Add your auth layout implementation here

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div>
      {/* TODO: Add auth layout structure */}
      {children}
    </div>
  );
};

export default AuthLayout; 