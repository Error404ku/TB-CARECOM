// api/adminApi.ts
import { privateClient } from './client';

// TypeScript interfaces for admin APIs
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  rs?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePerawatRequest {
  name: string;
  email: string;
  password: string;
  rs: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
  rs?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  sort_by?: string;
  order_by?: string;
  per_page?: number;
  page?: number;
}

export interface UsersResponse {
  meta: {
    code: number;
    message: string;
  };
  data: User[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  current_filters: {
    search: string;
    role: string;
    sort_by: string;
    sort_direction: string;
  };
}

export interface PMO {
  id: number;
  name: string;
  gender: string;
  no_telp: string;
  relationship: string;
  patient: {
    name: string;
    address: string;
    gender: string;
    no_telp: string;
    status: string;
  };
  user: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PMODetail {
  id: number;
  patient_id: number;
  user_id: number;
  name: string;
  no_telp: string;
  relationship: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePMORequest {
  patient_id: string;
  name: string;
  no_telp: string;
  gender: string;
  relationship: string;
}

export interface PMOFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order_by?: string;
}

export interface PMOResponse {
  meta: {
    code: number;
    message: string;
  };
  data: PMO[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  current_filters: {
    search: string;
    relationship: string;
    sort_by: string;
    sort_direction: string;
  };
}

export interface PMODetailResponse {
  meta: {
    code: number;
    message: string;
  };
  data: PMO;
}

export interface PMOByPatientResponse {
  meta: {
    code: number;
    message: string;
  };
  data: PMODetail[];
}

export interface DailyMonitoringAdmin {
  id: number;
  patient: {
    id: number;
    name: string;
  };
  medication_time: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EducationalMaterial {
  id: number;
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard interface
export interface AdminDashboardData {
  pmo: number;
  user: number;
  daily_monitoring: number;
  educational_material: number;
}

export interface AdminDashboardResponse {
  meta: {
    code: number;
    message: string;
  };
  data: AdminDashboardData;
}

// ================================
// USER MANAGEMENT APIs
// ================================

/**
 * Get all users with filtering
 */
export const getAllUsers = async (filters?: UserFilters) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.role) params.append('role', filters.role);
  if (filters?.sort_by) params.append('sort_by', filters.sort_by);
  if (filters?.order_by) params.append('order_by', filters.order_by);
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.page) params.append('page', filters.page.toString());

  const queryString = params.toString();
  return privateClient.get<UsersResponse>(`/admin/user${queryString ? `?${queryString}` : ''}`);
};

/**
 * Create new perawat
 */
export const createPerawat = async (data: CreatePerawatRequest) => {
  return privateClient.post('/admin/user/create-perawat', data);
};

/**
 * Update user
 */
export const updateUser = async (id: number, data: UpdateUserRequest) => {
  return privateClient.put(`/admin/user/${id}`, data);
};

/**
 * Delete user
 */
export const deleteUser = async (id: number) => {
  return privateClient.delete(`/admin/user/${id}`);
};

// ================================
// EDUCATIONAL MATERIAL APIs
// ================================

/**
 * Create educational material
 */
export const createEducationalMaterial = async (formData: FormData) => {
  return privateClient.post('/admin/educational-material/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Update educational material
 */
export const updateEducationalMaterial = async (id: number, formData: FormData) => {
  return privateClient.post(`/admin/educational-material/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Delete educational material
 */
export const deleteEducationalMaterial = async (id: number) => {
  return privateClient.delete(`/admin/educational-material/${id}`);
};

// ================================
// PMO MANAGEMENT APIs
// ================================

/**
 * Get all PMOs with filtering
 */
export const getAllPMOs = async (filters?: PMOFilters) => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sort_by) params.append('sort_by', filters.sort_by);
  if (filters?.order_by) params.append('order_by', filters.order_by);

  const queryString = params.toString();
  return privateClient.get<PMOResponse>(`/admin/pmo${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get PMO detail by ID
 */
export const getPMOById = async (id: number) => {
  return privateClient.get<PMODetailResponse>(`/admin/pmo/${id}`);
};

/**
 * Get PMOs by patient ID
 */
export const getPMOsByPatientId = async (patientId: number) => {
  return privateClient.get<PMOByPatientResponse>(`/admin/pmo/patient/${patientId}`);
};

/**
 * Create new PMO
 */
export const createPMO = async (data: CreatePMORequest) => {
  return privateClient.post('/admin/pmo', data);
};

/**
 * Update PMO
 */
export const updatePMO = async (id: number, data: CreatePMORequest) => {
  return privateClient.put(`/admin/pmo/${id}`, data);
};

/**
 * Delete PMO
 */
export const deletePMO = async (id: number) => {
  return privateClient.delete(`/admin/pmo/${id}`);
};

// ================================
// DAILY MONITORING APIs
// ================================

/**
 * Get all daily monitoring
 */
export const getAllDailyMonitoringAdmin = async () => {
  return privateClient.get('/admin/daily-monitoring');
};

/**
 * Get daily monitoring by ID
 */
export const getDailyMonitoringByIdAdmin = async (id: number) => {
  return privateClient.get(`/admin/daily-monitoring/${id}`);
};

/**
 * Get daily monitoring by patient ID
 */
export const getDailyMonitoringByPatientIdAdmin = async (patientId: number) => {
  return privateClient.get(`/admin/daily-monitoring/patient/${patientId}`);
};

// ================================
// DASHBOARD APIs
// ================================

/**
 * Get admin dashboard data
 */
export const getAdminDashboard = () => {
  return privateClient.get<AdminDashboardResponse>('/admin/dashboard');
};

export const getUserById = (id: number) => {
  return privateClient.get(`/admin/users/${id}`);
};

export const createUser = (data: any) => {
  return privateClient.post('/admin/users', data);
};

export const getAllPatients = () => {
  return privateClient.get('/admin/patient');
};

export const getPatientById = (id: number) => {
  return privateClient.get(`/admin/patients/${id}`);
};

export const createPatient = (data: any) => {
  return privateClient.post('/admin/patients', data);
};

export const updatePatient = (id: number, data: any) => {
  return privateClient.put(`/admin/patients/${id}`, data);
};

export const deletePatient = (id: number) => {
  return privateClient.delete(`/admin/patients/${id}`);
};

export const getAllReports = () => {
  return privateClient.get('/admin/reports');
};

export const getReportById = (id: number) => {
  return privateClient.get(`/admin/reports/${id}`);
};

export const updateReportStatus = (id: number, status: string) => {
  return privateClient.put(`/admin/reports/${id}/status`, { status });
};
