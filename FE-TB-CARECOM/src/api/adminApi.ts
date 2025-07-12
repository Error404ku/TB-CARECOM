// api/adminApi.ts
import client from './client';

export const getAllUsers = () => {
  return client.get('/admin/users');
};

export const deleteUser = (userId: string) => {
  return client.delete(`/admin/users/${userId}`);
};
