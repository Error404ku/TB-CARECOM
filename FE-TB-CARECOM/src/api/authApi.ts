// api/authApi.ts
import { publicClient, privateClient } from './client';

// Public Authentication APIs (no token required)
export const login = (email: string, password: string) => {
  return publicClient.post('/auth/login', { email, password });
};

export const register = (data: any) => { 
  return publicClient.post('/auth/register', data);
};

export const forgotPassword = (email: string) => {
  return publicClient.post('/auth/forgot-password', { email });
};

export const resetPassword = (token: string, password: string, password_confirmation: string) => {
  return publicClient.post('/auth/reset-password', { token, password, password_confirmation });
};

// Private Authentication APIs (token required)
export const logout = () => {
  return privateClient.post('/auth/logout');
};

export const refreshToken = () => {
  return privateClient.post('/auth/refresh');
};

export const updateProfile = (data: any) => {
  return privateClient.put('/auth/profile', data);
};

export const changePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
  return privateClient.put('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
    new_password_confirmation: confirmPassword
  });
};
