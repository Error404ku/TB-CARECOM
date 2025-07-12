// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // URL backend dari .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Menambahkan token Authorization
apiClient.interceptors.request.use(
  (config: any) => {
    // Ambil token dari localStorage atau dari auth store
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Error handling
apiClient.interceptors.response.use(
  (response: any) => {
    // Jika response berhasil, langsung return
    return response;
  },
  (error: any) => {
    // Handle error secara global
    if (error.response) {
      // Server merespon dengan error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - hapus token dan redirect ke login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - tidak ada akses
          console.error('Access forbidden:', data.message || 'Forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message || 'Not found');
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', data.errors || data.message);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message || 'Internal server error');
          break;
          
        default:
          console.error('API Error:', data.message || 'Something went wrong');
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error('Network error: No response from server');
    } else {
      // Error dalam setup request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
