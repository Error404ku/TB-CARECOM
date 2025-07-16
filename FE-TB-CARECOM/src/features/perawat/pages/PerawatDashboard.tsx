// features/perawat/pages/PerawatDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../hooks';
import ModernLayout from '../../../layouts/ModernLayout';

const PerawatDashboard: React.FC = () => {
  const { patients, loading } = usePatients({ status: 'aktif' });

  // Calculate quick stats
  const totalActivePatients = patients.length;
  const malePatients = patients.filter(p => p.gender === 'L').length;
  const femalePatients = patients.filter(p => p.gender === 'P').length;

  const StatCard = ({ title, value, color, icon }: {
    title: string;
    value: number | string;
    color: string;
    icon: string;
  }) => (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-white bg-opacity-20">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{loading ? '...' : value}</p>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, to, color, icon }: {
    title: string;
    description: string;
    to: string;
    color: string;
    icon: string;
  }) => (
    <Link
      to={to}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-xl text-white">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

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
          <span className="text-blue-600 text-sm font-medium">{Math.round((malePatients/totalActivePatients)*100) || 0}%</span>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">👩</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{loading ? '...' : femalePatients}</h3>
          <p className="text-gray-600 text-sm mb-2">Pasien Perempuan</p>
          <span className="text-pink-600 text-sm font-medium">{Math.round((femalePatients/totalActivePatients)*100) || 0}%</span>
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
          
          <Link
            to="/perawat/patients"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-left block"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl text-white">📈</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Laporan</h3>
            <p className="text-sm text-gray-600">Buat dan lihat laporan monitoring</p>
          </Link>
        </div>
      </div>

      {/* Recent Patients */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Pasien Terbaru</h2>
          <Link
            to="/perawat/patients"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Lihat Semua →
          </Link>
        </div>
        
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
            <p className="text-center text-gray-500">Memuat data pasien...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
            <p className="text-center text-gray-500">Belum ada pasien yang ditugaskan</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mulai Pengobatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.slice(0, 5).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-sm">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          patient.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(patient.start_treatment_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/perawat/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
};

export default PerawatDashboard; 