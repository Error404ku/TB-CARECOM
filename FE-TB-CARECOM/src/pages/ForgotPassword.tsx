import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';
import { forgotPassword } from '../api/authApi';
import { showSuccess, showError } from '../utils/sweetAlert';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      showSuccess(
        'Email Berhasil Dikirim!',
        'Silakan periksa email Anda untuk mendapatkan link reset password.'
      );
    } catch (error: any) {
      const errorData = error?.response?.data;
      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      
      if (errorData?.errors?.email) {
        errorMessage = errorData.errors.email[0];
      } else if (errorData?.meta?.message) {
        errorMessage = errorData.meta.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      showError('Gagal Mengirim Email', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernLayout title="Lupa Kata Sandi" subtitle="Masukkan email Anda untuk menerima link reset password">
      <div className="mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Kata Sandi</h2>
            <p className="text-gray-600">
              {isSubmitted 
                ? 'Kami telah mengirimkan link reset password ke email Anda'
                : 'Masukkan email Anda dan kami akan mengirimkan link untuk reset password'
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan email Anda"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Email Terkirim!</h3>
                <p className="text-green-700 text-sm">
                  Kami telah mengirimkan link reset password ke <strong>{email}</strong>. 
                  Silakan periksa inbox email Anda (termasuk folder spam).
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Tidak menerima email?</p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Kirim ulang
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Login</span>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-6 border border-orange-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Informasi Reset Password</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Link reset password akan berlaku selama 24 jam</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Periksa folder spam jika email tidak masuk ke inbox</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Hubungi admin jika masih mengalami kendala</span>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ForgotPassword; 