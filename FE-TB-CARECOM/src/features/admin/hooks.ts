// features/admin/hooks.ts
import { useState, useEffect } from 'react';
import {
  getAllUsers,
  createPerawat,
  updateUser,
  deleteUser,
  getAllPMOs,
  getPMOById,
  getPMOsByPatientId,
  createPMO,
  updatePMO,
  deletePMO,
  getAllDailyMonitoringAdmin,
  getDailyMonitoringByIdAdmin,
  getDailyMonitoringByPatientIdAdmin,
  getAdminDashboard,
  type User,
  type UserFilters,
  type CreatePerawatRequest,
  type UpdateUserRequest,
  type PMO,
  type PMOFilters,
  type CreatePMORequest,
  type DailyMonitoringAdmin,
  type AdminDashboardData
} from '../../api/adminApi';

// Import education API functions
import {
  getAllEducationalMaterials,
  getEducationalMaterialById,
  createEducationalMaterial as createEducation,
  updateEducationalMaterial as updateEducation,
  deleteEducationalMaterial as deleteEducation
} from '../../api/educationApi';

import type {
  EducationalMaterial,
  EducationalMaterialFilters,
  CreateEducationalMaterialRequest,
  UpdateEducationalMaterialRequest
} from '../education/types';

// ================================
// USER MANAGEMENT HOOKS
// ================================

export const useUsers = (initialFilters?: UserFilters) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});

  const fetchUsers = async (searchFilters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers(searchFilters || filters);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  const createNewPerawat = async (data: CreatePerawatRequest) => {
    try {
      await createPerawat(data);
      fetchUsers(); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat membuat perawat');
      return false;
    }
  };

  const updateUserData = async (id: number, data: UpdateUserRequest) => {
    try {
      await updateUser(id, data);
      fetchUsers(); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengupdate user');
      return false;
    }
  };

  const deleteUserData = async (id: number) => {
    try {
      await deleteUser(id);
      fetchUsers(); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menghapus user');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchUsers,
    createNewPerawat,
    updateUserData,
    deleteUserData,
    refetch: fetchUsers
  };
};

// ================================
// PMO MANAGEMENT HOOKS
// ================================

export const usePMOs = (initialFilters?: PMOFilters) => {
  const [pmos, setPMOs] = useState<PMO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState<PMOFilters>(initialFilters || {});

  const fetchPMOs = async (searchFilters?: PMOFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPMOs(searchFilters || filters);
      setPMOs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data PMO');
    } finally {
      setLoading(false);
    }
  };

  const createNewPMO = async (data: CreatePMORequest) => {
    try {
      await createPMO(data);
      fetchPMOs(); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat membuat PMO');
      return false;
    }
  };

  const updatePMOData = async (id: number, data: CreatePMORequest) => {
    try {
      await updatePMO(id, data);
      fetchPMOs(); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengupdate PMO');
      return false;
    }
  };

  const deletePMOData = async (id: number) => {
    try {
      await deletePMO(id);
      fetchPMOs(); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menghapus PMO');
      return false;
    }
  };

  useEffect(() => {
    fetchPMOs();
  }, []);

  return {
    pmos,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchPMOs,
    createNewPMO,
    updatePMOData,
    deletePMOData,
    refetch: fetchPMOs
  };
};

export const usePMODetail = (id?: number) => {
  const [pmo, setPMO] = useState<PMO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPMO = async (pmoId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPMOById(pmoId);
      setPMO(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data PMO');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPMO(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return {
    pmo,
    loading,
    error,
    refetch: (pmoId: number) => fetchPMO(pmoId)
  };
};

export const usePMOsByPatient = (patientId?: number) => {
  const [pmos, setPMOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPMOsByPatient = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPMOsByPatientId(id);
      setPMOs(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data PMO');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPMOsByPatient(patientId);
    } else {
      setLoading(false);
    }
  }, [patientId]);

  return {
    pmos,
    loading,
    error,
    refetch: (id: number) => fetchPMOsByPatient(id)
  };
};

// ================================
// EDUCATIONAL MATERIAL MANAGEMENT HOOKS
// ================================

export const useEducationalMaterialsAdmin = () => {
  const [materials, setMaterials] = useState<EducationalMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchMaterials = async (filters?: EducationalMaterialFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEducationalMaterials(filters);
      setMaterials(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat mengambil data materi edukasi');
    } finally {
      setLoading(false);
    }
  };

  const createMaterial = async (data: CreateEducationalMaterialRequest) => {
    try {
      setError(null);
      await createEducation(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat membuat materi edukasi');
      return false;
    }
  };

  const updateMaterial = async (id: number, data: UpdateEducationalMaterialRequest) => {
    try {
      setError(null);
      await updateEducation(id, data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat mengupdate materi edukasi');
      return false;
    }
  };

  const deleteMaterial = async (id: number) => {
    try {
      setError(null);
      await deleteEducation(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat menghapus materi edukasi');
      return false;
    }
  };

  // Initial fetch with default filters
  useEffect(() => {
    fetchMaterials({
      page: 1,
      per_page: 10,
      sort_by: 'created_at',
      order_by: 'desc'
    });
  }, []);

  const refetch = async (newFilters?: EducationalMaterialFilters) => {
    await fetchMaterials(newFilters);
  };

  return {
    materials,
    loading,
    error,
    pagination,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    refetch
  };
};

export const useEducationalMaterial = (id?: number) => {
  const [material, setMaterial] = useState<EducationalMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterial = async (materialId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEducationalMaterialById(materialId);
      setMaterial(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat mengambil data materi edukasi');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createMaterial = async (data: CreateEducationalMaterialRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createEducation(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat membuat materi edukasi');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMaterial = async (materialId: number, data: UpdateEducationalMaterialRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateEducation(materialId, data);
      setMaterial(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat mengupdate materi edukasi');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (materialId: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEducation(materialId);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat menghapus materi edukasi');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMaterial(id);
    }
  }, [id]);

  return {
    material,
    loading,
    error,
    fetchMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
  };
};

// ================================
// DAILY MONITORING HOOKS
// ================================

export const useDailyMonitoringAdmin = () => {
  const [monitoring, setMonitoring] = useState<DailyMonitoringAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllMonitoring = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllDailyMonitoringAdmin();
      setMonitoring(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data monitoring');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoringById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDailyMonitoringByIdAdmin(id);
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data monitoring');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoringByPatient = async (patientId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDailyMonitoringByPatientIdAdmin(patientId);
      setMonitoring(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data monitoring');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMonitoring();
  }, []);

  return {
    monitoring,
    loading,
    error,
    fetchAllMonitoring,
    fetchMonitoringById,
    fetchMonitoringByPatient,
    refetch: fetchAllMonitoring
  };
};

// ================================
// DASHBOARD HOOKS
// ================================

export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminDashboard();
      setDashboardData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || 'Terjadi kesalahan saat mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData
  };
}; 