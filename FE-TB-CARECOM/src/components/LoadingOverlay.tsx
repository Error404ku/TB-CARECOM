import React from 'react';

const LoadingOverlay: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md">
      <div className="relative">
        {/* Main Loading Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          
          {/* Modern Spinner */}
          <div className="flex flex-col items-center space-y-6">
            
            {/* Multiple Ring Spinner */}
   

            {/* Loading Text */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Memuat...</h3>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Background Pulse Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-3xl animate-pulse"></div>
      </div>

      {/* Additional Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-green-400/10 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-400/10 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 