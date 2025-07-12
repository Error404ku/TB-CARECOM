// User Layout component
// TODO: Add your user layout implementation here

import React from 'react';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div>
      {/* TODO: Add user layout structure */}
      {children}
    </div>
  );
};

export default UserLayout; 