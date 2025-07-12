import React, { useState } from 'react';
import ModernLayout from '../layouts/ModernLayout';

const DashboardPMO: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const patientInfo = {
    name: 'Ahmad Rizki',
    age: 35,
    phase: 'Intensif',
    startDate: '15 Januari 2024',
    endDate: '15 April 2024',
    compliance: 95,
    status: 'Aktif',
    nextConsultation: '25 Maret 2024'
  };

  const medicationSchedule = [
    { day: 'Senin', time: '08:00', taken: true, status: 'Selesai' },
    { day: 'Selasa', time: '08:00', taken: true, status: 'Selesai' },
    { day: 'Rabu', time: '08:00', taken: true, status: 'Selesai' },
    { day: 'Kamis', time: '08:00', taken: false, status: 'Hari Ini' },
    { day: 'Jumat', time: '08:00', taken: false, status: 'Belum' },
    { day: 'Sabtu', time: '08:00', taken: false, status: 'Belum' },
    { day: 'Minggu', time: '08:00', taken: false, status: 'Belum' }
  ];

  const recentReports = [
    { id: 1, date: '20 Maret 2024', time: '08:30', condition: 'Sehat', sideEffects: 'Tidak ada' },
    { id: 2, date: '19 Maret 2024', time: '08:15', condition: 'Batuk Ringan', sideEffects: 'Mual ringan' },
    { id: 3, date: '18 Maret 2024', time: '08:45', condition: 'Sehat', sideEffects: 'Tidak ada' },
    { id: 4, date: '17 Maret 2024', time: '08:20', condition: 'Sehat', sideEffects: 'Tidak ada' }
  ];

  const quickActions = [
    {
      title: 'Laporkan Minum Obat',
      description: 'Konfirmasi konsumsi obat hari ini',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Riwayat Laporan',
      description: 'Lihat laporan sebelumnya',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Edukasi TB',
      description: 'Pelajari tentang TB',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Hubungi Perawat',
      description: 'Konsultasi dengan perawat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { label: 'Kepatuhan Minggu Ini', value: '95%', change: '+2%', color: 'from-green-500 to-green-600' },
    { label: 'Hari Pengobatan', value: '65', change: '+1', color: 'from-blue-500 to-blue-600' },
    { label: 'Laporan Terkirim', value: '65', change: '+1', color: 'from-purple-500 to-purple-600' },
    { label: 'Sisa Pengobatan', value: '25', change: '-1', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <ModernLayout title="Dashboard PMO" subtitle="Awasi pengobatan TB pasien Anda">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Ibu Siti!</h1>
            <p className="text-blue-100">Awasi pengobatan TB untuk Ahmad Rizki</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {patientInfo.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{patientInfo.name}</h2>
              <p className="text-gray-600">{patientInfo.age} tahun • {patientInfo.phase}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              patientInfo.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {patientInfo.status}
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Kepatuhan</p>
            <p className="text-2xl font-bold text-green-600">{patientInfo.compliance}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Mulai Pengobatan</p>
            <p className="text-sm font-semibold text-gray-800">{patientInfo.startDate}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Selesai Pengobatan</p>
            <p className="text-sm font-semibold text-gray-800">{patientInfo.endDate}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Konsultasi Berikutnya</p>
            <p className="text-sm font-semibold text-gray-800">{patientInfo.nextConsultation}</p>
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
            <span className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>{stat.change}</span>
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
            <h2 className="text-xl font-bold text-gray-800">Jadwal Minum Obat Minggu Ini</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {medicationSchedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    schedule.taken ? 'bg-green-500' : 
                    schedule.status === 'Hari Ini' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{schedule.day}</h3>
                    <p className="text-sm text-gray-600">{schedule.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  schedule.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                  schedule.status === 'Hari Ini' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Laporan Terbaru</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{report.date}</h3>
                    <p className="text-sm text-gray-600">{report.time} • {report.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Efek Samping:</span>
                  <p className="text-sm font-medium text-gray-800">{report.sideEffects}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Progress Pengobatan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hari Ke-65</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">72%</p>
            <p className="text-sm text-gray-600">dari total 90 hari</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Kepatuhan</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">95%</p>
            <p className="text-sm text-gray-600">rata-rata</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Sisa Hari</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">25</p>
            <p className="text-sm text-gray-600">hari lagi</p>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default DashboardPMO; 