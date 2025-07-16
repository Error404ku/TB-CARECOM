// features/perawat/pages/PatientList.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../hooks';
import { perawatUtils } from '../services';
import type { PatientParams } from '../types';
import ModernLayout from '../../../layouts/ModernLayout';

const PatientList: React.FC = () => {
  const [searchParams, setSearchParams] = useState<PatientParams>({
    search: '',
    status: '',
    sort_by: 'created_at',
    order_by: 'desc',
    per_page: 10
  });

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
                value={searchParams.sort_by || 'created_at'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Tanggal Dibuat</option>
                <option value="name">Nama</option>
                <option value="start_treatment_date">Tanggal Mulai Pengobatan</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan
              </label>
              <select
                value={searchParams.order_by || 'desc'}
                onChange={(e) => handleFilterChange('order_by', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Terbaru ke Terlama</option>
                <option value="asc">Terlama ke Terbaru</option>
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
        ) : patients.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Tidak ada pasien ditemukan</p>
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
                  {patients.map((patient) => (
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
                        <Link
                          to={`/perawat/patients/${patient.id}/monitoring`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Monitoring
                        </Link>
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