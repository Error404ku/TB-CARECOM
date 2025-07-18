// features/admin/pages/EducationalMaterials.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEducationalMaterialsAdmin } from '../hooks';
import type { EducationalMaterial } from '../../education/types';
import ModernLayout from '../../../layouts/ModernLayout';
import LoadingOverlay from '../../../components/LoadingOverlay';
import Swal from 'sweetalert2';

const EducationalMaterials: React.FC = () => {
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'updated_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Create filters object with useMemo to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    page: currentPage,
    per_page: perPage,
    search: searchTerm || undefined,
    sort_by: sortBy,
    order_by: sortOrder
  }), [currentPage, perPage, searchTerm, sortBy, sortOrder]);

  const { materials, loading, error, createMaterial, updateMaterial, deleteMaterial, refetch, pagination } = useEducationalMaterialsAdmin();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<EducationalMaterial | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null as File | null,
    public_id: '',
    url_file: ''
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    refetch({
      page: 1,
      per_page: perPage,
      search: searchTerm || undefined,
      sort_by: sortBy,
      order_by: sortOrder
    });
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    refetch({
      page: 1,
      per_page: perPage,
      search: undefined,
      sort_by: sortBy,
      order_by: sortOrder
    });
  };

  // Handle sorting
  const handleSort = (field: 'title' | 'created_at' | 'updated_at') => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    setCurrentPage(1);
    refetch({
      page: 1,
      per_page: perPage,
      search: searchTerm || undefined,
      sort_by: field,
      order_by: newOrder
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch({
      page: page,
      per_page: perPage,
      search: searchTerm || undefined,
      sort_by: sortBy,
      order_by: sortOrder
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    refetch({
      page: 1,
      per_page: newPerPage,
      search: searchTerm || undefined,
      sort_by: sortBy,
      order_by: sortOrder
    });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.total_pages;
    const pages = [];
    
    // Show max 5 pages
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      file: null,
      public_id: '',
      url_file: ''
    });
  };

  // Handle create material
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createMaterial({
      title: formData.title,
      content: formData.content,
      file: formData.file || undefined,
      public_id: formData.public_id || undefined,
      url_file: formData.url_file || undefined
    });

    if (success) {
      setShowCreateModal(false);
      resetForm();
      // Refresh the list after creating
      refetch(filters);
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Materi edukasi berhasil dibuat',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error || 'Terjadi kesalahan saat membuat materi edukasi',
      });
    }
  };

  // Handle edit material
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    const success = await updateMaterial(selectedMaterial.id, {
      title: formData.title,
      content: formData.content,
      file: formData.file || undefined,
      public_id: formData.public_id || undefined,
      url_file: formData.url_file || undefined
    });

    if (success) {
      setShowEditModal(false);
      setSelectedMaterial(null);
      resetForm();
      // Refresh the list after updating
      refetch(filters);
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Materi edukasi berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error || 'Terjadi kesalahan saat memperbarui materi edukasi',
      });
    }
  };

  // Handle delete material
  const handleDelete = async (material: EducationalMaterial) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus materi "${material.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const success = await deleteMaterial(material.id);
      if (success) {
        // Refresh the list after deleting
        refetch(filters);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Materi edukasi berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error || 'Terjadi kesalahan saat menghapus materi edukasi',
        });
      }
    }
  };

  // Open edit modal
  const openEditModal = (material: EducationalMaterial) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      content: material.content,
      file: null, // Reset file when editing
      public_id: material.public_id,
      url_file: material.url_file
    });
    setShowEditModal(true);
  };

  // Open detail modal
  const openDetailModal = (material: EducationalMaterial) => {
    setSelectedMaterial(material);
    setShowDetailModal(true);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tidak diketahui';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ModernLayout title="Manajemen Materi Edukasi" subtitle="Kelola konten edukasi TB untuk semua role">
      {loading && <LoadingOverlay show={loading} />}
      
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

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Materi Edukasi</h2>
        <p className="text-gray-600">Kelola materi edukasi TB yang dapat diakses oleh semua role</p>
      </div>

      {/* Search, Filter and Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari judul atau konten..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-3 bg-red-500 text-white rounded-r-xl hover:bg-red-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          {/* Sort, Per Page, and Add Button Controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 w-full lg:w-auto">
            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Urutkan:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field] = e.target.value.split('-') as ['title' | 'created_at' | 'updated_at', 'asc' | 'desc'];
                  handleSort(field);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="created_at-desc">Terbaru</option>
                <option value="created_at-asc">Terlama</option>
                <option value="title-asc">Judul A-Z</option>
                <option value="title-desc">Judul Z-A</option>
                <option value="updated_at-desc">Update Terbaru</option>
                <option value="updated_at-asc">Update Terlama</option>
              </select>
            </div>

            {/* Per Page */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Tampilkan:</label>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tambah Materi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {pagination && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600">
            Menampilkan {materials.length} dari {pagination.total_items} materi edukasi
            {searchTerm && (
              <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Pencarian: "{searchTerm}"
              </span>
            )}
            <span className="ml-2 text-sm text-gray-500">
              (Halaman {currentPage} dari {pagination.total_pages})
            </span>
          </div>
          
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Hapus Filter
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Terjadi Kesalahan</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-200"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        {materials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konten
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {material.url_file && (
                          <img
                            src={material.url_file}
                            alt={material.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{material.title}</div>
                          <div className="text-sm text-gray-500">ID: {material.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {material.content.substring(0, 100)}
                        {material.content.length > 100 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(material.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openDetailModal(material)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          title="Lihat Detail"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(material)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(material)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                          title="Hapus"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Materi Edukasi</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tidak ada hasil yang ditemukan untuk pencarian Anda.' : 'Mulai dengan menambahkan materi edukasi pertama Anda.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Tambah Materi Pertama
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
              {generatePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {pagination.total_pages > 5 && currentPage < pagination.total_pages - 2 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(pagination.total_pages)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    {pagination.total_pages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Selanjutnya
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Halaman {currentPage} dari {pagination.total_pages} • Total {pagination.total_items} materi
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Tambah Materi Edukasi</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Materi</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    placeholder="Masukkan judul materi edukasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    placeholder="Masukkan konten materi edukasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File (Opsional)</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    accept="image/*,application/pdf,.doc,.docx"
                  />
                  <p className="text-sm text-gray-500 mt-1">Pilih file gambar atau dokumen untuk materi edukasi</p>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Public ID (Opsional)</label>
                  <input
                    type="text"
                    value={formData.public_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, public_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Masukkan public ID file"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL File (Opsional)</label>
                  <input
                    type="url"
                    value={formData.url_file}
                    onChange={(e) => setFormData(prev => ({ ...prev, url_file: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/file.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Atau masukkan URL file yang sudah ada</p>
                </div> */}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Materi Edukasi</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMaterial(null);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

                             <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Materi</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File (Opsional)</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    accept="image/*,application/pdf,.doc,.docx"
                  />
                  <p className="text-sm text-gray-500 mt-1">Pilih file baru jika ingin mengganti file yang ada</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Public ID</label>
                  <input
                    type="text"
                    value={formData.public_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, public_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL File</label>
                  <input
                    type="url"
                    value={formData.url_file}
                    onChange={(e) => setFormData(prev => ({ ...prev, url_file: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Atau masukkan URL file yang sudah ada</p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedMaterial(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200"
                  >
                    {loading ? 'Menyimpan...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Detail Materi Edukasi</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedMaterial(null);
                  }}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {selectedMaterial.url_file && (
                  <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden">
                    <img
                      src={selectedMaterial.url_file}
                      alt={selectedMaterial.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedMaterial.title}</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedMaterial.content}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">ID: {selectedMaterial.id}</p>
                    <p className="text-sm text-gray-500">Public ID: {selectedMaterial.public_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dibuat: {formatDate(selectedMaterial.created_at)}</p>
                    {selectedMaterial.updated_at && (
                      <p className="text-sm text-gray-500">Diperbarui: {formatDate(selectedMaterial.updated_at)}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => openEditModal(selectedMaterial)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Edit Materi
                  </button>
                  {selectedMaterial.url_file && (
                    <a
                      href={selectedMaterial.url_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      Lihat File
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModernLayout>
  );
};

export default EducationalMaterials; 