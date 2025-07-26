// api/educationApi.ts
import { privateClient, publicClient } from './client';
import type { 
  EducationalMaterialResponse, 
  EducationalMaterialDetailResponse, 
  EducationalMaterialFilters,
  CreateEducationalMaterialRequest,
  UpdateEducationalMaterialRequest
} from '../features/education/types';

// ALL ROLES: Get all educational materials with pagination
export const getAllEducationalMaterials = async (filters?: EducationalMaterialFilters): Promise<EducationalMaterialResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sort_by) params.append('sort_by', filters.sort_by);
  if (filters?.order_by) params.append('order_by', filters.order_by);
  
  const queryString = params.toString();
  const url = queryString ? `/educational-material/?${queryString}` : '/educational-material/';
  
  const response = await privateClient.get(url);
  return response.data;
};

// ALL ROLES: Get educational material by ID
export const getEducationalMaterialById = async (id: number): Promise<EducationalMaterialDetailResponse> => {
  const response = await privateClient.get(`/educational-material/${id}`);
  return response.data;
};

// ADMIN ONLY: Create new educational material
export const createEducationalMaterial = async (data: CreateEducationalMaterialRequest): Promise<EducationalMaterialDetailResponse> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  
  // Handle file if provided - can be File object or string URL
  if (data.file) {
    if (data.file instanceof File) {
      formData.append('file', data.file);
    } else {
      // If it's a string URL, still append it (API might handle URLs)
      formData.append('file', data.file);
    }
  }
  
  const response = await privateClient.post('/admin/educational-material/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ADMIN ONLY: Update educational material (uses POST method)
export const updateEducationalMaterial = async (id: number, data: UpdateEducationalMaterialRequest): Promise<EducationalMaterialDetailResponse> => {
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.content) formData.append('content', data.content);
  
  // Handle file if provided - can be File object or string URL
  if (data.file) {
    if (data.file instanceof File) {
      formData.append('file', data.file);
    } else {
      // If it's a string URL, still append it (API might handle URLs)
      formData.append('file', data.file);
    }
  }
  
  const response = await privateClient.post(`/admin/educational-material/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ADMIN ONLY: Delete educational material
export const deleteEducationalMaterial = async (id: number): Promise<{ meta: { code: number; message: string } }> => {
  const response = await privateClient.delete(`/admin/educational-material/${id}`);
  return response.data;
};

// Tambah API untuk tautan (YouTube/Link)
export const createEducationalMaterialYT = async (data: { title: string; content: string; url_file: string; }) => {
  return privateClient.post('/admin/educational-material/tautan', data);
};

export const updateEducationalMaterialYT = async (id: number, data: { title?: string; content?: string; url_file?: string; }) => {
  return privateClient.put(`/admin/educational-material/tautan/${id}`, data);
};

// Public access (if needed for unauthenticated users)
export const getPublicEducationalMaterials = async (filters?: EducationalMaterialFilters): Promise<EducationalMaterialResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.search) params.append('search', filters.search);
  
  const queryString = params.toString();
  const url = queryString ? `/educational-material/?${queryString}` : '/educational-material/';
  
  const response = await publicClient.get(url);
  return response.data;
};

export const getPublicEducationalMaterialById = async (id: number): Promise<EducationalMaterialDetailResponse> => {
  const response = await publicClient.get(`/educational-material/${id}`);
  return response.data;
}; 