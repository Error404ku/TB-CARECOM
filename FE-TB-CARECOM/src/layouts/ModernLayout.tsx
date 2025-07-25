import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
// import logo unissula
import logoUnissula from '../assets/logo_unissula.png';

interface ModernLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Get user role from localStorage
  const getUserRole = () => {
    const userRole = localStorage.getItem('role');
    return userRole;
  };

  // Get dashboard route based on role
  const getDashboardRoute = () => {
    const role = getUserRole();
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'pmo':
        return '/dashboardpmo';
      case 'perawat':
        return '/perawat/dashboard';
      default:
        return '/dashboardpmo';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              {/* logo unissula */}
              <img src={logoUnissula} alt="logo unissula" className="w-12 h-12" />
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  TB CareCom
                </h1>
                <p className="text-xs text-gray-500">Tuberculosis Care Community</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Beranda</a>
              <a href="/edukasi" className="text-gray-600 hover:text-blue-600 transition-colors">Edukasi</a>
              {user && getUserRole() && (
                <a 
                  href={getDashboardRoute()} 
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
                </a>
              )}
              {user ? (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a href="/login" className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                  Masuk
                </a>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              ref={menuButtonRef}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden" ref={mobileMenuRef}>
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-xl mt-4 shadow-lg border border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleNavigation('/')}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Beranda
                </button>
                <button
                  onClick={() => handleNavigation('/edukasi')}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Edukasi
                </button>
                {user && getUserRole() && (
                  <button
                    onClick={() => handleNavigation(getDashboardRoute())}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </button>
                )}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="block w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Masuk
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500">
            <p>Dikembangkan oleh mahasiswa S2 Keperawatan UNISULA Semarang.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLayout; 