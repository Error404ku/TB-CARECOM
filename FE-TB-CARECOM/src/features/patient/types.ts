// Patient types

// Patient status
export const PatientStatus = {
  ACTIVE: 1,
  RECOVERED: 2,
  FAILED: 3,
  OTHER: 4
} as const;

export type PatientStatus = typeof PatientStatus[keyof typeof PatientStatus];

// Base Patient interface matching the database
export interface Patient {
  id: number;
  full_name: string;
  address: string | null;
  phone_number: string | null;
  start_treatment_date: string; // ISO date string
  qr_code_identifier: string; // UUID
  assigned_nurse_id: number | null;
  status: PatientStatus;
  created_at: string;
  updated_at: string;
}

// Patient with nurse details populated
export interface PatientWithNurse extends Patient {
  assigned_nurse: {
    id: number;
    name: string;
    email: string;
  } | null;
}

// Patient creation request
export interface CreatePatientRequest {
  full_name: string;
  address?: string;
  phone_number?: string;
  start_treatment_date: string; // ISO date string
  assigned_nurse_id?: number;
  status?: PatientStatus;
}

// Patient update request
export interface UpdatePatientRequest {
  full_name?: string;
  address?: string;
  phone_number?: string;
  start_treatment_date?: string;
  assigned_nurse_id?: number;
  status?: PatientStatus;
}

// Patient search/filter parameters
export interface PatientFilters {
  status?: PatientStatus;
  assigned_nurse_id?: number;
  search?: string; // For searching by name or phone
  start_date?: string;
  end_date?: string;
}

// Patient list response with pagination
export interface PatientListResponse {
  patients: PatientWithNurse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// QR Code access data (public data available via QR)
export interface PatientQRData {
  patient_id: number;
  full_name: string;
  qr_code_identifier: string;
} 