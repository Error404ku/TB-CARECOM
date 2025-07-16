// features/education/types.ts
// Educational Materials types

// Base Educational Material interface matching the API response
export interface EducationalMaterial {
  id: number;
  title: string;
  content: string;
  public_id: string;
  url_file: string;
  created_at: string | null;
  updated_at: string | null;
}

// API Response interfaces
export interface EducationalMaterialResponse {
  meta: {
    code: number;
    message: string;
  };
  data: EducationalMaterial[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  current_filters: {
    search: string;
  };
}

export interface EducationalMaterialDetailResponse {
  meta: {
    code: number;
    message: string;
  };
  data: EducationalMaterial;
}

// Educational material creation request
export interface CreateEducationalMaterialRequest {
  title: string;
  content: string;
  file?: File | string; // Can be File object for upload or string URL
  public_id?: string;
  url_file?: string;
}

// Educational material update request
export interface UpdateEducationalMaterialRequest {
  title?: string;
  content?: string;
  file?: File | string; // Can be File object for upload or string URL
  public_id?: string;
  url_file?: string;
}

// Educational material filters for API queries
export interface EducationalMaterialFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order_by?: 'asc' | 'desc';
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