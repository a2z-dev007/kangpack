import api from '@/lib/api';
import { User, PaginatedResponse, PaginationParams } from '@/types';

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.put('/users/profile', userData);
    return data;
  },

  // Admin endpoints
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
