import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new MMKV();

// Fallback storage for when MMKV fails
const useFallbackStorage = async (operation: () => any, fallbackOperation: () => Promise<any>) => {
  try {
    return operation();
  } catch (error) {
    console.warn('⚠️ MMKV operation failed, falling back to AsyncStorage:', error);
    return await fallbackOperation();
  }
};

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

export const StorageService = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },

  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },

  removeItem: (key: string) => {
    storage.delete(key);
  },

  setAuthToken: async (token: string) => {
    try {
      console.log('🔑 Setting auth token:', token);
      
      // Try MMKV first, fallback to AsyncStorage
      await useFallbackStorage(
        () => {
          storage.set(StorageKeys.AUTH_TOKEN, token);
          console.log('✅ Auth token saved to MMKV successfully');
        },
        async () => {
          await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
          console.log('✅ Auth token saved to AsyncStorage successfully');
        }
      );
      
      // Verify the token was saved
      const savedToken = await useFallbackStorage(
        () => storage.getString(StorageKeys.AUTH_TOKEN),
        async () => await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN)
      );
      console.log('🔍 Verification - saved token:', savedToken);
    } catch (error) {
      console.error('❌ Failed to save auth token:', error);
      throw new Error(`Failed to save auth token: ${error}`);
    }
  },

  getAuthToken: async (): Promise<string | undefined> => {
    try {
      return await useFallbackStorage(
        () => storage.getString(StorageKeys.AUTH_TOKEN),
        async () => await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN)
      );
    } catch (error) {
      console.error('❌ Failed to get auth token:', error);
      return undefined;
    }
  },

  removeAuthToken: () => {
    storage.delete(StorageKeys.AUTH_TOKEN);
  },

  setUserData: (userData: any) => {
    storage.set(StorageKeys.USER_DATA, JSON.stringify(userData));
  },

  getUserData: () => {
    const userData = storage.getString(StorageKeys.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  removeUserData: () => {
    storage.delete(StorageKeys.USER_DATA);
  },

  clearAuthData: () => {
    storage.delete(StorageKeys.AUTH_TOKEN);
    storage.delete(StorageKeys.USER_DATA);
  },

  isLoggedIn: (): boolean => {
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    return !!token;
  },
};
