import React, { useState } from 'react';
import ModernLayout from '../layouts/ModernLayout';

const SuperAdmin: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { label: 'Total Perawat', value: '24', change: '+3', color: 'from-purple-500 to-purple-600' },
    { label: 'Total Pasien', value: '156', change: '+12', color: 'from-blue-500 to-blue-600' },
    { label: 'Total PMO', value: '156', change: '+12', color: 'from-green-500 to-green-600' },
    { label: 'Kepatuhan Rata-rata', value: '94%', change: '+2%', color: 'from-orange-500 to-orange-600' }
  ];

  const nurses = [
    { id: 1, name: 'Suster Sarah Johnson', email: 'sarah.johnson@puskesmas.com', patients: 8, status: 'Aktif' },
    { id: 2, name: 'Suster Budi Santoso', email: 'budi.santoso@puskesmas.com', patients: 6, status: 'Aktif' },
    { id: 3, name: 'Suster Dewi Sartika', email: 'dewi.sartika@puskesmas.com', patients: 7, status: 'Aktif' },
    { id: 4, name: 'Suster Rudi Hartono', email: 'rudi.hartono@puskesmas.com', patients: 5, status: 'Cuti' }
  ];

  const recentActivities = [
    { type: 'Perawat Baru', description: 'Suster Sarah Johnson ditambahkan', time: '2 jam lalu', status: 'Selesai' },
    { type: 'Pasien Baru', description: 'Ahmad Rizki didaftarkan', time: '4 jam lalu', status: 'Selesai' },
    { type: 'Laporan Bulanan', description: 'Laporan Maret 2024 di-generate', time: '1 hari lalu', status: 'Selesai' },
    { type: 'Sistem Update', description: 'Update sistem v2.1.0', time: '2 hari lalu', status: 'Pending' }
  ];

  const quickActions = [
    {
      title: 'Tambah Perawat',
      description: 'Daftarkan perawat baru',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Kelola Puskesmas',
      description: 'Atur data puskesmas',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Laporan Sistem',
      description: 'Generate laporan menyeluruh',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi aplikasi',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <ModernLayout title="Super Admin Dashboard" subtitle="Kelola seluruh sistem TB CareCom">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Super Admin!</h1>
            <p className="text-red-100">Kelola seluruh sistem pengobatan TB secara menyeluruh</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <span className="text-green-600 text-sm font-medium">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Nurses Management */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Daftar Perawat</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {nurses.map((nurse) => (
              <div key={nurse.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {nurse.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{nurse.name}</h3>
                    <p className="text-sm text-gray-600">{nurse.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-purple-600">
                      {nurse.patients} pasien
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      nurse.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {nurse.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Aktivitas Terbaru</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'Perawat Baru' ? 'bg-purple-500' :
                  activity.type === 'Pasien Baru' ? 'bg-blue-500' :
                  activity.type === 'Laporan Bulanan' ? 'bg-green-500' :
                  'bg-orange-500'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{activity.description}</h3>
                  <p className="text-sm text-gray-600">{activity.time} • {activity.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  activity.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Overview Sistem</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Perawat Aktif</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">24</p>
            <p className="text-sm text-gray-600">dari 25 total</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Pasien TB</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">156</p>
            <p className="text-sm text-gray-600">dalam pengobatan</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Kepatuhan</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">94%</p>
            <p className="text-sm text-gray-600">rata-rata</p>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default SuperAdmin; 