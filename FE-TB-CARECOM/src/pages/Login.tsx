import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';
import { login as loginApi } from '../api/authApi';
import { jwtDecode } from 'jwt-decode';
import { showError } from '../utils/sweetAlert';
import { useAuth } from '../store/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  // kalo ada dihalaman login maka token dan role dihapus
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginApi(formData.email, formData.password);
      const token = response.data.data.token;
      // Decode JWT to get user info
      const decoded: any = jwtDecode(token);
      // Save token (and user info if needed)
      localStorage.setItem('token', token);
      localStorage.setItem('role', decoded.role);
      
      // Update AuthContext with user data
      login({
        role: decoded.role,
        name: decoded.name || 'User',
        email: decoded.email,
        id: decoded.id
      });
      
      // Redirect based on role
      if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (decoded.role === 'perawat') {
        navigate('/perawat/dashboard');
      } else if (decoded.role === 'pmo') {
        navigate('/dashboardpmo');
      } else {
        // navigate('/dashboarduser');
      }
    } catch (error: any) {
      showError(
        'Login Gagal',
        error?.response?.data?.meta?.message || 'Email atau password salah'
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ModernLayout title="Masuk ke TB CareCom" subtitle="Akses dashboard Anda untuk mengelola pengobatan TB">
      <div className="mx-auto">
        {/* Quick Login Section */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Login</h2>
            <p className="text-gray-600">Login cepat untuk testing</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleQuickLogin('superadmin')}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1">Super Admin</h3>
              <p className="text-xs opacity-90">Sistem</p>
            </button>
            
            <button
              onClick={() => handleQuickLogin('admin')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1">Perawat</h3>
              <p className="text-xs opacity-90">Admin</p>
            </button>
            
            <button
              onClick={() => handleQuickLogin('pmo')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold mb-1">Keluarga</h3>
              <p className="text-xs opacity-90">PMO</p>
            </button>
          </div>
        </div> */}

        {/* Regular Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Manual</h2>
            <p className="text-gray-600">Masuk dengan kredensial Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Masukkan kata sandi Anda"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.662-2.337A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.662 2.337A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.938-1.938M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.938 4.675A9.956 9.956 0 0112 21c2.21 0 4.267-.72 5.938-1.938M21 12c0 1.657-.336 3.236-.938 4.675m-1.662 2.337A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-6 border border-blue-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Informasi Login</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span><strong>Keluarga (PMO):</strong> Mengawasi 1 pasien TB</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span><strong>Perawat (Admin):</strong> Mengelola beberapa pasien TB</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span><strong>Super Admin:</strong> Mengelola seluruh sistem</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span><strong>Quick Login:</strong> Untuk testing dan demo aplikasi</span>
            </div>
          </div>
        </div> */}
      </div>
    </ModernLayout>
  );
};

export default Login;
