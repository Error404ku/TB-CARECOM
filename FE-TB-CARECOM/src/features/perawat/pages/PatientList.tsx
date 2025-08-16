// features/perawat/pages/PatientList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../hooks';
import { perawatUtils } from '../services';
import type { PatientParams } from '../types';
import ModernLayout from '../../../layouts/ModernLayout';
import { exportPatientsToExcel, exportPatientsToPDF } from '../../../utils/exportHelpers';
import Swal from 'sweetalert2';

const PatientList: React.FC = () => {
  const [searchParams, setSearchParams] = useState<PatientParams>({
    search: '',
    status: '',
    sort_by: 'created_at',
    order_by: 'desc',
    per_page: 10
  });

  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const { patients, loading, error, pagination, refetch } = usePatients();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(searchParams);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof PatientParams, value: string) => {
    const newParams = { ...searchParams, [key]: value };
    setSearchParams(newParams);
    refetch(newParams);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    refetch(newParams);
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    setExporting('excel');
    try {
      const success = await exportPatientsToExcel();
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Berhasil!',
          text: 'Data pasien berhasil diekspor ke Excel',
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
    setExporting('pdf');
    try {
      const success = await exportPatientsToPDF();
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Berhasil!',
          text: 'Data pasien berhasil diekspor ke PDF',
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

  return (
    <ModernLayout title="Daftar Pasien" subtitle="Kelola pasien TB yang ditugaskan kepada Anda">

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Pasien
              </label>
              <input
                type="text"
                value={searchParams.search || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Nama pasien..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={searchParams.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
                <option value="sembuh">Sembuh</option>
                <option value="pindah">Pindah</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan
              </label>
              <select
                value={`${searchParams.sort_by}-${searchParams.order_by}`}
                onChange={(e) => {
                  const [sort_by, order_by] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                  handleFilterChange('sort_by', sort_by);
                  handleFilterChange('order_by', order_by);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at-desc">Terbaru</option>
                <option value="created_at-asc">Terlama</option>
                <option value="name-asc">Nama A-Z</option>
                <option value="name-desc">Nama Z-A</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cari
              </button>
            </div>
          </div>
        </form>

        {/* Export Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Export Data</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleExportExcel}
                disabled={exporting === 'excel'}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {exporting === 'excel' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mengekspor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Excel</span>
                  </>
                )}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting === 'pdf'}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {exporting === 'pdf' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mengekspor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Memuat data pasien...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : !patients || patients.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Anda tidak memiliki pasien.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Telepon
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
                  {(patients || []).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {patient.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perawatUtils.formatGender(patient.gender)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.no_telp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${perawatUtils.getStatusBadgeColor(patient.status)}`}>
                          {perawatUtils.formatPatientStatus(patient.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perawatUtils.formatDate(patient.start_treatment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/perawat/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Detail
                        </Link>
                        {/* <Link
                          to={`/perawat/patients/${patient.id}/monitoring`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Monitoring
                        </Link> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Menampilkan {((pagination.page - 1) * pagination.per_page) + 1} sampai{' '}
                    {Math.min(pagination.page * pagination.per_page, pagination.total_items)} dari{' '}
                    {pagination.total_items} hasil
                  </div>
                  <div className="flex space-x-2">
                    {pagination.page > 1 && (
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                      >
                        Sebelumnya
                      </button>
                    )}
                    {pagination.page < pagination.total_pages && (
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                      >
                        Selanjutnya
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ModernLayout>
  );
};

export default PatientList; 