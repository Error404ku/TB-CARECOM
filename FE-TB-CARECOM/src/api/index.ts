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
export * as educationApi from './educationApi';

// Authentication APIs
export * from './authApi';

// Admin APIs (excluding education functions to avoid conflicts)
export { 
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllPMOs,
  createPMO,
  updatePMO,
  deletePMO,
  getAllDailyMonitoringAdmin
} from './adminApi';

// User APIs
export * from './userApi';

// Public APIs
export * from './publicApi';

// Education APIs (including admin education functions)
export * from './educationApi';

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

// User functions
export {
  getUserData,
  updateUserData,
  getUserReports,
  createUserReport
} from './userApi'; 

// Education functions (ALL ROLES)
export {
  getAllEducationalMaterials,
  getEducationalMaterialById,
  getPublicEducationalMaterials,
  getPublicEducationalMaterialById
} from './educationApi'; 