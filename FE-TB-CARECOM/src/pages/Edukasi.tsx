import React from 'react';
import ModernLayout from '../layouts/ModernLayout';

const Edukasi: React.FC = () => {
  const categories = [
    {
      title: 'Pengenalan TB',
      description: 'Memahami dasar-dasar penyakit Tuberculosis',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      articles: [
        { title: 'Apa itu Tuberculosis?', duration: '5 menit', level: 'Pemula' },
        { title: 'Gejala dan Tanda TB', duration: '8 menit', level: 'Pemula' },
        { title: 'Cara Penularan TB', duration: '6 menit', level: 'Pemula' }
      ]
    },
    {
      title: 'Pengobatan TB',
      description: 'Panduan lengkap pengobatan Tuberculosis',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      articles: [
        { title: 'Fase Pengobatan TB', duration: '10 menit', level: 'Menengah' },
        { title: 'Jenis Obat TB', duration: '12 menit', level: 'Menengah' },
        { title: 'Efek Samping Obat', duration: '7 menit', level: 'Menengah' }
      ]
    },
    {
      title: 'Pencegahan TB',
      description: 'Cara mencegah penularan Tuberculosis',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
      articles: [
        { title: 'Vaksin BCG', duration: '6 menit', level: 'Pemula' },
        { title: 'Gaya Hidup Sehat', duration: '8 menit', level: 'Pemula' },
        { title: 'Kebersihan Lingkungan', duration: '5 menit', level: 'Pemula' }
      ]
    },
    {
      title: 'Nutrisi & Diet',
      description: 'Panduan nutrisi untuk pasien TB',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      articles: [
        { title: 'Makanan Sehat untuk TB', duration: '9 menit', level: 'Menengah' },
        { title: 'Vitamin dan Mineral', duration: '7 menit', level: 'Menengah' },
        { title: 'Menu Harian Seimbang', duration: '10 menit', level: 'Menengah' }
      ]
    }
  ];

  const featuredArticles = [
    {
      title: 'Panduan Lengkap Pengobatan TB',
      excerpt: 'Pelajari semua hal tentang pengobatan Tuberculosis dari diagnosis hingga penyembuhan.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '15 menit',
      level: 'Lengkap'
    },
    {
      title: 'Tips Kepatuhan Minum Obat',
      excerpt: 'Cara memastikan kepatuhan minum obat untuk keberhasilan pengobatan TB.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8 menit',
      level: 'Praktis'
    },
    {
      title: 'Dukungan Keluarga untuk Pasien TB',
      excerpt: 'Peran penting keluarga dalam mendukung kesembuhan pasien TB.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '12 menit',
      level: 'Keluarga'
    }
  ];

  return (
    <ModernLayout title="Edukasi TB" subtitle="Pelajari semua hal tentang Tuberculosis dan pengobatannya">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Edukasi Tuberculosis</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Akses materi edukasi lengkap tentang TB, dari pengenalan hingga tips praktis untuk pengobatan yang efektif
          </p>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Artikel Unggulan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {article.level}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">⏱ {article.duration}</span>
                  <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                    Baca Artikel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Kategori Edukasi</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {category.articles.map((article, articleIndex) => (
                  <div key={articleIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{article.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">⏱ {article.duration}</span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{article.level}</span>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all duration-200 text-sm">
                      Baca
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 border border-blue-200/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Tips Cepat</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Minum Obat Tepat Waktu</h3>
            <p className="text-gray-600">Kepatuhan minum obat adalah kunci keberhasilan pengobatan TB</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Nutrisi Seimbang</h3>
            <p className="text-gray-600">Konsumsi makanan bergizi untuk mendukung sistem kekebalan tubuh</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Konsultasi Rutin</h3>
            <p className="text-gray-600">Lakukan pemeriksaan rutin untuk memantau perkembangan pengobatan</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Butuh Bantuan Lebih Lanjut?</h2>
        <p className="text-xl text-gray-600 mb-6">
          Tim edukasi kami siap membantu Anda memahami lebih dalam tentang TB dan pengobatannya
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            Hubungi Konsultan
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
            Download Materi
          </button>
        </div>
      </div>
    </ModernLayout>
  );
};

export default Edukasi; 