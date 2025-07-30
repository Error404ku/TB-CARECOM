// features/pmo/hooks.ts
import { useState, useEffect } from 'react';
import { getAllDailyMonitoring } from '../../api/pmoApi';
import type { PMOMonitoringFilters, PMOMonitoringEntry } from './types';

// Hook for managing PMO monitoring with pagination and filtering
export const usePMOMonitoring = (initialFilters?: PMOMonitoringFilters) => {
  const [monitoring, setMonitoring] = useState<PMOMonitoringEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [filters] = useState<PMOMonitoringFilters>(initialFilters || {});

  const fetchMonitoring = async (searchFilters?: PMOMonitoringFilters) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching PMO monitoring with filters:', searchFilters || filters);
      const response = await getAllDailyMonitoring(searchFilters || filters);
      console.log('PMO API Response:', response);
      console.log('PMO Response data:', response.data);
      console.log('PMO Monitoring data:', response.data.data);
      // Handle response without pagination (fallback to default)
      setMonitoring(response.data.data || []);
      setPagination({
        page: 1,
        per_page: 10,
        total_items: response.data.data?.length || 0,
        total_pages: 1
      });
    } catch (err: any) {
      console.error('Error fetching PMO monitoring:', err);
      console.error('PMO Error response:', err.response);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data monitoring PMO');
      setMonitoring([]);
      setPagination({
        page: 1,
        per_page: 10,
        total_items: 0,
        total_pages: 1
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  return {
    monitoring,
    loading,
    error,
    pagination,
    refetch: fetchMonitoring
  };
}; 