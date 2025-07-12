import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';

const RiwayatLaporan: React.FC = () => {
  const { barcodeId } = useParams();
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for history
  const historyData = [
    {
      id: 1,
      date: '2024-03-15',
      time: '08:30',
      medicationTaken: true,
      condition: 'Sehat',
      symptoms: ['Batuk Ringan'],
      sideEffects: '',
      notes: 'Minum obat tepat waktu',
      status: 'Terkirim'
    },
    {
      id: 2,
      date: '2024-03-14',
      time: '08:15',
      medicationTaken: true,
      condition: 'Batuk Ringan',
      symptoms: ['Batuk', 'Lelah'],
      sideEffects: 'Mual ringan',
      notes: 'Batuk berkurang, masih lelah',
      status: 'Terkirim'
    },
    {
      id: 3,
      date: '2024-03-13',
      time: '08:45',
      medicationTaken: false,
      condition: 'Demam',
      symptoms: ['Demam', 'Batuk', 'Sesak Nafas'],
      sideEffects: '',
      notes: 'Tidak minum obat karena demam tinggi',
      status: 'Terkirim'
    },
    {
      id: 4,
      date: '2024-03-12',
      time: '08:20',
      medicationTaken: true,
      condition: 'Sehat',
      symptoms: [],
      sideEffects: '',
      notes: 'Kondisi membaik',
      status: 'Terkirim'
    },
    {
      id: 5,
      date: '2024-03-11',
      time: '08:30',
      medicationTaken: true,
      condition: 'Batuk Ringan',
      symptoms: ['Batuk'],
      sideEffects: 'Mual',
      notes: 'Batuk masih ada, efek samping mual',
      status: 'Terkirim'
    }
  ];

  const filteredData = selectedFilter === 'all' 
    ? historyData 
    : historyData.filter(item => 
        selectedFilter === 'taken' ? item.medicationTaken : !item.medicationTaken
      );

  const stats = [
    { label: 'Total Laporan', value: historyData.length, color: 'from-blue-500 to-blue-600' },
    { label: 'Kepatuhan', value: `${Math.round((historyData.filter(item => item.medicationTaken).length / historyData.length) * 100)}%`, color: 'from-green-500 to-green-600' },
    { label: 'Hari Terakhir', value: '2 hari lalu', color: 'from-purple-500 to-purple-600' },
    { label: 'Status', value: 'Aktif', color: 'from-orange-500 to-orange-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terkirim': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Gagal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Sehat': return 'bg-green-100 text-green-800';
      case 'Batuk Ringan': return 'bg-yellow-100 text-yellow-800';
      case 'Demam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModernLayout title="Riwayat Laporan" subtitle="Lihat riwayat pelaporan pengobatan TB Anda">
      <div className="max-w-6xl mx-auto">
        {/* Patient Info Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ahmad Rizki</h2>
              <p className="text-blue-100">ID: {barcodeId || 'DEMO123'}</p>
              <p className="text-blue-100">Fase Pengobatan: Intensif (Hari ke-45)</p>
            </div>
            <div className="text-right">
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
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter and Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-800">Filter:</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedFilter === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedFilter('taken')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedFilter === 'taken'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Minum Obat
                </button>
                <button
                  onClick={() => setSelectedFilter('missed')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedFilter === 'missed'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tidak Minum
                </button>
              </div>
            </div>
            <Link
              to={`/scan/${barcodeId}`}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Buat Laporan Baru
            </Link>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    item.medicationTaken 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.medicationTaken ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {new Date(item.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-gray-600">Pukul {item.time}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Detail Laporan</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Konsumsi Obat:</span>
                      <span className={`text-sm font-medium ${
                        item.medicationTaken ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.medicationTaken ? 'Ya' : 'Tidak'}
                      </span>
                    </div>
                    {item.symptoms.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Gejala:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.symptoms.map((symptom, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.sideEffects && (
                      <div>
                        <span className="text-sm text-gray-600">Efek Samping:</span>
                        <span className="text-sm text-red-600 ml-2">{item.sideEffects}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Catatan</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.notes || 'Tidak ada catatan tambahan'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Lihat Detail
                    </button>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      Edit Laporan
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    ID: #{item.id.toString().padStart(4, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-gray-200/50">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Laporan</h3>
            <p className="text-gray-600 mb-6">Belum ada laporan yang sesuai dengan filter yang dipilih</p>
            <Link
              to={`/scan/${barcodeId}`}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Buat Laporan Pertama
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-6 border border-blue-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Aksi Cepat</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/scan/${barcodeId}`}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-center"
            >
              Buat Laporan Baru
            </Link>
            <Link
              to="/edukasi"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 text-center"
            >
              Materi Edukasi
            </Link>
            <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-center">
              Download Laporan
            </button>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default RiwayatLaporan; 