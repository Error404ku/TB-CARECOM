// Main types index - Export all types for easy importing

// Common types
export * from './common';

// Auth types
export * from '../features/auth/types';

// Patient types
export * from '../features/patient/types';

// PMO types
export * from '../features/pmo/types';

// Monitoring types
export * from '../features/monitoring/types';

// Education types
export * from '../features/education/types';

// Re-export commonly used types with aliases for convenience
export type {
  User,
  UserPublic,
  UserRole,
  LoginRequest,
  LoginResponse,
  AuthState
} from '../features/auth/types';

export type {
  Patient,
  PatientWithNurse,
  PatientStatus,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientQRData
} from '../features/patient/types';

export type {
  PMO,
  PMOWithPatient,
  CreatePMORequest,
  UpdatePMORequest,
  RelationshipType
} from '../features/pmo/types';

export type {
  DailyMonitoringLog,
  DailyMonitoringLogWithPatient,
  CreateMonitoringLogRequest,
  MonitoringStats,
  MedicationAdherenceReport,
  QRFormData
} from '../features/monitoring/types';

export type {
  EducationalMaterial,
  CreateEducationalMaterialRequest,
  UpdateEducationalMaterialRequest,
  MaterialCategory
} from '../features/education/types';

export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationMeta,
  LoadingState,
  FormState,
  Notification,
  NotificationType
} from './common'; 