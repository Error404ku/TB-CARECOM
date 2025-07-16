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
      'Tidak Aktif': 'bg-red-100 text-red-800',
      'Sembuh': 'bg-blue-100 text-blue-800',
      'Pindah': 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }
}; 