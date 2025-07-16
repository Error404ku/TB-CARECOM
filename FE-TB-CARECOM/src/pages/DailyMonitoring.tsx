import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ModernLayout from '../layouts/ModernLayout';
import apiClient from '../api/client';
import { showDailyMonitoringSuccess, showError } from '../utils/sweetAlert';

const DailyMonitoring: React.FC = () => {
  const [searchParams] = useSearchParams();
  const qrParam = searchParams.get('qr');
  
  const [formData, setFormData] = useState({
    medication_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    medication_time: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }), // HH:mm
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidQR, setIsValidQR] = useState(false);

  // Validate QR parameter on component mount
  useEffect(() => {
    if (qrParam) {
      // Check if QR has the expected UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      setIsValidQR(uuidRegex.test(qrParam));
    }
  }, [qrParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrParam) {
      showError('QR Code Tidak Valid', 'Parameter QR tidak ditemukan di URL.');
      return;
    }

    if (!formData.medication_date.trim() || !formData.medication_time.trim() || !formData.description.trim()) {
      showError('Data Tidak Lengkap', 'Harap isi semua field yang diperlukan.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format medication_time sebagai datetime string "YYYY-MM-DD HH:mm:ss"
      const medicationDateTime = `${formData.medication_date} ${formData.medication_time}:00`;
      
      const response = await apiClient.post(`/daily-monitoring?qr=${qrParam}`, {
        medication_time: medicationDateTime,
        description: formData.description
      });
      
      if (response.status === 200 || response.status === 201) {
        showDailyMonitoringSuccess();
        // Reset form after successful submission
        setFormData({
          medication_date: new Date().toISOString().split('T')[0],
          medication_time: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          description: ''
        });
      }
    } catch (error: any) {
      console.error('Daily monitoring submission failed:', error);
      showError(
        'Gagal Mengirim Laporan',
        error?.response?.data?.message || 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if no QR parameter
  if (!qrParam) {
    return (
      <ModernLayout title="Daily Monitoring" subtitle="Laporan Monitoring Harian">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">QR Code Tidak Valid</h3>
            <p className="text-gray-600 mb-6">
              Parameter QR tidak ditemukan di URL. Pastikan Anda mengakses halaman ini melalui QR Code yang valid.
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </ModernLayout>
    );
  }

  // Show error if QR format is invalid
  if (!isValidQR) {
    return (
      <ModernLayout title="Daily Monitoring" subtitle="Laporan Monitoring Harian">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Format QR Code Tidak Valid</h3>
            <p className="text-gray-600 mb-4">
              Format QR Code yang Anda gunakan tidak sesuai dengan sistem.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">QR Code Anda:</p>
              <code className="text-sm font-mono text-red-600 break-all">{qrParam}</code>
            </div>
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout title="Daily Monitoring" subtitle="Laporan Monitoring Harian Anda">
      <div className="max-w-2xl mx-auto">
        {/* QR Info Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Monitoring Harian</h2>
              <p className="text-blue-100">Laporkan kondisi kesehatan Anda hari ini</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl p-3">
            <p className="text-sm text-blue-100 mb-1">QR Code ID:</p>
            <code className="text-sm font-mono text-white break-all">{qrParam}</code>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Form Monitoring Harian</h3>
            <p className="text-gray-600">Isi informasi waktu minum obat dan kondisi Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medication Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Minum Obat *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  name="medication_date"
                  value={formData.medication_date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Pilih tanggal saat Anda minum obat
              </p>
            </div>

            {/* Medication Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Minum Obat *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="time"
                  name="medication_time"
                  value={formData.medication_time}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Pilih waktu saat Anda minum obat
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Kondisi *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Jelaskan kondisi kesehatan Anda hari ini, efek samping yang dialami, atau catatan penting lainnya..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Berikan deskripsi yang detail tentang kondisi kesehatan dan hal-hal yang perlu diketahui
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Mengirim Laporan...</span>
                  </div>
                ) : (
                  'Kirim Laporan'
                )}
              </button>
            </div>
          </form>

          {/* Info Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200/50">
            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Informasi Penting</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Laporkan waktu minum obat secara akurat untuk monitoring yang efektif</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Jelaskan kondisi kesehatan dengan detail termasuk gejala dan efek samping</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Laporan ini akan membantu tenaga kesehatan memantau perkembangan pengobatan Anda</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Hubungi tenaga kesehatan jika mengalami efek samping yang serius</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              to="/edukasi"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Materi Edukasi TB
            </Link>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default DailyMonitoring;
