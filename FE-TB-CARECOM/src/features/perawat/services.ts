// features/perawat/services.ts
import { 
  getPatients, 
  getPatientById, 
  getDailyMonitoring, 
  restartTreatmentDate,
  type PatientParams,
  type DailyMonitoringParams
} from '../../api/perawatApi';

// Service for patient operations
export const patientService = {
  // Get all patients with filtering
  async getPatientsList(params?: PatientParams) {
    return await getPatients(params);
  },

  // Get patient details
  async getPatientDetails(patientId: number) {
    return await getPatientById(patientId);
  },

  // Restart patient treatment
  async restartPatientTreatment(patientId: number) {
    return await restartTreatmentDate(patientId);
  }
};

// Service for daily monitoring operations
export const dailyMonitoringService = {
  // Get daily monitoring for a patient
  async getPatientMonitoring(patientId: number, params?: DailyMonitoringParams) {
    return await getDailyMonitoring(patientId, params);
  }
};

// Utility functions for formatting and processing data
export const perawatUtils = {
  // Format patient status for display
  formatPatientStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'Aktif': 'Aktif',
      'Tidak Aktif': 'Tidak Aktif',
      'Sembuh': 'Sembuh',
      'Pindah': 'Pindah'
    };
    return statusMap[status] || status;
  },

  // Format gender for display
  formatGender(gender: string): string {
    return gender === 'L' ? 'Laki-laki' : 'Perempuan';
  },

  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Format datetime for display
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get status badge color
  getStatusBadgeColor(status: string): string {
    const colorMap: Record<string, string> = {
      'Aktif': 'bg-green-100 text-green-800',
      'aktif': 'bg-green-100 text-green-800',
      'Tidak Aktif': 'bg-red-100 text-red-800',
      'tidak aktif': 'bg-red-100 text-red-800',
      'Sembuh': 'bg-blue-100 text-blue-800',
      'sembuh': 'bg-blue-100 text-blue-800',
      'Gagal': 'bg-red-100 text-red-800',
      'gagal': 'bg-red-100 text-red-800',
      'Pindah': 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  },

  // Calculate age from birth date
  calculateAge(birthDate: string): string {
    if (!birthDate) return 'Tidak diketahui';
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Check if birth date is valid
    if (isNaN(birth.getTime())) return 'Tidak valid';
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    // If age is negative or unreasonable, return error message
    if (age < 0 || age > 150) {
      return 'Data tidak valid';
    }
    
    return `${age} tahun`;
  },

  // Format status for display with proper capitalization
  formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'aktif': 'Aktif',
      'Aktif': 'Aktif',
      'tidak aktif': 'Tidak Aktif',
      'Tidak Aktif': 'Tidak Aktif',
      'sembuh': 'Sembuh',
      'Sembuh': 'Sembuh',
      'gagal': 'Gagal',
      'Gagal': 'Gagal'
    };
    return statusMap[status] || status;
  },

  // Calculate treatment duration from start date
  calculateTreatmentDuration(startDate: string): string {
    if (!startDate) return 'Tidak diketahui';
    
    const start = new Date(startDate);
    const today = new Date();
    
    // Check if start date is valid
    if (isNaN(start.getTime())) return 'Tidak valid';
    
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If negative days, return error message
    if (diffDays < 0) {
      return 'Tanggal belum dimulai';
    }
    
    if (diffDays === 0) {
      return 'Hari ini (0 hari)';
    } else if (diffDays < 30) {
      return `${diffDays} hari`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return remainingDays > 0 
        ? `${months} bulan ${remainingDays} hari`
        : `${months} bulan`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      if (months > 0) {
        return `${years} tahun ${months} bulan`;
      } else {
        return `${years} tahun`;
      }
    }
  }
}; 