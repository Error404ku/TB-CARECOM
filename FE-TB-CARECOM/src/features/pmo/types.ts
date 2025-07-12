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