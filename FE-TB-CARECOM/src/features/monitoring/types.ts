// Daily Monitoring types

// Base Daily Monitoring Log interface matching the database
export interface DailyMonitoringLog {
  id: number;
  patient_id: number;
  medication_time: string; // ISO datetime string
  patient_condition: string | null;
  side_effects: string | null;
  created_at: string; // When the form was submitted
}

// Daily monitoring log with patient details
export interface DailyMonitoringLogWithPatient extends DailyMonitoringLog {
  patient: {
    id: number;
    full_name: string;
    qr_code_identifier: string;
  };
}

// Daily monitoring log creation request (from PMO via QR)
export interface CreateMonitoringLogRequest {
  patient_id: number;
  medication_time: string; // ISO datetime string
  patient_condition?: string;
  side_effects?: string;
}

// Daily monitoring log update request
export interface UpdateMonitoringLogRequest {
  medication_time?: string;
  patient_condition?: string;
  side_effects?: string;
}

// Monitoring log filters for queries
export interface MonitoringLogFilters {
  patient_id?: number;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  has_side_effects?: boolean;
}

// Monitoring log list response with pagination
export interface MonitoringLogListResponse {
  logs: DailyMonitoringLogWithPatient[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Statistics for monitoring dashboard
export interface MonitoringStats {
  total_logs_today: number;
  total_logs_this_week: number;
  total_logs_this_month: number;
  patients_with_side_effects_today: number;
  missed_medication_count: number;
  compliance_rate: number; // percentage
}

// Medication adherence report
export interface MedicationAdherenceReport {
  patient_id: number;
  patient_name: string;
  total_expected_doses: number;
  total_reported_doses: number;
  adherence_rate: number; // percentage
  last_medication_time: string | null;
  missed_days: string[]; // array of ISO date strings
}

// QR form data structure (what PMO sees when scanning)
export interface QRFormData {
  patient_id: number;
  patient_name: string;
  qr_code_identifier: string;
} 