import { apiPost } from '../baseApi';
import { AuthCredentials, AuthResponse, RegisterCredentials, RegisterResponse } from '../../types/auth.types';

export const authApi = {
  // Login user
  login: (credentials: AuthCredentials): Promise<AuthResponse> => {
    return apiPost<AuthResponse>('/auth/login', credentials);
  },
  
  // Register user
  register: (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    return apiPost<RegisterResponse>('/users', credentials);
  },
};

