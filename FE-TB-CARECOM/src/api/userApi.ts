// api/userApi.ts
import client from './client';

export const fetchUserProfile = () => {
  return client.get('/user/profile');
};

export const updateUserProfile = (data: any) => {
  return client.put('/user/profile', data);
};
