import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api/auth';
import { AuthCredentials, RegisterCredentials } from '../types/auth.types';
import { StorageService } from '../utils/storage';

interface User {
  id?: number;
  email?: string;
  username: string;
  password: string;
}

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      const token = await StorageService.getAuthToken();
      const userData = StorageService.getUserData();

      if (token && userData) {
        return {
          isAuthenticated: true,
          user: userData as User,
          token,
        };
      }

      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    },
    staleTime: Infinity, // Auth durumu çok sık değişmez
    refetchOnWindowFocus: false,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      console.log('🔐 Login attempt with credentials:', {
        username: credentials.username,
      });

      try {
        const response = await authApi.login(credentials);
        console.log('✅ API Response received:', response);

        const token = response.token;
        if (!token) {
          console.error('❌ No token found in API response:', response);
          throw new Error('No token received from API');
        }


        await StorageService.setAuthToken(token);

        const userData: User = {
          username: credentials.username,
          password: credentials.password,
        };

        StorageService.setUserData(userData);

        return {
          token: token,
          user: userData,
        };
      } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
      }
    },
    onSuccess: data => {
      queryClient.setQueryData(['authStatus'], {
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      });
    },
  });
};

// Register mutation - Otomatik login yapmıyor
export const useRegister = () => {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await authApi.register(credentials);

      return {
        id: response.id,
        username: credentials.username,
        email: credentials.email,
      };
    },
    onSuccess: data => {
      console.log('Registration successful:', data);
    },
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      StorageService.clearAuthData();
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(['authStatus'], {
        isAuthenticated: false,
        user: null,
        token: null,
      });
    },
  });
};

export const useAuth = () => {
  const { data: authData, isLoading } = useAuthStatus();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    // State
    user: authData?.user || null,
    isAuthenticated: authData?.isAuthenticated || false,
    loading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error?.message ||
      registerMutation.error?.message ||
      logoutMutation.error?.message ||
      null,

    // Actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Status
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};
