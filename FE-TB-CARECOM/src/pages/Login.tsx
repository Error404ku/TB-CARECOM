import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'pmo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickLogin = (role: string) => {
    // Simulate quick login for testing
    console.log(`Quick login as ${role}`);
    // Here you would typically set auth context and redirect
    if (role === 'superadmin') {
      // Navigate to super admin dashboard
      navigate('/superadmin');
    } else if (role === 'admin') {
      // Navigate to nurse dashboard
      navigate('/dashboardadmin');
    } else if (role === 'pmo') {
      // Navigate to family dashboard
      navigate('/dashboardpmo');
    }
  };

  return (
    <ModernLayout title="Masuk ke TB CareCom" subtitle="Akses dashboard Anda untuk mengelola pengobatan TB">
      <div className="max-w-md mx-auto">
        {/* Quick Login Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 mb-8">
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
        </div>

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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan kata sandi Anda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peran
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="pmo">Keluarga Pasien (PMO)</option>
                <option value="admin">Perawat (Admin)</option>
                <option value="superadmin">Super Admin</option>
              </select>
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
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-6 border border-blue-200/50">
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
        </div>
      </div>
    </ModernLayout>
  );
};

export default Login;
