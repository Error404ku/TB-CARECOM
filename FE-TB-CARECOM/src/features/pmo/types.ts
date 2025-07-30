// PMO (Pengawas Minum Obat) types

// Base PMO interface matching the database
export interface PMO {
  id: number;
  patient_id: number;
  full_name: string;
  phone_number: string | null;
  relationship: string | null; // e.g., 'Anak', 'Istri', 'Suami'
  created_at: string;
  updated_at: string;
}

// PMO with patient details populated
export interface PMOWithPatient extends PMO {
  patient: {
    id: number;
    full_name: string;
    qr_code_identifier: string;
    status: number;
  };
}

// PMO creation request
export interface CreatePMORequest {
  patient_id: number;
  full_name: string;
  phone_number?: string;
  relationship?: string;
}

// PMO update request
export interface UpdatePMORequest {
  full_name?: string;
  phone_number?: string;
  relationship?: string;
}

// Common relationship options
export const RELATIONSHIP_OPTIONS = [
  'Istri',
  'Suami', 
  'Anak',
  'Orang Tua',
  'Saudara',
  'Keponakan',
  'Tetangga',
  'Teman',
  'Lainnya'
] as const;

export type RelationshipType = typeof RELATIONSHIP_OPTIONS[number];

// PMO Monitoring types
export interface PMOMonitoringFilters {
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  order_by?: string;
  per_page?: number;
  page?: number;
}

export interface PMOMonitoringResponse {
  meta: {
    code: number;
    message: string;
  };
  data: PMOMonitoringEntry[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  current_filters: {
    search: string;
    start_date: string;
    end_date: string;
    sort_by: string;
    sort_direction: string;
  };
}

export interface PMOMonitoringEntry {
  id: number;
  medication_time: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  patient?: {
    id: number;
    name: string;
  };
} 