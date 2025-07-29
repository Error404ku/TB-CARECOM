// features/pmo/pages/PMOMonitoringPage.tsx
import React, { useState } from 'react';
import { usePMOMonitoring } from '../hooks';
import { type PMOMonitoringFilters } from '../types';
import ModernLayout from '../../../layouts/ModernLayout';
import { exportPMOMonitoringToExcel, exportPMOMonitoringToPDF } from '../../../utils/exportHelpers';
import Swal from 'sweetalert2';

const PMOMonitoringPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<PMOMonitoringFilters>({
    search: '',
    start_date: '',
    end_date: '',
    sort_by: 'created_at',
    order_by: 'desc',
    per_page: 10
  });

  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const { monitoring, loading, error, pagination, refetch } = usePMOMonitoring();

  // Debug pagination state
  console.log('Current PMO pagination state:', pagination);
  console.log('Current PMO monitoring data:', monitoring);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('PMO Search submitted with params:', searchParams);
    refetch(searchParams);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof PMOMonitoringFilters, value: string) => {
    console.log('PMO Filter change:', key, '=', value);
    const newParams = { ...searchParams, [key]: value };
    console.log('PMO New filter params:', newParams);
    console.log('PMO Sorting params:', { sort_by: newParams.sort_by, order_by: newParams.order_by });
    setSearchParams(newParams);
    refetch(newParams);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    console.log('PMO Changing to page:', page);
    console.log('PMO Current searchParams:', searchParams);
    const newParams = { ...searchParams, page };
    console.log('PMO New params for refetch:', newParams);
    setSearchParams(newParams);
    refetch(newParams);
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    setExporting('excel');
    try {
      const success = await exportPMOMonitoringToExcel();
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Berhasil!',
          text: 'Data monitoring PMO berhasil diekspor ke Excel',
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
      const success = await exportPMOMonitoringToPDF();
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Export Berhasil!',
          text: 'Data monitoring PMO berhasil diekspor ke PDF',
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
    <ModernLayout title="Monitoring PMO" subtitle="Kelola dan pantau laporan monitoring harian pasien TB">
      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </select>
            </div>

            {/* Per Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Halaman
              </label>
              <select
                value={searchParams.per_page || 10}
                onChange={(e) => handleFilterChange('per_page', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleExportExcel}
            disabled={exporting === 'excel'}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {exporting === 'excel' ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {exporting === 'pdf' ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mengekspor...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monitoring Data */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data monitoring...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Server Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => refetch(searchParams)}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mencoba...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Coba Lagi</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  const defaultParams = {
                    search: '',
                    start_date: '',
                    end_date: '',
                    sort_by: 'created_at',
                    order_by: 'desc',
                    per_page: 10
                  };
                  setSearchParams(defaultParams);
                  refetch(defaultParams);
                }}
                disabled={loading}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Minum Obat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!monitoring || monitoring.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data monitoring
                      </td>
                    </tr>
                  ) : (
                    monitoring.map((item: any, index: number) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {((pagination?.page || 1) - 1) * (searchParams.per_page || 10) + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.medication_time || 'Tidak diketahui'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={item.description}>
                            {item.description || 'Tidak ada deskripsi'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total_items > 0 && (
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

export default PMOMonitoringPage; 