// features/education/hooks.ts
import { useState, useEffect } from 'react';
import { 
  getAllEducationalMaterials, 
  getEducationalMaterialById 
} from '../../api/educationApi';
import type { 
  EducationalMaterial, 
  EducationalMaterialResponse, 
  EducationalMaterialFilters 
} from './types';

// Hook for getting all educational materials
export const useEducationalMaterials = (filters?: EducationalMaterialFilters) => {
  const [data, setData] = useState<EducationalMaterialResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async (newFilters?: EducationalMaterialFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEducationalMaterials(newFilters || filters);
      setData(response);
    } catch (err: any) {
      setError(err?.response?.data?.meta?.message || 'Failed to fetch educational materials');
      console.error('Error fetching educational materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials(filters);
  }, [
    filters?.page, 
    filters?.per_page, 
    filters?.search, 
    filters?.sort_by, 
    filters?.order_by
  ]);

  const refetch = async (newFilters?: EducationalMaterialFilters) => {
    await fetchMaterials(newFilters || filters);
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

// Hook for getting educational material by ID
export const useEducationalMaterial = (id: number) => {
  const [data, setData] = useState<EducationalMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEducationalMaterialById(id);
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.meta?.message || 'Failed to fetch educational material');
      console.error('Error fetching educational material:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMaterial();
    }
  }, [id]);

  return {
    data,
    loading,
    error,
    refetch: fetchMaterial
  };
};

// Hook for managing pagination and search
export const useEducationPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    resetPagination();
  };

  return {
    currentPage,
    perPage,
    search,
    setCurrentPage,
    setPerPage,
    handleSearch,
    resetPagination,
    filters: {
      page: currentPage,
      per_page: perPage,
      search: search || undefined
    }
  };
}; 