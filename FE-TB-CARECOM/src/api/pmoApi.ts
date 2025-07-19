// api/pmoApi.ts
import { privateClient } from './client';

// TypeScript interfaces for type safety
export interface DailyMonitoringEntry {
  id: number;
  medication_time: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  patient: {
    id: number;
    name: string;
  };
}

export interface PatientData {
  id: number;
  name: string;
  address: string;
  gender: string;
  no_telp: string;
  status: string;
  pmo: {
    id: number;
    name: string;
    relationship: string;
    no_telp: string;
  };
  assignedNurse: {
    id: number;
    name: string;
    email: string;
    rs: string;
  };
}

// New interfaces for dashboard API
export interface DashboardPatient {
  id: number;
  name: string;
  address: string;
  no_telp: string;
  start_treatment_date: string;
  qr_code_identifier: string;
  assigned_nurse_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  gender: string;
  assigned_nurse: {
    id: number;
    name: string;
    email: string;
    role: string;
    rs: string;
    created_at: string;
    updated_at: string;
  };
}

export interface DashboardPMO {
  id: number;
  patient_id: number;
  user_id: number;
  name: string;
  no_telp: string;
  relationship: string;
  created_at: string;
  updated_at: string;
  gender: string;
  patient: DashboardPatient;
}

export interface DashboardPerawat {
  id: number;
  name: string;
  email: string;
  role: string;
  rs: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  patient: DashboardPatient;
  daily_monitoring: number;
  pmo: DashboardPMO;
  perawat: DashboardPerawat;
}

export interface DashboardResponse {
  meta: {
    code: number;
    message: string;
  };
  data: {
    code: number;
    success: boolean;
    message: string;
    data: DashboardData;
  };
}

export interface DailyMonitoringResponse {
  meta: {
    code: number;
    message: string;
  };
  data: DailyMonitoringEntry[];
}

export interface PatientResponse {
  status: number;
  message: string;
  data: PatientData | null;
}

export interface UpdateDailyMonitoringRequest {
  medication_time: string;
  description: string;
}

export interface UpdateDailyMonitoringResponse {
  meta: {
    code: number;
    message: string;
  };
  data?: any;
}

export interface UpdatePatientRequest {
  name: string;
  address: string;
  gender: string;
  no_telp: string;
  status: 'aktif' | 'sembuh' | 'gagal';
}

export interface QRCodeResponse {
  meta: {
    code: number;
    message: string;
  };
  data: string;
}

/**
 * Get PMO dashboard data - NEW API
 */
export const getPMODashboard = async () => {
  try {
    return await privateClient.get<DashboardResponse>('/pmo/dashboard');
  } catch (error: any) {
    // If API endpoint doesn't exist (404) or unauthorized (401), return empty data
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn('PMO dashboard API belum tersedia atau tidak diotorisasi');
      return {
        data: {
          meta: {
            code: error.response.status,
            message: error.response.status === 404
              ? "API dashboard PMO belum tersedia. Silakan hubungi administrator."
              : "API dashboard PMO belum tersedia atau akses tidak diotorisasi."
          },
          data: {
            code: error.response.status,
            success: false,
            message: error.response.status === 404
              ? "API dashboard PMO belum tersedia"
              : "Akses tidak diotorisasi",
            data: null
          }
        }
      };
    }
    throw error;
  }
};

/**
 * Get all daily monitoring data for PMO
 */
export const getAllDailyMonitoring = async () => {
  try {
    return await privateClient.get<DailyMonitoringResponse>('/pmo/daily-monitoring');
  } catch (error: any) {
    // If API endpoint doesn't exist (404) or unauthorized (401), return empty data
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn('PMO daily monitoring API belum tersedia atau tidak diotorisasi');
      return {
        data: {
          meta: {
            code: error.response.status,
            message: error.response.status === 404 
              ? "API daily monitoring belum tersedia. Silakan hubungi administrator."
              : "API daily monitoring belum tersedia atau akses tidak diotorisasi."
          },
          data: []
        }
      };
    }
    throw error;
  }
};

/**
 * Update daily monitoring entry
 */
export const updateDailyMonitoring = async (data: UpdateDailyMonitoringRequest) => {
  try {
    return await privateClient.put('/pmo/daily-monitoring', data);
  } catch (error: any) {
    // If API endpoint doesn't exist (404) or unauthorized (401), return error message
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn('PMO daily monitoring update API belum tersedia atau tidak diotorisasi');
      return {
        data: {
          status: error.response.status,
          message: error.response.status === 404
            ? "API update daily monitoring belum tersedia. Silakan hubungi administrator."
            : "API update daily monitoring belum tersedia atau akses tidak diotorisasi.",
          data: null
        }
      };
    }
    throw error;
  }
};

/**
 * Get patient data for PMO
 */
export const getPatientData = async () => {
  try {
    return await privateClient.get<PatientResponse>('/pmo/patient');
  } catch (error: any) {
    // If API endpoint doesn't exist (404) or unauthorized (401), return empty data
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn('PMO patient API belum tersedia atau tidak diotorisasi');
      return {
        data: {
          status: error.response.status,
          message: error.response.status === 404
            ? "API data pasien belum tersedia. Silakan hubungi administrator."
            : "API data pasien belum tersedia atau akses tidak diotorisasi.",
          data: null
        }
      };
    }
    throw error;
  }
};

/**
 * Update patient data
 */
export const updatePatientData = async (data: UpdatePatientRequest) => {
  try {
    return await privateClient.put('/pmo/patient', data);
  } catch (error: any) {
    // If API endpoint doesn't exist (404) or unauthorized (401), return error message
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn('PMO patient update API belum tersedia atau tidak diotorisasi');
      return {
        data: {
          status: error.response.status,
          message: error.response.status === 404
            ? "API update data pasien belum tersedia. Silakan hubungi administrator."
            : "API update data pasien belum tersedia atau akses tidak diotorisasi.",
          data: null
        }
      };
    }
    throw error;
  }
};

/**
 * Get specific daily monitoring entry by ID
 */
export const getDailyMonitoringById = (id: number) => {
  return privateClient.get(`/pmo/daily-monitoring/${id}`);
};

/**
 * Delete daily monitoring entry (if needed)
 */
export const deleteDailyMonitoring = (id: number) => {
  return privateClient.delete(`/pmo/daily-monitoring/${id}`);
};

/**
 * Get QR code data for patient
 */
export const getPatientQRCode = async () => {
  try {
    return await privateClient.get<QRCodeResponse>('/pmo/patient/qr-code');
  } catch (error: any) {
    // If API endpoint doesn't exist (404) or unauthorized (401), return error message
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn('PMO QR code API belum tersedia atau tidak diotorisasi');
      return {
        data: {
          meta: {
            code: error.response.status,
            message: error.response.status === 404
              ? "API QR code belum tersedia. Silakan hubungi administrator."
              : "API QR code belum tersedia atau akses tidak diotorisasi."
          },
          data: null
        }
      };
    }
    throw error;
  }
}; 