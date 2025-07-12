import React, { useState } from 'react';
import ModernLayout from '../layouts/ModernLayout';

const DashboardUser: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { label: 'Hari Pengobatan', value: '45/180', change: '+1 hari', color: 'from-blue-500 to-blue-600' },
    { label: 'Kepatuhan', value: '95%', change: '+2%', color: 'from-green-500 to-green-600' },
    { label: 'Laporan Terakhir', value: '2 hari lalu', change: 'Tepat waktu', color: 'from-purple-500 to-purple-600' },
    { label: 'Status', value: 'Aktif', change: 'Baik', color: 'from-orange-500 to-orange-600' }
  ];

  const medicationSchedule = [
    { time: '08:00', medication: 'Rifampisin + Isoniazid + Pirazinamid + Etambutol', taken: true },
    { time: '20:00', medication: 'Rifampisin + Isoniazid + Pirazinamid + Etambutol', taken: false },
    { time: '08:00', medication: 'Rifampisin + Isoniazid + Pirazinamid + Etambutol', taken: false },
    { time: '20:00', medication: 'Rifampisin + Isoniazid + Pirazinamid + Etambutol', taken: false }
  ];

  const recentActivities = [
    { type: 'Laporan', description: 'Minum obat pagi hari', time: '08:30', status: 'Terkirim' },
    { type: 'Konsultasi', description: 'Konsultasi dengan PMO', time: '10:15', status: 'Selesai' },
    { type: 'Edukasi', description: 'Menyelesaikan modul TB', time: '14:20', status: 'Selesai' },
    { type: 'Laporan', description: 'Minum obat malam hari', time: '20:00', status: 'Terkirim' }
  ];

  const quickActions = [
    {
      title: 'Laporkan Obat',
      description: 'Laporkan konsumsi obat hari ini',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Riwayat Laporan',
      description: 'Lihat laporan sebelumnya',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Edukasi TB',
      description: 'Akses materi edukasi',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Konsultasi',
      description: 'Hubungi PMO',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <ModernLayout title="Dashboard Pasien" subtitle="Kelola pengobatan TB Anda dengan mudah">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Ahmad!</h1>
            <p className="text-blue-100">Fase Intensif • Hari ke-45 dari 180 hari</p>
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: '25%' }}
                ></div>
              </div>
              <p className="text-blue-100 text-sm mt-2">25% pengobatan selesai</p>
            </div>
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
        {/* Medication Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Jadwal Minum Obat</h2>
            <span className="text-sm text-gray-500">Hari ini</span>
          </div>
          <div className="space-y-4">
            {medicationSchedule.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    med.taken ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {med.taken ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{med.time}</h3>
                    <p className="text-sm text-gray-600">{med.medication}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  med.taken ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {med.taken ? 'Sudah' : 'Belum'}
                </span>
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
                  activity.type === 'Laporan' ? 'bg-blue-500' :
                  activity.type === 'Konsultasi' ? 'bg-green-500' :
                  'bg-purple-500'
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
                  activity.status === 'Terkirim' || activity.status === 'Selesai' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-6 border border-blue-200/50">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Tips Kesehatan Hari Ini</h2>
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
    </ModernLayout>
  );
};

export default DashboardUser; 