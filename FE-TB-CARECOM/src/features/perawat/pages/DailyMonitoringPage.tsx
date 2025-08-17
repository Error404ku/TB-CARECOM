// features/perawat/pages/DailyMonitoringPage.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDailyMonitoring } from '../hooks';
import { perawatUtils } from '../services';
import type { DailyMonitoringParams } from '../types';
import ModernLayout from '../../../layouts/ModernLayout';
import { exportDailyMonitoringToExcel, exportDailyMonitoringToPDF } from '../../../utils/exportHelpers';
import Swal from 'sweetalert2';

const DailyMonitoringPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || '0');
  
  const [searchParams, setSearchParams] = useState<DailyMonitoringParams>({
    search: '',
    start_date: '',
    end_date: '',
    sort_by: 'created_at',
    order_by: 'desc',
    per_page: 10
  });

  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const { dailyMonitoring, loading, error, isEmpty, refetch } = useDailyMonitoring(patientId);

  // Get patient info from monitoring data if available
  const patient = dailyMonitoring && dailyMonitoring.length > 0 ? dailyMonitoring[0].patient : null;

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(patientId, searchParams);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof DailyMonitoringParams, value: string) => {
    const newParams = { ...searchParams, [key]: value };
    setSearchParams(newParams);
    refetch(patientId, newParams);
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    if (!patient) return;
    setExporting('excel');
    try {
      const success = await exportDailyMonitoringToExcel(patientId, patient.name, searchParams);
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Berhasil!',
          text: 'Data daily monitoring berhasil diekspor ke Excel sesuai filter yang aktif',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Export gagal');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Export Gagal!',
        text: 'Terjadi kesalahan saat mengekspor data ke Excel',
      });
    } finally {
      setExporting(null);
    }
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!patient) return;
    setExporting('pdf');
    try {
      const success = await exportDailyMonitoringToPDF(patientId, patient.name, searchParams);
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Berhasil!',
          text: 'Data daily monitoring berhasil diekspor ke PDF sesuai filter yang aktif',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Export gagal');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Export Gagal!',
        text: 'Terjadi kesalahan saat mengekspor data ke PDF',
      });
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <ModernLayout title="Daily Monitoring" subtitle="Memuat data...">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (error) {
    return (
      <ModernLayout title="Daily Monitoring" subtitle="Error">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => refetch(patientId)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4"
          >
            Coba Lagi
          </button>
          <Link
            to="/perawat/patients"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Kembali ke Daftar Pasien
          </Link>
        </div>
      </ModernLayout>
    );
  }

  if (isEmpty || !dailyMonitoring || dailyMonitoring.length === 0) {
    return (
      <ModernLayout title="Daily Monitoring" subtitle="Data monitoring harian">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 text-6xl">
            📊
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Data Monitoring</h3>
          <p className="text-gray-500 mb-6">
            Belum ada data monitoring harian untuk pasien ID: {patientId}
          </p>
          <div className="space-x-4">
            <Link
              to="/perawat/patients"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Kembali ke Daftar Pasien
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Data monitoring akan muncul setelah pasien melakukan pelaporan harian
          </p>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout title={`Monitoring Harian - ${patient?.name || 'Pasien'}`} subtitle="Data monitoring harian pasien">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/perawat/patients"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Daftar Pasien
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500">Monitoring Harian</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monitoring Harian</h1>
            <p className="text-gray-600 mt-2">
              Data monitoring harian untuk: <span className="font-semibold">{patient?.name || `Pasien ID ${patientId}`}</span>
            </p>
          </div>
          
          <Link
            to="/perawat/patients"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Kembali ke Daftar Pasien
          </Link>
        </div>
      </div>

      {/* Patient Summary Card - Simplified */}
      {patient && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {patient.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
              <p className="text-sm text-gray-600">
                ID Pasien: {patient.id} • Total Monitoring: {dailyMonitoring ? dailyMonitoring.length : 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Monitoring
              </label>
              <input
                type="text"
                value={searchParams.search || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Cari deskripsi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={searchParams.start_date || ''}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={searchParams.end_date || ''}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan
              </label>
              <select
                value={`${searchParams.sort_by}-${searchParams.order_by}`}
                onChange={(e) => {
                  const [sort_by, order_by] = e.target.value.split('-');
                  setSearchParams(prev => ({ ...prev, sort_by, order_by }));
                  refetch(patientId, { ...searchParams, sort_by, order_by });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at-desc">Terbaru</option>
                <option value="created_at-asc">Terlama</option>
                {/* <option value="medication_time-desc">Waktu Obat (Terbaru)</option>
                <option value="medication_time-asc">Waktu Obat (Terlama)</option> */}
              </select>
            </div>

            {/* Per Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data per Halaman
              </label>
              <select
                value={searchParams.per_page || 10}
                onChange={(e) => handleFilterChange('per_page', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={-1}>Tidak Terbatas</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Export Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-end space-x-2">
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={exporting === 'excel'}
        >
          {exporting === 'excel' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
          ) : (
            'Ekspor ke Excel'
          )}
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={exporting === 'pdf'}
        >
          {exporting === 'pdf' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
          ) : (
            'Ekspor ke PDF'
          )}
        </button>
      </div>

      {/* Monitoring Data */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {(dailyMonitoring || []).map((monitoring) => (
            <div key={monitoring.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ID: {monitoring.id}
                    </span>
                    <span className="text-sm text-gray-500">
                      Waktu Obat: {perawatUtils.formatDateTime(monitoring.medication_time)}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{monitoring.description}</p>
                  <div className="text-sm text-gray-500">
                    {monitoring.created_at && (
                      <p>Dicatat: {perawatUtils.formatDateTime(monitoring.created_at)}</p>
                    )}
                    {monitoring.updated_at && monitoring.updated_at !== monitoring.created_at && (
                      <p>Diperbarui: {perawatUtils.formatDateTime(monitoring.updated_at)}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModernLayout>
  );
};

export default DailyMonitoringPage; 