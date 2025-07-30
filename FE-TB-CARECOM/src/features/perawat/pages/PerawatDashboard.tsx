// features/perawat/pages/PerawatDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPerawatDashboard, type PerawatDashboardStats } from '../../../api/perawatApi';
import ModernLayout from '../../../layouts/ModernLayout';

const PerawatDashboard: React.FC = () => {
  const [stats, setStats] = useState<PerawatDashboardStats['patient']>({ active: 0, male: 0, female: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getPerawatDashboard();
        if (response.data?.data?.data?.patient) {
          setStats(response.data.data.data.patient);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalActivePatients = stats.active;
  const malePatients = stats.male;
  const femalePatients = stats.female;
  const malePercent = totalActivePatients > 0 ? Math.round((malePatients/totalActivePatients)*100) : 0;
  const femalePercent = totalActivePatients > 0 ? Math.round((femalePatients/totalActivePatients)*100) : 0;

  return (
    <ModernLayout title="Dashboard Perawat" subtitle="Kelola dan pantau pasien TB yang ditugaskan kepada Anda">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Perawat!</h1>
            <p className="text-purple-100">Kelola {totalActivePatients} pasien TB yang ditugaskan kepada Anda</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{loading ? '...' : totalActivePatients}</h3>
          <p className="text-gray-600 text-sm mb-2">Total Pasien Aktif</p>
          <span className="text-green-600 text-sm font-medium">Aktif</span>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">👨</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{loading ? '...' : malePatients}</h3>
          <p className="text-gray-600 text-sm mb-2">Pasien Laki-laki</p>
          <span className="text-blue-600 text-sm font-medium">{malePercent}%</span>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">👩</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{loading ? '...' : femalePatients}</h3>
          <p className="text-gray-600 text-sm mb-2">Pasien Perempuan</p>
          <span className="text-pink-600 text-sm font-medium">{femalePercent}%</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/perawat/patients"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-left block"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl text-white">📋</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Daftar Pasien</h3>
            <p className="text-sm text-gray-600">Lihat dan kelola semua pasien yang ditugaskan</p>
          </Link>
          
          <Link
            to="/perawat/patients"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-left block"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl text-white">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Monitoring Harian</h3>
            <p className="text-sm text-gray-600">Pantau progress pengobatan harian pasien</p>
          </Link>
          
          {/* <Link
            to="/perawat/patients"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-left block"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl text-white">📈</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Laporan</h3>
            <p className="text-sm text-gray-600">Buat dan lihat laporan monitoring</p>
          </Link> */}
        </div>
      </div>

     
    </ModernLayout>
  );
};

export default PerawatDashboard; 