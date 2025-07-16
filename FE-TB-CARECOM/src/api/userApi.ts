// api/userApi.ts
import { privateClient } from './client';

// All user APIs require authentication
export const getUserData = () => {
  return privateClient.get('/user/profile');
};

export const updateUserData = (data: any) => {
  return privateClient.put('/user/profile', data);
};

export const getUserDashboard = () => {
  return privateClient.get('/user/dashboard');
};

export const getUserReports = () => {
  return privateClient.get('/user/reports');
};

export const createUserReport = (data: any) => {
  return privateClient.post('/user/reports', data);
};

export const updateUserReport = (id: number, data: any) => {
  return privateClient.put(`/user/reports/${id}`, data);
};

export const deleteUserReport = (id: number) => {
  return privateClient.delete(`/user/reports/${id}`);
};
