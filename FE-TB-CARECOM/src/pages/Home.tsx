import React from 'react';
import { Link } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';

const Home: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Pelaporan Digital',
      description: 'Laporkan konsumsi obat dan kondisi kesehatan dengan mudah melalui barcode'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Edukasi Terpadu',
      description: 'Akses informasi lengkap tentang TB dan cara pengobatan yang benar'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Monitoring Real-time',
      description: 'Pantau perkembangan pengobatan dan kepatuhan pasien secara real-time'
    }
  ];

  const stats = [
    { number: '500+', label: 'Pasien Terdaftar' },
    { number: '95%', label: 'Tingkat Kepatuhan' },
    { number: '50+', label: 'PMO Aktif' },
    { number: '24/7', label: 'Dukungan' }
  ];

  return (
    <ModernLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 rounded-3xl"></div>
        <div className="relative text-center py-16 px-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Selamat Datang di TB CareCom
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Platform digital terpadu untuk monitoring dan edukasi pengobatan Tuberculosis di Indonesia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Mulai Sekarang
            </Link>
            <Link
              to="/edukasi"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan solusi lengkap untuk pengobatan TB yang efektif dan mudah diakses
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dampak Positif Kami
            </h2>
            <p className="text-blue-100 text-lg">
              Bersama-sama kita wujudkan Indonesia bebas TB
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center border border-gray-200/50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Siap Bergabung?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan PMO dan tenaga kesehatan lainnya dalam perjuangan melawan TB
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/login"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default Home; 