// features/admin/pages/PMOManagement.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePMOs } from '../hooks';
import { type CreatePMORequest, type PMOFilters } from '../types';
import ModernLayout from '../../../layouts/ModernLayout';
import Swal from 'sweetalert2';
import { getAllPatients } from '../../../api/adminApi';

const PMOManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useState<PMOFilters>({
    search: '',
    sort_by: 'created_at',
    order_by: 'desc',
    per_page: 10
  });

  const {
    pmos,
    loading,
    error,
    pagination,
    fetchPMOs,
    createNewPMO,
    updatePMOData,
    deletePMOData
  } = usePMOs(searchParams);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPMO, setEditingPMO] = useState<any>(null);
  const [formData, setFormData] = useState<CreatePMORequest>({
    patient_id: '',
    name: '',
    no_telp: '',
    gender: 'L',
    relationship: ''
  });
  const [patients, setPatients] = useState<any[]>([]);

  // Fetch patients saat modal tambah dibuka
  React.useEffect(() => {
    if (showCreateModal || showEditModal) {
      getAllPatients().then((res) => {
        setPatients(res.data.data || []);
      });
    }
  }, [showCreateModal, showEditModal]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPMOs(searchParams);
  };

  const handleFilterChange = (key: keyof PMOFilters, value: string | number) => {
    const newParams = { ...searchParams, [key]: value };
    setSearchParams(newParams);
    fetchPMOs(newParams);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createNewPMO(formData);
    if (success) {
      setShowCreateModal(false);
      setFormData({ patient_id: '', name: '', no_telp: '', gender: 'L', relationship: '' });
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'PMO berhasil dibuat',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPMO) return;

    const success = await updatePMOData(editingPMO.id, formData);
    if (success) {
      setShowEditModal(false);
      setEditingPMO(null);
      setFormData({ patient_id: '', name: '', no_telp: '', gender: 'L', relationship: '' });
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data PMO berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleEdit = (pmo: any) => {
    setEditingPMO(pmo);
    setFormData({
      patient_id: pmo.patient?.id?.toString() || '',
      name: pmo.name,
      no_telp: pmo.no_telp,
      gender: pmo.gender,
      relationship: pmo.relationship
    });
    setShowEditModal(true);
  };

  const handleDelete = async (pmo: any) => {
    const result = await Swal.fire({
      title: 'Hapus PMO?',
      text: `Apakah Anda yakin ingin menghapus PMO ${pmo.name}? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const success = await deletePMOData(pmo.id);
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'PMO berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ModernLayout title="Manajemen PMO" subtitle="Kelola data PMO (Pengawas Menelan Obat)">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/admin/dashboard"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Header dengan tombol tambah */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar PMO</h2>
          <p className="text-gray-600">Kelola semua data PMO dan pengawas pengobatan</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah PMO</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari PMO</label>
              <input
                type="text"
                value={searchParams.search || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Nama PMO atau pasien..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
              <select
                value={searchParams.sort_by || 'created_at'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="created_at">Tanggal Dibuat</option>
                <option value="name">Nama PMO</option>
                <option value="relationship">Hubungan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urutan</label>
              <select
                value={searchParams.order_by || 'desc'}
                onChange={(e) => handleFilterChange('order_by', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="desc">Terbaru ke Terlama</option>
                <option value="asc">Terlama ke Terbaru</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat data PMO...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPMOs()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : pmos.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Tidak ada data PMO ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PMO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hubungan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Account
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
                  {pmos.map((pmo) => (
                    <tr key={pmo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-sm">
                              {pmo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pmo.name}</div>
                            <div className="text-sm text-gray-500">
                              {pmo.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pmo.patient.name}</div>
                        <div className="text-sm text-gray-500">{pmo.patient.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {pmo.relationship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pmo.no_telp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pmo.user.name}</div>
                        <div className="text-sm text-gray-500">{pmo.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(pmo.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/admin/pmo/${pmo.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Detail
                        </Link>
                        <button
                          onClick={() => handleEdit(pmo)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pmo)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
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
                        onClick={() => handleFilterChange('page', pagination.page - 1)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                      >
                        Sebelumnya
                      </button>
                    )}
                    {pagination.page < pagination.total_pages && (
                      <button
                        onClick={() => handleFilterChange('page', pagination.page + 1)}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah PMO Baru</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pasien</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, patient_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Pilih Pasien</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - {p.address}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama PMO</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  type="text"
                  value={formData.no_telp}
                  onChange={(e) => setFormData(prev => ({ ...prev, no_telp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Orang Tua, Saudara, dll"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPMO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit PMO</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pasien</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, patient_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Pilih Pasien</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - {p.address}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama PMO</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  type="text"
                  value={formData.no_telp}
                  onChange={(e) => setFormData(prev => ({ ...prev, no_telp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPMO(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModernLayout>
  );
};

export default PMOManagement; 