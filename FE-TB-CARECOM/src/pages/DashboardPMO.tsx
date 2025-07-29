import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';
import { 
  getPMODashboard,
  getAllDailyMonitoring,
  updatePatientData, 
  updateDailyMonitoring,
  getPatientQRCode,
  type DailyMonitoringEntry,
  type PatientData,
  type UpdatePatientRequest,
  type UpdateDailyMonitoringRequest,
  type DashboardData
} from '../api/pmoApi';

// Local interface for UI form (uses full gender names)
interface UpdatePatientUIRequest {
  name: string;
  address: string;
  gender: 'Perempuan' | 'Laki-laki';
  no_telp: string;
  status: 'aktif' | 'sembuh' | 'gagal';
}
import { showSuccess, showError, showConfirm } from '../utils/sweetAlert';
import { useAuth } from '../store/AuthContext';
import * as QRCode from 'qrcode';

const DashboardPMO: React.FC = () => {
  const { authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dailyMonitoring, setDailyMonitoring] = useState<DailyMonitoringEntry[]>([]);

  // Helper functions for gender mapping
  const mapGenderFromAPI = (apiGender: string): 'Perempuan' | 'Laki-laki' => {
    return apiGender === 'P' ? 'Perempuan' : 'Laki-laki';
  };

  const mapGenderToAPI = (uiGender: 'Perempuan' | 'Laki-laki'): 'P' | 'L' => {
    return uiGender === 'Perempuan' ? 'P' : 'L';
  };
  
  // Edit states
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [editPatientData, setEditPatientData] = useState<UpdatePatientUIRequest>({
    name: '',
    address: '',
    gender: 'Laki-laki',
    no_telp: '',
    status: 'aktif'
  });
  
  const [editingMonitoring, setEditingMonitoring] = useState<DailyMonitoringEntry | null>(null);
  const [editMonitoringData, setEditMonitoringData] = useState<UpdateDailyMonitoringRequest>({
    medication_time: '',
    description: ''
  });

  // Track loading per tab
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);

  // Transform dashboard patient data to PatientData format for compatibility
  const getPatientDataFromDashboard = (dashboard: DashboardData): PatientData | null => {
    if (!dashboard?.patient) return null;
    
    return {
      id: dashboard.patient.id,
      name: dashboard.patient.name,
      address: dashboard.patient.address,
      gender: dashboard.patient.gender === 'P' ? 'Perempuan' : 'Laki-laki',
      no_telp: dashboard.patient.no_telp,
      status: dashboard.patient.status,
      pmo: {
        id: dashboard.pmo.id,
        name: dashboard.pmo.name,
        relationship: dashboard.pmo.relationship,
        no_telp: dashboard.pmo.no_telp
      },
      assignedNurse: {
        id: dashboard.patient.assigned_nurse.id,
        name: dashboard.patient.assigned_nurse.name,
        email: dashboard.patient.assigned_nurse.email,
        rs: dashboard.patient.assigned_nurse.rs
      }
    };
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    if (dashboardData || loadingDashboard) return;
    setLoadingDashboard(true);
    try {
      const response = await getPMODashboard();
      if (response.data?.meta?.code === 200 && response.data?.data?.data) {
        setDashboardData(response.data.data.data);
        
        // Initialize edit form with current patient data
        const patient = response.data.data.data.patient;
        setEditPatientData({
          name: patient.name,
          address: patient.address,
          gender: mapGenderFromAPI(patient.gender),
          no_telp: patient.no_telp,
          status: patient.status as 'aktif' | 'sembuh' | 'gagal'
        });
      } else if (response.data?.meta?.code === 404 || response.data?.meta?.code === 401) {
        console.warn('Dashboard API issue:', response.data.meta.message);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Gagal Memuat Data', 'Terjadi kesalahan saat memuat data dashboard.');
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Lazy load daily monitoring data (only for monitoring tab)
  const loadDailyMonitoringLazy = async () => {
    if (dailyMonitoring.length > 0 || loadingMonitoring) return;
    setLoadingMonitoring(true);
    try {
      const response = await getAllDailyMonitoring();
      if (response.data?.meta?.code === 200 && response.data?.data) {
        setDailyMonitoring(response.data.data);
      } else if (response.data?.meta?.code === 404 || response.data?.meta?.code === 401) {
        console.warn('Daily monitoring API issue:', response.data.meta.message);
        setDailyMonitoring([]);
      } else {
        setDailyMonitoring([]);
      }
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      showError('Gagal Memuat Data', 'Terjadi kesalahan saat memuat data monitoring.');
      setDailyMonitoring([]);
    } finally {
      setLoadingMonitoring(false);
    }
  };

  // Load data on tab change
  useEffect(() => {
    if (!authLoading) {
      if (selectedTab === 'overview') {
        // Overview: only load dashboard data (monitoring removed for performance)
        if (!dashboardData) loadDashboardData();
      } else if (selectedTab === 'patient') {
        if (!dashboardData) loadDashboardData();
      } else if (selectedTab === 'monitoring') {
        window.location.href = '/pmo/monitoring';
        // if (dailyMonitoring.length === 0) loadDailyMonitoringLazy();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, authLoading]);

  // Reload helpers for edit
  const reloadDashboardData = async () => {
    setDashboardData(null);
    await loadDashboardData();
  };
  const reloadMonitoringData = async () => {
    setDailyMonitoring([]);
    await loadDailyMonitoringLazy();
  };

  const handleUpdatePatient = async () => {
    try {
      const result = await showConfirm(
        'Update Data Pasien',
        'Apakah Anda yakin ingin mengupdate data pasien?'
      );

      if (result.isConfirmed) {
        // Map UI data to API format
        const apiData: UpdatePatientRequest = {
          name: editPatientData.name,
          address: editPatientData.address,
          gender: mapGenderToAPI(editPatientData.gender),
          no_telp: editPatientData.no_telp,
          status: editPatientData.status
        };
        
        const response = await updatePatientData(apiData);
        const isSuccess = (response.data as any)?.meta?.code === 200 || (response.data as any)?.status === 200;
        
        if (isSuccess) {
          // reload halaman 
          window.location.reload();
          showSuccess('Berhasil!', 'Data pasien berhasil diperbarui.');
          setIsEditingPatient(false);
          reloadDashboardData(); // Reload data
        } else {
          const errorMessage = (response.data as any)?.meta?.message || 
                              (response.data as any)?.message || 
                              'Terjadi kesalahan saat mengupdate data pasien.';
          showError('Gagal Update', errorMessage);
        }
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      showError('Gagal Update', 'Terjadi kesalahan saat mengupdate data pasien.');
    }
  };

  const handleUpdateMonitoring = async () => {
    if (!editingMonitoring) return;
    
    try {
      const result = await showConfirm(
        'Update Data Monitoring',
        'Apakah Anda yakin ingin mengupdate data monitoring ini?'
      );

      if (result.isConfirmed) {
        // Prepare request data according to API specification
        const requestData: UpdateDailyMonitoringRequest = {
          id: editingMonitoring.id, // Include ID for identifying which record to update
          medication_time: editMonitoringData.medication_time,
          description: editMonitoringData.description
        };

        const response = await updateDailyMonitoring(requestData);
        
        // Handle both response formats (meta and status) with type casting
        const responseData = response.data as any;
        const isSuccess = responseData?.meta?.code === 200 || 
                         responseData?.status === 200 ||
                         (response as any)?.status === 200;
        
        if (isSuccess) {
          showSuccess('Berhasil!', 'Data monitoring berhasil diperbarui.');
          setEditingMonitoring(null);
          reloadMonitoringData(); // Reload data
          
          // Optional: reload page after successful update
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const errorMessage = responseData?.meta?.message || 
                              responseData?.message || 
                              'Terjadi kesalahan saat mengupdate data monitoring.';
          showError('Gagal Update', errorMessage);
        }
      }
    } catch (error) {
      console.error('Error updating monitoring:', error);
      showError('Gagal Update', 'Terjadi kesalahan saat mengupdate data monitoring.');
    }
  };

  const startEditingMonitoring = (monitoring: DailyMonitoringEntry) => {
    setEditingMonitoring(monitoring);
    setEditMonitoringData({
      medication_time: monitoring.medication_time,
      description: monitoring.description
    });
  };

  const cancelEditingMonitoring = () => {
    setEditingMonitoring(null);
    setEditMonitoringData({
      medication_time: '',
      description: ''
    });
  };

  const handleDownloadQRCode = async () => {
    try {
      // Get QR code data from API
      const response = await getPatientQRCode();
      
      if (response.data.meta.code === 200 && response.data.data) {
        // Get QR code URL from environment variable
        const qrCodeBaseUrl = import.meta.env.VITE_QRCODE_URL;
        
        if (!qrCodeBaseUrl) {
          showError('Konfigurasi Error', 'VITE_QRCODE_URL belum dikonfigurasi di environment variables.');
          return;
        }
        
        // Combine base URL with the UUID from API response
        const qrCodeUrl = `${qrCodeBaseUrl}${response.data.data}`;
        
        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(qrCodeUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        // Create download link
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = `qr-code-${dashboardData?.patient?.name || 'patient'}-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccess('Berhasil!', 'QR Code berhasil didownload.');
      } else {
        showError('Gagal Download', response.data.meta.message || 'Tidak dapat mengambil data QR code.');
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      showError('Gagal Download', 'Terjadi kesalahan saat mendownload QR code.');
    }
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

  // Get transformed patient data for compatibility
  const patientData = dashboardData ? getPatientDataFromDashboard(dashboardData) : null;

  if (authLoading || (selectedTab === 'overview' && loadingDashboard) || (selectedTab === 'patient' && loadingDashboard) || (selectedTab === 'monitoring' && loadingMonitoring)) {
    return (
      <ModernLayout title="Dashboard PMO" subtitle="Memuat data...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <svg className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600">
              {authLoading ? 'Memverifikasi autentikasi...' : 'Memuat data dashboard...'}
            </p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout title="Dashboard PMO" subtitle="Kelola pengobatan TB pasien Anda">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 md:p-8 text-white mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Selamat Datang, {dashboardData?.pmo?.name || 'PMO'}!
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              {dashboardData 
                ? `Kelola pengobatan TB untuk ${dashboardData.patient.name}`
                : 'Dashboard PMO untuk mengelola pengobatan TB pasien'
              }
            </p>
          </div>
          <div className="hidden md:block ml-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
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
            { id: 'monitoring', label: 'Daily Monitoring', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
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
        <div className="space-y-8">
          {!dashboardData ? (
            /* No Data State */
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-5v2a1 1 0 01-1 1h-1m-1 0H9m4 0V8a1 1 0 011-1h1m0 0V6h1m0 0h1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Data Tidak Tersedia</h3>
              <p className="text-gray-500">
                API backend belum tersedia. Silakan hubungi administrator untuk mengaktifkan layanan.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/50">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1 truncate">{patientData?.name}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2">Nama Pasien</p>
                  <span className={`text-xs md:text-sm font-medium px-2 py-1 rounded ${getStatusColor(patientData?.status || '')}`}>
                    {patientData?.status}
                  </span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/50">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1">{dashboardData.daily_monitoring}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2">Total Monitoring</p>
                  <span className="text-xs md:text-sm font-medium text-green-600">Laporan</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/50">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1 truncate">{dashboardData.pmo.name}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2">PMO</p>
                  <span className="text-xs md:text-sm font-medium text-purple-600 truncate block">{dashboardData.pmo.relationship}</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/50">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1 truncate">{dashboardData.perawat.name}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2">Perawat</p>
                  <span className="text-xs md:text-sm font-medium text-orange-600 truncate block">{dashboardData.perawat.rs}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/pmo/monitoring"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Monitoring Harian</h4>
                        <p className="text-blue-100 text-sm">Lihat dan kelola laporan monitoring dengan fitur lengkap</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}


        </div>
      )}

      {/* Patient Tab */}
      {selectedTab === 'patient' && (
        !dashboardData ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Data Pasien Tidak Tersedia</h3>
            <p className="text-gray-500">
              API data pasien belum tersedia. Silakan hubungi administrator untuk mengaktifkan layanan.
            </p>
          </div>
        ) : (
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Data Pasien</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadQRCode}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 4h5a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm0 13h5a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5a1 1 0 011-1zm13-13h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1V5a1 1 0 011-1z" />
                  </svg>
                  <span>Download QR</span>
                </button>
                <button
                  onClick={() => setIsEditingPatient(!isEditingPatient)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${
                    isEditingPatient
                      ? 'bg-gray-500 text-white hover:bg-gray-600'
                      : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg'
                  }`}
                >
                  {isEditingPatient ? 'Batal' : 'Edit Data'}
                </button>
              </div>
            </div>

            {isEditingPatient ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editPatientData.name}
                      onChange={(e) => setEditPatientData({...editPatientData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <textarea
                      value={editPatientData.address}
                      onChange={(e) => setEditPatientData({...editPatientData, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                    <select
                      value={editPatientData.gender}
                      onChange={(e) => setEditPatientData({...editPatientData, gender: e.target.value as 'Perempuan' | 'Laki-laki'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={editPatientData.no_telp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setEditPatientData({...editPatientData, no_telp: value});
                      }}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Pengobatan</label>
                    <select
                      value={editPatientData.status}
                      onChange={(e) => setEditPatientData({...editPatientData, status: e.target.value as 'aktif' | 'sembuh' | 'gagal'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="sembuh">Sembuh</option>
                      <option value="gagal">Gagal</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleUpdatePatient}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <p className="text-gray-800 font-medium text-sm md:text-base">{patientData?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat</label>
                    <p className="text-gray-800 text-sm md:text-base">{patientData?.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                    <p className="text-gray-800 text-sm md:text-base">{patientData?.gender}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <p className="text-gray-800 text-sm md:text-base">{patientData?.no_telp}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status Pengobatan</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(patientData?.status || '')}`}>
                      {patientData?.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PMO and Nurse Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Informasi PMO</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama PMO</label>
                  <p className="text-gray-800 text-sm md:text-base">{dashboardData.pmo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hubungan</label>
                  <p className="text-gray-800 text-sm md:text-base">{dashboardData.pmo.relationship}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <p className="text-gray-800 text-sm md:text-base">{dashboardData.pmo.no_telp}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Perawat yang Ditugaskan</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Perawat</label>
                  <p className="text-gray-800 text-sm md:text-base">{dashboardData.perawat.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-800 text-sm md:text-base">{dashboardData.perawat.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rumah Sakit</label>
                  <p className="text-gray-800 text-sm md:text-base">{dashboardData.perawat.rs}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* Daily Monitoring Tab */}
      {selectedTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Riwayat Daily Monitoring</h2>
            {dailyMonitoring.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-600 mb-2">Belum Ada Data Monitoring</h3>
                <p className="text-gray-500 text-sm md:text-base">
                  Data monitoring harian belum tersedia atau API belum aktif. Silakan hubungi administrator.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyMonitoring.map((monitoring) => (
                <div key={monitoring.id} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
                  {editingMonitoring?.id === monitoring.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Minum Obat</label>
                          <input
                            type="datetime-local"
                            value={editMonitoringData.medication_time.replace(' ', 'T').slice(0, 16)}
                            onChange={(e) => setEditMonitoringData({
                              ...editMonitoringData,
                              medication_time: e.target.value.replace('T', ' ') + ':00'
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                          <textarea
                            value={editMonitoringData.description}
                            onChange={(e) => setEditMonitoringData({
                              ...editMonitoringData,
                              description: e.target.value
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleUpdateMonitoring}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={cancelEditingMonitoring}
                          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 text-sm"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 md:space-x-4 mb-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                              {new Date(monitoring.medication_time).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600">Pasien: {monitoring.patient.name}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{monitoring.description}</p>
                      </div>
                      <button
                        onClick={() => startEditingMonitoring(monitoring)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-sm self-start"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ModernLayout>
  );
};

export default DashboardPMO; 