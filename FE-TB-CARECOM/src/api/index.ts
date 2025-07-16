// api/index.ts
// Centralized API exports with clear public/private separation

// Core API clients
export { default as apiClient, publicClient, privateClient } from './client';

// API modules
export * as authApi from './authApi';
export * as adminApi from './adminApi';
export * as userApi from './userApi';
export * as pmoApi from './pmoApi';
export * as perawatApi from './perawatApi';
export * as publicApi from './publicApi';

// Authentication APIs
export * from './authApi';

// Admin APIs  
export * from './adminApi';

// User APIs
export * from './userApi';

// Public APIs
export * from './publicApi';

// PMO APIs
export * from './pmoApi';

// Re-export specific functions for backward compatibility
export { 
  login, 
  register, 
  forgotPassword, 
  resetPassword,
  logout,
  refreshToken,
  updateProfile,
  changePassword 
} from './authApi';

// Admin functions
export {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminProfile,
  updateAdminProfile
} from './adminApi';

// User functions
export {
  getUserData,
  updateUserData,
  getUserReports,
  createUserReport
} from './userApi'; 