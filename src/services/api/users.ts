import { User } from '../../types/user.types';
import { apiGet, apiPost, apiPut, apiDelete } from '../baseApi';

export const usersApi = {
  // Get all users
  getAllUsers: (): Promise<User[]> => {
    return apiGet<User[]>('/users');
  },

  // Get single user
  getUser: (id: number): Promise<User> => {
    return apiGet<User>(`/users/${id}`);
  },

  // Add new user (POST)
  addUser: (user: Omit<User, 'id'>): Promise<User> => {
    return apiPost<User>('/users', user);
  },

  // Update user (PUT)
  updateUser: (id: number, user: Partial<User>): Promise<User> => {
    return apiPut<User>(`/users/${id}`, user);
  },

  // Delete user
  deleteUser: (id: number): Promise<User> => {
    return apiDelete<User>(`/users/${id}`);
  },
};
