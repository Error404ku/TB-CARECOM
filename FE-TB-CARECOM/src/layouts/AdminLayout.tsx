// Admin Layout component
// TODO: Add your admin layout implementation here

import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
      {/* TODO: Add admin layout structure */}
      {children}
    </div>
  );
};

export default AdminLayout; 