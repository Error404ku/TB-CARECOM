// api/authApi.ts
import client from './client';

export const login = (email: string, password: string) => {
  return client.post('/auth/login', { email, password });
};

export const register = (data: any) => {
  return client.post('/auth/register', data);
};
