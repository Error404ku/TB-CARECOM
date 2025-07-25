import React, { useState } from 'react';
import ModernLayout from '../layouts/ModernLayout';
import { useEducationalMaterials, useEducationPagination } from '../features/education/hooks';
import type { EducationalMaterial } from '../features/education/types';
import LoadingOverlay from '../components/LoadingOverlay';

// Helper functions for file handling
const getFileExtension = (url: string) => {
  if (!url) return '';
  // Handle Cloudinary URLs and other cloud storage URLs
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
  if (match) return match[1].toLowerCase();
  return '';
};

const isYouTubeUrl = (url: string) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\//.test(url);
};

const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : '';
};

// Helper function to get PDF URL for files without extension
// (No longer needed, just use url_file directly)
// Remove getPdfUrl usage from preview and download

// Helper function to render file preview
const renderFilePreview = (material: EducationalMaterial) => {
  const { url_file, title } = material;
  
  if (isYouTubeUrl(url_file)) {
    return (
      <iframe
        src={getYouTubeEmbedUrl(url_file)}
        title="YouTube Video"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  
  const ext = getFileExtension(url_file);
  console.log('File extension:', ext, 'URL:', url_file); // Debug log
  
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
    return (
      <img
        src={url_file}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  } else if (ext === "pdf" || ext === "") {
    return (
      <div className="w-full h-full flex flex-col">
        <iframe 
          src={url_file} 
          title="PDF Preview" 
          className="w-full flex-1"
          onError={() => console.log('PDF iframe error')}
        />
        <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center">
          {/* PDF Preview - <a href={url_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Buka di tab baru</a> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <a 
          href={url_file} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 underline text-lg"
        >
          Lihat File ({ext || 'unknown'})
        </a>
      </div>
    );
  }
};

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Gagal mengunduh file:', error);
  }
};

// Tambahkan helper untuk ambil YouTube video ID
export const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
};

const Edukasi: React.FC = () => {
  const { filters, currentPage, search, handleSearch, setCurrentPage } = useEducationPagination();
  const { data, loading, error, refetch } = useEducationalMaterials(filters);
  const [selectedMaterial, setSelectedMaterial] = useState<EducationalMaterial | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Handle search input
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
    refetch(filters);
  };

  const openMaterialModal = (material: EducationalMaterial) => {
    setSelectedMaterial(material);
    setShowModal(true);
  };

  const closeMaterialModal = () => {
    setSelectedMaterial(null);
    setShowModal(false);
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tidak diketahui';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (data && currentPage < data.pagination.total_pages) {
      setCurrentPage(currentPage + 1);
      refetch({ ...filters, page: currentPage + 1 });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      refetch({ ...filters, page: currentPage - 1 });
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    refetch({ ...filters, page });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!data) return [];
    const totalPages = data.pagination.total_pages;
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

  return (
    <ModernLayout title="Edukasi TB" subtitle="Materi edukasi tentang Tuberculosis dan pengobatannya">
      {loading && <LoadingOverlay show={loading} />}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Edukasi Tuberculosis</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
            Akses materi edukasi lengkap tentang TB dari sumber terpercaya
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari materi edukasi..."
                className="flex-1 px-4 py-3 rounded-l-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-r-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error State */}
      {error && (
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

      {/* Results Info */}
      {data && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600">
            Menampilkan {data.data.length} dari {data.pagination.total_items} materi edukasi
            {search && (
              <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Pencarian: "{search}"
              </span>
            )}
          </div>
          
          {search && (
            <button
              onClick={() => {
                setSearchInput('');
                handleSearch('');
                refetch({ ...filters, search: undefined });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Hapus Filter
            </button>
          )}
        </div>
      )}

      {/* Educational Materials Grid */}
      {data && data.data.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.data.map((material) => (
              <div
                key={material.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => openMaterialModal(material)}
              >
                {/* Image/File Display */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 relative">
                  {isYouTubeUrl(material.url_file)
                    ? (
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(material.url_file)}/hqdefault.jpg`}
                          alt={material.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )
                    : material.url_file && (
                        <img
                          src={material.url_file}
                          alt={material.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Materi
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {material.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {material.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      📅 {formatDate(material.created_at)}
                    </span>
                    <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                Sebelumnya
              </button>
              
              {generatePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === data.pagination.total_pages}
                className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Materi Edukasi</h3>
            <p className="text-gray-500">
              {search ? 'Tidak ada hasil yang ditemukan untuk pencarian Anda.' : 'Materi edukasi akan ditampilkan di sini.'}
            </p>
          </div>
        )
      )}

      {/* Material Detail Modal */}
      {showModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Detail Materi Edukasi</h2>
                <button
                  onClick={closeMaterialModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {selectedMaterial.url_file && (
                  <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden">
                    {renderFilePreview(selectedMaterial)}
                  </div>
                )}
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedMaterial.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedMaterial.content}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <p>Dibuat: {formatDate(selectedMaterial.created_at)}</p>
                    {selectedMaterial.updated_at && (
                      <p>Diperbarui: {formatDate(selectedMaterial.updated_at)}</p>
                    )}
                  </div>
                  
                  {selectedMaterial.url_file && (() => {
                    const ext = getFileExtension(selectedMaterial.url_file);
                    if (ext === '') {
                      // Tombol download custom untuk file tanpa ekstensi
                      return (
                        <button
                          onClick={() =>
                            handleDownload(
                              selectedMaterial.url_file,
                              `${selectedMaterial.title || 'file-edukasi'}.pdf`
                            )
                          }
                          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                          Unduh PDF
                        </button>
                      );
                    }
                    // Fallback ke <a> biasa jika ada ekstensi
                    return (
                      <a
                        href={selectedMaterial.url_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                        download
                      >
                        Lihat File
                      </a>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModernLayout>
  );
};

export default Edukasi; 