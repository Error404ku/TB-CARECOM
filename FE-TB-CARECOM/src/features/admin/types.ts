// features/admin/types.ts
export * from '../../api/adminApi';

export interface MonitoringFilters {
  search?: string;
  patient_id?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  order_by?: string;
  per_page?: number;
  page?: number;
}

export interface MonitoringResponse {
  meta: {
    code: number;
    message: string;
  };
  data: any[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  current_filters: {
    search: string;
    patient_id: string;
    start_date: string;
    end_date: string;
    sort_by: string;
    sort_direction: string;
  };
} 