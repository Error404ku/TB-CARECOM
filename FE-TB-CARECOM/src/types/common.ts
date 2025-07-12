// Common types used across the application

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Error response structure
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status_code: number;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Pagination metadata
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Date range filter
export interface DateRange {
  start_date: string; // ISO date string
  end_date: string; // ISO date string
}

// Sort parameters
export interface SortParams {
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

// Generic list query parameters
export interface ListQueryParams extends PaginationParams, Partial<SortParams> {
  search?: string;
}

// Form validation error structure
export interface ValidationErrors {
  [field: string]: string[];
}

// Loading states for async operations
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Generic form state
export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
  errors: ValidationErrors;
}

// File upload state
export interface FileUploadState extends LoadingState {
  progress: number;
  file: File | null;
  uploadedFileUrl: string | null;
}

// QR Code generation response
export interface QRCodeData {
  qr_code_url: string;
  qr_code_identifier: string;
  patient_id: number;
}

// Notification types
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
}

// Theme settings
export interface ThemeSettings {
  isDarkMode: boolean;
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

// User preferences
export interface UserPreferences {
  theme: ThemeSettings;
  language: string;
  timezone: string;
  notifications_enabled: boolean;
} 