// features/admin/pages/PMODetail.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPMOById, getDailyMonitoringByPatientIdAdmin } from '../../../api/adminApi';
import { type PMO, type DailyMonitoringAdmin } from '../../../api/adminApi';
import ModernLayout from '../../../layouts/ModernLayout';
import Swal from 'sweetalert2';

const PMODetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pmo, setPMO] = useState<PMO | null>(null);
  const [dailyMonitoring, setDailyMonitoring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Load PMO data
  useEffect(() => {
    const fetchPMOData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getPMOById(parseInt(id));
        
        if (response.data.meta.code === 200) {
          setPMO(response.data.data);
        } else {
          setError('PMO tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching PMO:', error);
        setError('Gagal memuat data PMO');
      } finally {
        setLoading(false);
      }
    };

    fetchPMOData();
  }, [id]);

  // Load daily monitoring data when monitoring tab is selected
  useEffect(() => {
    const fetchMonitoringData = async () => {
      if (selectedTab !== 'monitoring' || !pmo) return;
      
      try {
        setMonitoringLoading(true);
        // Get monitoring data using patient ID from PMO
        const patientId = pmo.patient_id || pmo.patient?.id;
        if (!patientId) {
          console.warn('No patient ID available for monitoring data');
          setDailyMonitoring([]);
          return;
        }
        
        const response = await getDailyMonitoringByPatientIdAdmin(patientId);
        
        if (response.data?.meta?.code === 200) {
          setDailyMonitoring(response.data.data || []);
        } else {
          setDailyMonitoring([]);
        }
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
        setDailyMonitoring([]);
      } finally {
        setMonitoringLoading(false);
      }
    };

    fetchMonitoringData();
  }, [selectedTab, pmo]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return 'bg-green-100 text-green-800';
      case 'sembuh':
        return 'bg-blue-100 text-blue-800';
      case 'gagal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ModernLayout title="Detail PMO" subtitle="Memuat data PMO...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <svg className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600">Memuat data PMO...</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (error || !pmo) {
    return (
      <ModernLayout title="Detail PMO" subtitle="Error">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{error || 'PMO Tidak Ditemukan'}</h3>
          <p className="text-gray-600 mb-6">Data PMO yang diminta tidak dapat ditemukan atau terjadi kesalahan.</p>
          <Link
            to="/admin/pmo"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar PMO
          </Link>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout title={`Detail PMO - ${pmo.name}`} subtitle="Informasi lengkap tentang PMO dan pengawasan pengobatan">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/admin/pmo"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar PMO
        </Link>
      </div>

      {/* Header dengan informasi PMO */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                {pmo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{pmo.name}</h1>
              <p className="text-green-100 text-sm md:text-base">
                PMO untuk pasien {pmo.patient.name}
              </p>
              <p className="text-green-100 text-xs md:text-sm">
                Hubungan: {pmo.relationship}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-green-100 text-sm">Bergabung sejak</p>
              <p className="text-lg font-semibold">{formatDate(pmo.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 md:mb-8">
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-gray-200/50">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'patient', label: 'Data Pasien', icon: '👤' },
            { id: 'monitoring', label: 'Riwayat Monitoring', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm md:text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* PMO Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Informasi PMO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <p className="text-gray-800 font-medium text-base">{pmo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                  <p className="text-gray-800 text-base">
                    {pmo.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <p className="text-gray-800 text-base">{pmo.no_telp}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hubungan dengan Pasien</label>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {pmo.relationship}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Bergabung</label>
                  <p className="text-gray-800 text-base">{formatDate(pmo.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Terakhir Update</label>
                  <p className="text-gray-800 text-base">{formatDate(pmo.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Account Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Akun Pengguna</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama User</label>
                <p className="text-gray-800 font-medium text-base">{pmo.user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-800 text-base">{pmo.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Tab */}
      {selectedTab === 'patient' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Informasi Pasien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pasien</label>
                <p className="text-gray-800 font-medium text-base">{pmo.patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <p className="text-gray-800 text-base">{pmo.patient.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <p className="text-gray-800 text-base">
                  {pmo.patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <p className="text-gray-800 text-base">{pmo.patient.no_telp}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status Pengobatan</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pmo.patient.status)}`}>
                  {pmo.patient.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {selectedTab === 'monitoring' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Riwayat Daily Monitoring</h2>
          
          {monitoringLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data monitoring...</p>
            </div>
          ) : dailyMonitoring.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-2">Belum Ada Data Monitoring</h3>
              <p className="text-gray-500">Belum ada laporan monitoring harian untuk pasien ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyMonitoring.map((monitoring, index) => (
                <div key={monitoring.id || index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-base">
                            {monitoring.medication_time ? formatDateTime(monitoring.medication_time) : 'Waktu tidak tersedia'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Laporan Monitoring #{monitoring.id || index + 1}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {monitoring.description || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ModernLayout>
  );
};

export default PMODetail; 