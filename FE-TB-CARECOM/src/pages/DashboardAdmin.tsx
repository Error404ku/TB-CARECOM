import React from 'react';
import ModernLayout from '../layouts/ModernLayout';

const DashboardAdmin: React.FC = () => {


  const stats = [
    { label: 'Total Pasien', value: '8', change: '+1', color: 'from-blue-500 to-blue-600' },
    { label: 'Kepatuhan Rata-rata', value: '92%', change: '+3%', color: 'from-green-500 to-green-600' },
    { label: 'Laporan Hari Ini', value: '5', change: '+2', color: 'from-purple-500 to-purple-600' },
    { label: 'Pasien Aktif', value: '7', change: '+1', color: 'from-orange-500 to-orange-600' }
  ];

  const patients = [
    { id: 1, name: 'Ahmad Rizki', age: 35, phase: 'Intensif', compliance: 95, status: 'Aktif', lastReport: '2 jam lalu' },
    { id: 2, name: 'Siti Nurhaliza', age: 28, phase: 'Lanjutan', compliance: 88, status: 'Aktif', lastReport: '1 hari lalu' },
    { id: 3, name: 'Budi Santoso', age: 42, phase: 'Intensif', compliance: 92, status: 'Aktif', lastReport: '3 jam lalu' },
    { id: 4, name: 'Dewi Sartika', age: 31, phase: 'Lanjutan', compliance: 78, status: 'Perlu Perhatian', lastReport: '2 hari lalu' },
    { id: 5, name: 'Rudi Hartono', age: 45, phase: 'Intensif', compliance: 85, status: 'Aktif', lastReport: '5 jam lalu' },
    { id: 6, name: 'Maya Indah', age: 29, phase: 'Lanjutan', compliance: 90, status: 'Aktif', lastReport: '1 hari lalu' }
  ];

  const recentReports = [
    { id: 1, patient: 'Ahmad Rizki', time: '08:30', status: 'Terkirim', condition: 'Sehat' },
    { id: 2, patient: 'Budi Santoso', time: '08:15', status: 'Terkirim', condition: 'Batuk Ringan' },
    { id: 3, patient: 'Rudi Hartono', time: '08:45', status: 'Terkirim', condition: 'Sehat' },
    { id: 4, patient: 'Dewi Sartika', time: '09:00', status: 'Pending', condition: 'Demam' }
  ];

  const quickActions = [
    {
      title: 'Tambah Pasien',
      description: 'Daftarkan pasien baru',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Kelola PMO',
      description: 'Atur pengawas minum obat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Laporan Bulanan',
      description: 'Generate laporan periode',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Konsultasi',
      description: 'Jadwal konsultasi pasien',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <ModernLayout title="Dashboard Perawat" subtitle="Kelola pasien TB yang Anda tangani">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Suster Sarah!</h1>
            <p className="text-purple-100">Kelola 8 pasien TB yang Anda tangani</p>
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
        {/* Patients List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Daftar Pasien</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.age} tahun • {patient.phase}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      patient.compliance >= 90 ? 'text-green-600' : 
                      patient.compliance >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {patient.compliance}%
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      patient.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                      patient.status === 'Perlu Perhatian' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{patient.lastReport}</p>
                </div>
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    report.status === 'Terkirim' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{report.patient}</h3>
                    <p className="text-sm text-gray-600">{report.time} • {report.condition}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  report.status === 'Terkirim' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Treatment Overview */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Overview Pengobatan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Fase Intensif</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">4</p>
            <p className="text-sm text-gray-600">Pasien</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Fase Lanjutan</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">4</p>
            <p className="text-sm text-gray-600">Pasien</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Selesai</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">0</p>
            <p className="text-sm text-gray-600">Pasien</p>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default DashboardAdmin; 