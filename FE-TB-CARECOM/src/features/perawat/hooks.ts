// features/perawat/hooks.ts
import { useState, useEffect } from 'react';
import { 
  getPatients, 
  getPatientById, 
  getDailyMonitoring, 
  restartTreatmentDate,
  type Patient,
  type DailyMonitoring,
  type PatientParams,
  type DailyMonitoringParams
} from '../../api/perawatApi';

// Hook for managing patients list
export const usePatients = (params?: PatientParams) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchPatients = async (searchParams?: PatientParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPatients(searchParams || params);
      setPatients(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data pasien');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    pagination,
    refetch: fetchPatients
  };
};

// Hook for managing single patient
export const usePatient = (patientId?: number) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPatientById(id);
      setPatient(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data pasien');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
    } else {
      setLoading(false);
    }
  }, [patientId]);

  return {
    patient,
    loading,
    error,
    refetch: (id: number) => fetchPatient(id)
  };
};

// Hook for managing daily monitoring
export const useDailyMonitoring = (patientId?: number, params?: DailyMonitoringParams) => {
  const [dailyMonitoring, setDailyMonitoring] = useState<DailyMonitoring[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchDailyMonitoring = async (id: number, searchParams?: DailyMonitoringParams) => {
    try {
      setLoading(true);
      setError(null);
      setIsEmpty(false);
      const response = await getDailyMonitoring(id, searchParams || params);
      setDailyMonitoring(response.data.data);
    } catch (err: any) {
      // Handle 404 specifically - means no monitoring data exists yet
      if (err.response?.status === 404) {
        setDailyMonitoring([]);
        setIsEmpty(true);
        setError(null); // Don't treat 404 as an error
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data monitoring harian');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDailyMonitoring(patientId);
    } else {
      setLoading(false);
    }
  }, [patientId]);

  return {
    dailyMonitoring,
    loading,
    error,
    isEmpty,
    refetch: (id: number, searchParams?: DailyMonitoringParams) => fetchDailyMonitoring(id, searchParams)
  };
};

// Hook for restarting treatment
export const useRestartTreatment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restartTreatment = async (patientId: number) => {
    try {
      setLoading(true);
      setError(null);
      await restartTreatmentDate(patientId);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat me-restart tanggal pengobatan');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    restartTreatment,
    loading,
    error
  };
}; 