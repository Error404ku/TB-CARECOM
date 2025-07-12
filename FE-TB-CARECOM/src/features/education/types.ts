// Educational Materials types

// Base Educational Material interface matching the database
export interface EducationalMaterial {
  id: number;
  title: string;
  content: string | null;
  video_url: string | null;
  file_path: string | null; // For PDF files
  created_at: string;
}

// Educational material creation request
export interface CreateEducationalMaterialRequest {
  title: string;
  content?: string;
  video_url?: string;
  file_path?: string;
}

// Educational material update request
export interface UpdateEducationalMaterialRequest {
  title?: string;
  content?: string;
  video_url?: string;
  file_path?: string;
}

// Educational material filters
export interface EducationalMaterialFilters {
  search?: string; // Search in title and content
  has_video?: boolean;
  has_file?: boolean;
}

// Educational material list response with pagination
export interface EducationalMaterialListResponse {
  materials: EducationalMaterial[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// File upload response
export interface FileUploadResponse {
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

// Educational material categories (for future expansion)
export const MaterialCategory = {
  TB_BASICS: 'tb_basics',
  MEDICATION: 'medication',
  NUTRITION: 'nutrition',
  LIFESTYLE: 'lifestyle',
  PREVENTION: 'prevention',
  FAMILY_SUPPORT: 'family_support'
} as const;

export type MaterialCategory = typeof MaterialCategory[keyof typeof MaterialCategory];

// Educational material with category (for future use)
export interface CategorizedEducationalMaterial extends EducationalMaterial {
  category: MaterialCategory;
} 