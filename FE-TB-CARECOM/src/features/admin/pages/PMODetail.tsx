// features/admin/pages/PMODetail.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDailyMonitoringByPatientIdAdmin } from '../../../api/adminApi';
import ModernLayout from '../../../layouts/ModernLayout';
import apiClient from '../../../api/client';

// Local interface for Nurse
interface Nurse {
  id: number;
  name: string;
  rs: string | null;
}

// Updated Patient interface to match new API structure
interface PatientData {
  id: number;
  name: string;
  address: string;
  gender: string;
  no_telp: string;
  start_treatment_date: string;
  diagnose_date: string;
  birth_date: string;
  status: string;
  pmo: {
    name: string;
    gender: string;
    no_telp: string;
    relationship: string;
  };
  assignedNurse: {
    id?: number;
    name: string;
    email: string;
    rs: string;
  };
  created_at: string;
  updated_at: string;
}

const PMODetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [dailyMonitoring, setDailyMonitoring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Update Patient states
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    address: '',
    gender: '',
    no_telp: '',
    start_treatment_date: '',
    diagnose_date: '',
    birth_date: '',
    assigned_nurse_id: '',
    status: ''
  });

  // Nurse selection states for admin
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [nurseSearchTerm, setNurseSearchTerm] = useState('');
  const [showNurseDropdown, setShowNurseDropdown] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  // Load Patient data by ID
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Use the patient endpoint instead of PMO endpoint
        const response = await apiClient.get(`/admin/patient/${id}`);
        
        if (response.data.meta.code === 200) {
          setPatientData(response.data.data);
          // Initialize form data with current patient data
          const patient = response.data.data;
          setPatientFormData({
            name: patient.name || '',
            address: patient.address || '',
            gender: patient.gender || '',
            no_telp: patient.no_telp || '',
            start_treatment_date: patient.start_treatment_date?.split('T')[0] || '',
            diagnose_date: patient.diagnose_date?.split('T')[0] || '',
            birth_date: patient.birth_date?.split('T')[0] || '',
            assigned_nurse_id: patient.assignedNurse?.id?.toString() || '',
            status: patient.status?.toLowerCase() || ''
          });
          
          // Set nurse search term if assigned nurse exists
          if (patient.assignedNurse) {
            setNurseSearchTerm(`${patient.assignedNurse.name} - ${patient.assignedNurse.rs}`);
            setSelectedNurse({
              id: patient.assignedNurse.id || 0,
              name: patient.assignedNurse.name,
              rs: patient.assignedNurse.rs
            });
          }
        } else {
          setError('Pasien tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        setError('Gagal memuat data pasien');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  // Load daily monitoring data when monitoring tab is selected
  useEffect(() => {
    const fetchMonitoringData = async () => {
      if (selectedTab !== 'monitoring' || !patientData) return;
      
      try {
        setMonitoringLoading(true);
        // Get monitoring data using patient ID
        const patientId = patientData.id;
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
  }, [selectedTab, patientData]);

  // Fetch nurses data when update-patient tab is selected
  useEffect(() => {
    if (selectedTab === 'update-patient' && nurses.length === 0) {
      fetchNurses();
    }
  }, [selectedTab]);

  const fetchNurses = async () => {
    setLoadingNurses(true);
    try {
      const response = await apiClient.get('/perawat');
      if (response.data && response.data.data) {
        setNurses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch nurses:', error);
    } finally {
      setLoadingNurses(false);
    }
  };

  const filteredNurses = nurses.filter(nurse => 
    nurse.name.toLowerCase().includes(nurseSearchTerm.toLowerCase()) ||
    (nurse.rs && nurse.rs.toLowerCase().includes(nurseSearchTerm.toLowerCase()))
  );

  const handleNurseSelect = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setPatientFormData({
      ...patientFormData,
      assigned_nurse_id: nurse.id.toString()
    });
    setNurseSearchTerm(`${nurse.name} - ${nurse.rs || 'Rumah Sakit tidak tersedia'}`);
    setShowNurseDropdown(false);
  };

  const handleNurseSearchChange = (value: string) => {
    setNurseSearchTerm(value);
    setShowNurseDropdown(value.length > 0);
    
    // Clear selection if search term is cleared
    if (value === '') {
      setSelectedNurse(null);
      setPatientFormData({
        ...patientFormData,
        assigned_nurse_id: ''
      });
    }
  };

  const handlePatientFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPatientFormData({
      ...patientFormData,
      [e.target.name]: e.target.value
    });
  };

  const handlePatientUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData?.id) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Format the request data according to the API specification
      const updateData = {
        name: patientFormData.name,
        address: patientFormData.address,
        gender: patientFormData.gender,
        no_telp: patientFormData.no_telp,
        start_treatment_date: patientFormData.start_treatment_date,
        diagnose_date: patientFormData.diagnose_date,
        birth_date: patientFormData.birth_date,
        assigned_nurse_id: parseInt(patientFormData.assigned_nurse_id),
        status: patientFormData.status
      };
      
      const response = await apiClient.put(`/admin/patient/${patientData.id}`, updateData);
      
      if (response.data.meta.code === 200) {
        setUpdateSuccess(true);
        // Update the local patient state with new data
        setPatientData(prev => prev ? {
          ...prev,
          ...updateData,
          assignedNurse: selectedNurse ? {
            name: selectedNurse.name,
            email: '',
            rs: selectedNurse.rs || ''
          } : prev.assignedNurse
        } : null);
        
        // Reset form to show updated data
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setUpdateError(response.data.meta.message || 'Gagal mengupdate data pasien');
      }
    } catch (error: any) {
      console.error('Error updating patient:', error);
      setUpdateError(error.response?.data?.meta?.message || 'Terjadi kesalahan saat mengupdate data pasien');
    } finally {
      setIsUpdating(false);
    }
  };

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
      <ModernLayout title="Detail Pasien" subtitle="Memuat data pasien...">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <svg className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600">Memuat data pasien...</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (error || !patientData) {
    return (
      <ModernLayout title="Detail Pasien" subtitle="Error">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{error || 'Pasien Tidak Ditemukan'}</h3>
          <p className="text-gray-600 mb-6">Data pasien yang diminta tidak dapat ditemukan atau terjadi kesalahan.</p>
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
    <ModernLayout title={`Detail Pasien - ${patientData.name}`} subtitle="Informasi lengkap tentang pasien dan pengawasan pengobatan">
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

      {/* Header dengan informasi Pasien */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                {patientData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{patientData.name}</h1>
              <p className="text-green-100 text-sm md:text-base">
                PMO: {patientData.pmo?.name || 'Belum ditentukan'}
              </p>
              <p className="text-green-100 text-xs md:text-sm">
                Hubungan: {patientData.pmo?.relationship || 'Belum ditentukan'}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-green-100 text-sm">Terdaftar sejak</p>
              <p className="text-lg font-semibold">{formatDate(patientData.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 md:mb-8">
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-gray-200/50 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'patient', label: 'Data Pasien', icon: '👤' },
            { id: 'update-patient', label: 'Update Pasien', icon: '✏️' },
            { id: 'monitoring', label: 'Riwayat Monitoring', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base ${
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
          {/* Patient Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Informasi Pasien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <p className="text-gray-800 font-medium text-base">{patientData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                  <p className="text-gray-800 text-base">
                    {patientData.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <p className="text-gray-800 text-base">{patientData.no_telp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alamat</label>
                  <p className="text-gray-800 text-base">{patientData.address}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Pengobatan</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patientData.status)}`}>
                    {patientData.status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Mulai Pengobatan</label>
                  <p className="text-gray-800 text-base">{formatDate(patientData.start_treatment_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Diagnosa</label>
                  <p className="text-gray-800 text-base">{formatDate(patientData.diagnose_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                  <p className="text-gray-800 text-base">{formatDate(patientData.birth_date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PMO Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Informasi PMO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama PMO</label>
                  <p className="text-gray-800 font-medium text-base">{patientData.pmo?.name || 'Belum ditentukan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                  <p className="text-gray-800 text-base">
                    {patientData.pmo?.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                  <p className="text-gray-800 text-base">{patientData.pmo?.no_telp || 'Belum ditentukan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hubungan dengan Pasien</label>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {patientData.pmo?.relationship || 'Belum ditentukan'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Nurse Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Perawat Yang Ditugaskan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Perawat</label>
                  <p className="text-gray-800 font-medium text-base">{patientData.assignedNurse?.name || 'Belum ditentukan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-800 text-base">{patientData.assignedNurse?.email || 'Belum ditentukan'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rumah Sakit</label>
                  <p className="text-gray-800 text-base">{patientData.assignedNurse?.rs || 'Belum ditentukan'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Tab */}
      {selectedTab === 'patient' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Detail Informasi Pasien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pasien</label>
                <p className="text-gray-800 font-medium text-base">{patientData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <p className="text-gray-800 text-base">{patientData.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <p className="text-gray-800 text-base">
                  {patientData.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <p className="text-gray-800 text-base">{patientData.no_telp}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status Pengobatan</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patientData.status)}`}>
                  {patientData.status?.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Mulai Pengobatan</label>
                <p className="text-gray-800 text-base">{formatDate(patientData.start_treatment_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Diagnosa</label>
                <p className="text-gray-800 text-base">{formatDate(patientData.diagnose_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <p className="text-gray-800 text-base">{formatDate(patientData.birth_date)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Patient Tab */}
      {selectedTab === 'update-patient' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Update Data Pasien</h2>
          
          {/* Success/Error Messages */}
          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Data pasien berhasil diupdate!
              </div>
            </div>
          )}
          
          {updateError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {updateError}
              </div>
            </div>
          )}

          <form onSubmit={handlePatientUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pasien *
                </label>
                <input
                  type="text"
                  name="name"
                  value={patientFormData.name}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Masukkan nama lengkap pasien"
                />
              </div>

              {/* Patient Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat *
                </label>
                <input
                  type="text"
                  name="address"
                  value={patientFormData.address}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Masukkan alamat lengkap pasien"
                />
              </div>

              {/* Patient Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin *
                </label>
                <select
                  name="gender"
                  value={patientFormData.gender}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* Patient Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  name="no_telp"
                  value={patientFormData.no_telp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const syntheticEvent = {
                      ...e,
                      target: {
                        ...e.target,
                        name: 'no_telp',
                        value: value
                      }
                    };
                    handlePatientFormChange(syntheticEvent);
                  }}
                  required
                  maxLength={13}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Contoh: 08123456789"
                />
              </div>

              {/* Diagnose Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Diagnosa *
                </label>
                <input
                  type="date"
                  name="diagnose_date"
                  value={patientFormData.diagnose_date}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={patientFormData.birth_date}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Patient Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Pengobatan *
                </label>
                <select
                  name="status"
                  value={patientFormData.status}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="">Pilih status</option>
                  <option value="aktif">Aktif</option>
                  <option value="sembuh">Sembuh</option>
                  <option value="gagal">Gagal</option>
                </select>
              </div>

                            {/* Start Treatment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai Pengobatan *
                </label>
                <input
                  type="date"
                  name="start_treatment_date"
                  value={patientFormData.start_treatment_date}
                  onChange={handlePatientFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Assigned Nurse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perawat Tugas *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nurseSearchTerm}
                    onChange={(e) => handleNurseSearchChange(e.target.value)}
                    onFocus={() => setShowNurseDropdown(true)}
                    onBlur={() => {
                      // Delay hiding dropdown to allow for selection
                      setTimeout(() => setShowNurseDropdown(false), 200);
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder={loadingNurses ? "Memuat data perawat..." : "Cari nama perawat atau rumah sakit..."}
                    disabled={loadingNurses}
                  />
                  
                  {/* Loading indicator */}
                  {loadingNurses && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Dropdown */}
                  {showNurseDropdown && !loadingNurses && filteredNurses.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {filteredNurses.map((nurse) => (
                        <div
                          key={nurse.id}
                          onClick={() => handleNurseSelect(nurse)}
                          className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{nurse.name}</p>
                              <p className="text-sm text-gray-600">
                                {nurse.rs || 'Rumah Sakit tidak tersedia'}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              ID: {nurse.id}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {showNurseDropdown && !loadingNurses && nurseSearchTerm && filteredNurses.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
                      <div className="px-4 py-3 text-center text-gray-500">
                        Tidak ada perawat yang ditemukan
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Selected nurse info */}
                {selectedNurse && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        Perawat terpilih: {selectedNurse.name} 
                        {selectedNurse.rs && ` - ${selectedNurse.rs}`}
                        <span className="text-green-600 ml-2">(ID: {selectedNurse.id})</span>
                      </span>
                    </div>
                  </div>
                )}
                
                <p className="mt-2 text-sm text-gray-500">
                  Ketik untuk mencari perawat berdasarkan nama atau rumah sakit
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Mengupdate...
                  </div>
                ) : (
                  'Update Data Pasien'
                )}
              </button>
            </div>
          </form>
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