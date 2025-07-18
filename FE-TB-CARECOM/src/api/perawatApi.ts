// api/perawatApi.ts
import { privateClient } from './client';

// TypeScript interfaces for nurse APIs
export interface Patient {
  id: number;
  name: string;
  address: string;
  gender: string;
  no_telp: string;
  start_treatment_date: string;
  status: string;
  pmo: any | null;
  assignedNurse: {
    name: string;
    email: string;
    rs: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface DailyMonitoring {
  id: number;
  patient: {
    id: number;
    name: string;
  };
  medication_time: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface CurrentFilters {
  search: string;
  status: string;
  start_date: string;
  end_date: string;
  sort_by: string;
  sort_direction: string;
}

export interface PatientsResponse {
  meta: {
    code: number;
    message: string;
  };
  data: Patient[];
  pagination: Pagination;
  current_filters: CurrentFilters;
}

export interface PatientResponse {
  meta: {
    code: number;
    message: string;
  };
  data: Patient;
}

export interface DailyMonitoringResponse {
  meta: {
    code: number;
    message: string;
  };
  data: DailyMonitoring[];
}

export interface DailyMonitoringParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  order_by?: string;
  per_page?: number;
}

export interface PatientParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  order_by?: string;
  per_page?: number;
  status?: string;
}

/**
 * Get daily monitoring data for a specific patient
 * @param patientId - Patient ID
 * @param params - Query parameters
 */
export const getDailyMonitoring = async (patientId: number, params?: DailyMonitoringParams) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.order_by) queryParams.append('order_by', params.order_by);
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

  const queryString = queryParams.toString();
  const url = `/perawat/daily-monitoring/${patientId}${queryString ? `?${queryString}` : ''}`;
  
  return privateClient.get<DailyMonitoringResponse>(url);
};

/**
 * Get all patients assigned to the nurse
 * @param params - Query parameters
 */
export const getPatients = async (params?: PatientParams) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.order_by) queryParams.append('order_by', params.order_by);
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.status) queryParams.append('status', params.status);

  const queryString = queryParams.toString();
  const url = `/perawat/patient${queryString ? `?${queryString}` : ''}`;
  
  return privateClient.get<PatientsResponse>(url);
};

/**
 * Get specific patient details by ID
 * @param patientId - Patient ID
 */
export const getPatientById = async (patientId: number) => {
  return privateClient.get<PatientResponse>(`/perawat/patient/${patientId}`);
};

/**
 * Restart treatment date for a patient
 * @param patientId - Patient ID
 */
export const restartTreatmentDate = async (patientId: number) => {
  return privateClient.put(`/perawat/patient/restart-treatment-date/${patientId}`);
}; 

// Dashboard response types
export interface PerawatDashboardStats {
  patient: {
    active: number;
    male: number;
    female: number;
  };
}

export interface PerawatDashboardResponse {
  meta: {
    code: number;
    message: string;
  };
  data: {
    code: number;
    success: boolean;
    message: string;
    data: PerawatDashboardStats;
  };
}

/**
 * Get perawat dashboard stats
 */
export const getPerawatDashboard = async () => {
  return privateClient.get<PerawatDashboardResponse>('/perawat/dashboard');
}; 