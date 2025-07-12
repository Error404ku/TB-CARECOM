// Auth types

// User roles
export const UserRole = {
  ADMIN: 1,
  NURSE: 2
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Base User interface matching the database
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// User without sensitive data (for frontend display)
export interface UserPublic {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// User creation request
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// User update request
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  user: UserPublic;
  token: string;
}

// Auth state for context
export interface AuthState {
  user: UserPublic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} 