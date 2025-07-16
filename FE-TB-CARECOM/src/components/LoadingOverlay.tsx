import React from 'react';

const LoadingOverlay: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay; 