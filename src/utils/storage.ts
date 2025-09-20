import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

export const StorageService = {
  setAuthToken: (token: string) => {
    storage.set(StorageKeys.AUTH_TOKEN, token);
  },

  getAuthToken: (): string | undefined => {
    return storage.getString(StorageKeys.AUTH_TOKEN);
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
