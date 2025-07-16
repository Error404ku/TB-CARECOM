// api/pmoApi.ts
import { privateClient } from './client';

// TypeScript interfaces for type safety
export interface DailyMonitoringEntry {
  id: number;
  medication_time: string;
  description: string;
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

export interface DailyMonitoringResponse {
  status: number;
  message: string;
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
          status: error.response.status,
          message: error.response.status === 404 
            ? "API daily monitoring belum tersedia. Silakan hubungi administrator."
            : "API daily monitoring belum tersedia atau akses tidak diotorisasi.",
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