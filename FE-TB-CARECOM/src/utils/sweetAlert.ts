// utils/sweetAlert.ts
import Swal from 'sweetalert2';

// Color constants
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4'
};

// Success notifications
export const showSuccess = (title: string, text?: string, timer: number = 1500) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer,
    showConfirmButton: false,
    confirmButtonColor: COLORS.primary
  });
};

// Error notifications
export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: COLORS.error,
    confirmButtonText: 'OK'
  });
};

// Warning notifications
export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: COLORS.warning,
    confirmButtonText: 'OK'
  });
};

// Info notifications
export const showInfo = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: COLORS.info,
    confirmButtonText: 'OK'
  });
};

// Confirmation dialog
export const showConfirm = (
  title: string, 
  text?: string, 
  confirmText: string = 'Ya', 
  cancelText: string = 'Batal'
) => {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: COLORS.primary,
    cancelButtonColor: COLORS.error,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  });
};

// Delete confirmation (special case)
export const showDeleteConfirm = (itemName?: string) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Hapus Data?',
    text: itemName 
      ? `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`
      : 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
    showCancelButton: true,
    confirmButtonColor: COLORS.error,
    cancelButtonColor: COLORS.primary,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  });
};

// Loading dialog
export const showLoading = (title: string = 'Memproses...', text?: string) => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Login success (specific for auth)
export const showLoginSuccess = (userName?: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Login Berhasil!',
    text: userName ? `Selamat datang kembali, ${userName}!` : 'Selamat datang kembali!',
    timer: 1500,
    showConfirmButton: false,
    confirmButtonColor: COLORS.primary
  });
};

// Registration success (specific for auth)
export const showRegistrationSuccess = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Pendaftaran Berhasil!',
    text: 'Akun Anda telah berhasil dibuat. Silakan login dengan akun yang baru dibuat.',
    confirmButtonColor: COLORS.primary,
    confirmButtonText: 'OK'
  });
};

// Profile update success
export const showProfileUpdateSuccess = (userType: 'user' | 'admin' = 'user') => {
  const title = userType === 'admin' ? 'Profil Admin Berhasil Diperbarui!' : 'Profil Berhasil Diperbarui!';
  const text = userType === 'admin' 
    ? 'Data profil admin telah berhasil disimpan.' 
    : 'Data profil Anda telah berhasil disimpan.';
    
  return showSuccess(title, text);
};

// Report submission success
export const showReportSuccess = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Laporan Berhasil Dikirim!',
    text: 'Terima kasih telah melaporkan kondisi kesehatan Anda. Data telah berhasil disimpan.',
    confirmButtonColor: COLORS.primary,
    confirmButtonText: 'OK'
  });
};

// Daily monitoring submission success
export const showDailyMonitoringSuccess = () => {
  return showSuccess(
    'Laporan Berhasil Dikirim!',
    'Terima kasih telah melaporkan kondisi kesehatan Anda hari ini.'
  );
};

// Session expired warning
export const showSessionExpired = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Sesi Berakhir',
    text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
    confirmButtonColor: COLORS.warning,
    confirmButtonText: 'Login'
  });
};

// Network error
export const showNetworkError = () => {
  return showError(
    'Koneksi Gagal',
    'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
  );
};

// Generic API error
export const showApiError = (message?: string) => {
  return showError(
    'Terjadi Kesalahan',
    message || 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.'
  );
}; 