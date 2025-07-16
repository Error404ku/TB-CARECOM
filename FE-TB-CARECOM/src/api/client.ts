// api/client.ts
import axios from 'axios';
import { debugApi } from '../utils/debug';
import Swal from 'sweetalert2';

let incrementLoading: (() => void) | null = null;
let decrementLoading: (() => void) | null = null;

export function setLoadingHandlers(inc: () => void, dec: () => void) {
  incrementLoading = inc;
  decrementLoading = dec;
}

// Base client configuration
const baseConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Public API Client - No authentication required
const publicClient = axios.create(baseConfig);

// Private API Client - Authentication required
const privateClient = axios.create(baseConfig);

// List of public endpoints that don't require authentication
const publicEndpoints = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/public/edukasi',
  '/public/app-info',
  '/public/health-tips',
  '/public/statistics',
  '/public/contact',
  '/public/faq',
  '/public/scan',
  '/daily-monitoring',
  '/edukasi',
  '/public',
  '/perawat'
];

// Helper function to check if endpoint is public
const isPublicEndpoint = (url: string): boolean => {
  return publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Request Interceptor for Public Client - No token, only loading
publicClient.interceptors.request.use(
  (config: any) => {
    if (incrementLoading) incrementLoading();
    return config;
  },
  (error: any) => {
    if (decrementLoading) decrementLoading();
    return Promise.reject(error);
  }
);

// Request Interceptor for Private Client - Add token + loading
privateClient.interceptors.request.use(
  (config: any) => {
    if (incrementLoading) incrementLoading();
    const token = localStorage.getItem('token'); // Fixed: use 'token' instead of 'authToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    if (decrementLoading) decrementLoading();
    return Promise.reject(error);
  }
);

// Response Interceptor function (shared between both clients)
const responseInterceptor = {
  success: (response: any) => {
    if (decrementLoading) decrementLoading();
    
    // Show success notification for specific methods and status codes
    const method = response.config.method?.toLowerCase();
    const status = response.status;
    
    if (status === 200 || status === 201) {
      if (method === 'post') {
        if (response.config.url?.includes('/register')) {
          Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: 'Akun Anda telah berhasil dibuat. Silakan login dengan akun yang baru dibuat.',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'OK'
          });
        } else if (response.config.url?.includes('/login')) {
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: 'Selamat datang kembali!',
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: '#3b82f6'
          });
        } else {
          // Generic success for other POST requests
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: response.data?.message || 'Data berhasil disimpan.',
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: '#3b82f6'
          });
        }
      } else if (method === 'put' || method === 'patch') {
        Swal.fire({
          icon: 'success',
          title: 'Data Diperbarui!',
          text: response.data?.message || 'Data berhasil diperbarui.',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#3b82f6'
        });
      } else if (method === 'delete') {
        Swal.fire({
          icon: 'success',
          title: 'Data Dihapus!',
          text: response.data?.message || 'Data berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#3b82f6'
        });
      }
    }
    
    return response;
  },
  
  error: (error: any) => {
    if (decrementLoading) decrementLoading();
    
    // Handle error secara global dengan notifikasi SweetAlert2
    if (error.response) {
      // Server merespon dengan error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Bad Request
          Swal.fire({
            icon: 'error',
            title: 'Data Tidak Valid',
            text: data.message || 'Terjadi kesalahan dalam data yang dikirim.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
          break;
          
        case 401:
          // Unauthorized - hapus token dan redirect ke login (only for private endpoints)
          if (!isPublicEndpoint(error.config?.url || '')) {
            // Don't redirect if this is a PMO endpoint (let them handle gracefully)
            const isPMOEndpoint = error.config?.url?.includes('/pmo/');
            
            if (!isPMOEndpoint) {
              // Normal 401 for other endpoints - redirect to login
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              Swal.fire({
                icon: 'warning',
                title: 'Sesi Berakhir',
                text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
                confirmButtonColor: '#f59e0b',
                confirmButtonText: 'Login'
              }).then(() => {
                window.location.href = '/login';
              });
            }
            // For PMO endpoints, let them handle the error gracefully
          } else {
            // For public endpoints, show different message
            Swal.fire({
              icon: 'error',
              title: 'Login Gagal',
              text: data.message || 'Email atau password salah.',
              confirmButtonColor: '#ef4444',
              confirmButtonText: 'OK'
            });
          }
          break;
          
        case 403:
          // Forbidden - tidak ada akses
          Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            text: data.message || 'Anda tidak memiliki izin untuk mengakses fitur ini.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
          break;
          
        case 404:
          // Not found - Don't show alert for PMO endpoints (they're handled gracefully with fallback)
          const isPMOEndpoint = error.config?.url?.includes('/pmo/');
          if (!isPMOEndpoint) {
            Swal.fire({
              icon: 'error',
              title: 'Data Tidak Ditemukan',
              text: data.message || 'Data yang dicari tidak ditemukan.',
              confirmButtonColor: '#ef4444',
              confirmButtonText: 'OK'
            });
          }
          break;
          
        case 409:
          // Conflict - data sudah ada
          Swal.fire({
            icon: 'warning',
            title: 'Data Sudah Ada',
            text: data.message || 'Data yang Anda masukkan sudah ada dalam sistem.',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'OK'
          });
          break;
          
        case 422:
          // Validation error
          let validationMessage = data.message || 'Terdapat kesalahan validasi';
          
          // Handle validation errors array
          if (data.errors && typeof data.errors === 'object') {
            const errorMessages = Object.values(data.errors).flat();
            validationMessage = errorMessages.join('\n');
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: validationMessage,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
          break;
          
        case 429:
          // Too Many Requests
          Swal.fire({
            icon: 'warning',
            title: 'Terlalu Banyak Permintaan',
            text: 'Anda telah melakukan terlalu banyak permintaan. Silakan coba lagi nanti.',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'OK'
          });
          break;
          
        case 500:
          // Server error
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan Server',
            text: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
          break;
          
        case 503:
          // Service Unavailable
          Swal.fire({
            icon: 'error',
            title: 'Layanan Tidak Tersedia',
            text: 'Layanan sedang dalam pemeliharaan. Silakan coba lagi nanti.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
          break;
          
        default:
          Swal.fire({
            icon: 'error',
            title: 'Terjadi Kesalahan',
            text: data.message || 'Terjadi kesalahan yang tidak diketahui.',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'OK'
          });
      }
      
      debugApi.error(`API Error [${status}]:`, data.message || 'Unknown error');
      
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'OK'
      });
      debugApi.error('Network error: No response from server');
      
    } else {
      // Error dalam setup request
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Sistem',
        text: 'Terjadi kesalahan dalam sistem. Silakan refresh halaman.',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'OK'
      });
      debugApi.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
};

// Apply response interceptors to both clients
publicClient.interceptors.response.use(responseInterceptor.success, responseInterceptor.error);
privateClient.interceptors.response.use(responseInterceptor.success, responseInterceptor.error);

// Smart client that automatically chooses public or private based on endpoint
const apiClient = {
  get: (url: string, config?: any) => {
    const client = isPublicEndpoint(url) ? publicClient : privateClient;
    return client.get(url, config);
  },
  post: (url: string, data?: any, config?: any) => {
    const client = isPublicEndpoint(url) ? publicClient : privateClient;
    return client.post(url, data, config);
  },
  put: (url: string, data?: any, config?: any) => {
    const client = isPublicEndpoint(url) ? publicClient : privateClient;
    return client.put(url, data, config);
  },
  patch: (url: string, data?: any, config?: any) => {
    const client = isPublicEndpoint(url) ? publicClient : privateClient;
    return client.patch(url, data, config);
  },
  delete: (url: string, config?: any) => {
    const client = isPublicEndpoint(url) ? publicClient : privateClient;
    return client.delete(url, config);
  }
};

// Export both individual clients and smart client
export { publicClient, privateClient };
export default apiClient;
