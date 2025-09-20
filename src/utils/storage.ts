import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new MMKV();

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
  PAYMENT_CARDS: 'payment_cards',
  ORDERS: 'orders',
  SELECTED_LANGUAGE: 'selected_language',
  SELECTED_CURRENCY: 'selected_currency',
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

  // Payment Cards Storage
  setPaymentCards: async (cards: any[]) => {
    try {
      console.log('💳 Saving payment cards:', cards.length);
      await useFallbackStorage(
        () => {
          storage.set(StorageKeys.PAYMENT_CARDS, JSON.stringify(cards));
          console.log('✅ Payment cards saved to MMKV successfully');
        },
        async () => {
          await AsyncStorage.setItem(StorageKeys.PAYMENT_CARDS, JSON.stringify(cards));
          console.log('✅ Payment cards saved to AsyncStorage successfully');
        }
      );
    } catch (error) {
      console.error('❌ Failed to save payment cards:', error);
      throw new Error(`Failed to save payment cards: ${error}`);
    }
  },

  getPaymentCards: async (): Promise<any[]> => {
    try {
      return await useFallbackStorage(
        () => {
          const cards = storage.getString(StorageKeys.PAYMENT_CARDS);
          return cards ? JSON.parse(cards) : [];
        },
        async () => {
          const cards = await AsyncStorage.getItem(StorageKeys.PAYMENT_CARDS);
          return cards ? JSON.parse(cards) : [];
        }
      );
    } catch (error) {
      console.error('❌ Failed to get payment cards:', error);
      return [];
    }
  },

  addPaymentCard: async (card: any) => {
    try {
      const existingCards = await StorageService.getPaymentCards();
      const updatedCards = [...existingCards, card];
      await StorageService.setPaymentCards(updatedCards);
      console.log('✅ Payment card added successfully');
    } catch (error) {
      console.error('❌ Failed to add payment card:', error);
      throw error;
    }
  },

  // Orders functions
  getOrders: async (): Promise<any[]> => {
    try {
      const ordersJson = await useFallbackStorage(
        () => storage.getString(StorageKeys.ORDERS),
        () => AsyncStorage.getItem(StorageKeys.ORDERS)
      );
      
      if (!ordersJson) {
        return [];
      }
      
      const orders = JSON.parse(ordersJson);
      console.log('✅ Orders retrieved:', orders.length, 'orders');
      return orders;
    } catch (error) {
      console.error('❌ Failed to get orders:', error);
      return [];
    }
  },

  addOrder: async (order: any) => {
    try {
      const existingOrders = await StorageService.getOrders();
      const updatedOrders = [order, ...existingOrders];
      
      const ordersJson = JSON.stringify(updatedOrders);
      await useFallbackStorage(
        () => storage.set(StorageKeys.ORDERS, ordersJson),
        () => AsyncStorage.setItem(StorageKeys.ORDERS, ordersJson)
      );
      
      console.log('✅ Order added successfully');
    } catch (error) {
      console.error('❌ Failed to add order:', error);
      throw error;
    }
  },

  // Language preference functions
  setSelectedLanguage: async (languageCode: string) => {
    try {
      console.log('🌐 Setting selected language:', languageCode);
      await useFallbackStorage(
        () => {
          storage.set(StorageKeys.SELECTED_LANGUAGE, languageCode);
          console.log('✅ Selected language saved to MMKV successfully');
        },
        async () => {
          await AsyncStorage.setItem(StorageKeys.SELECTED_LANGUAGE, languageCode);
          console.log('✅ Selected language saved to AsyncStorage successfully');
        }
      );
    } catch (error) {
      console.error('❌ Failed to save selected language:', error);
      throw error;
    }
  },

  getSelectedLanguage: async (): Promise<string | undefined> => {
    try {
      return await useFallbackStorage(
        () => storage.getString(StorageKeys.SELECTED_LANGUAGE),
        async () => await AsyncStorage.getItem(StorageKeys.SELECTED_LANGUAGE)
      );
    } catch (error) {
      console.error('❌ Failed to get selected language:', error);
      return undefined;
    }
  },

  removeSelectedLanguage: () => {
    storage.delete(StorageKeys.SELECTED_LANGUAGE);
  },

  // Currency preference functions
  setSelectedCurrency: async (currencyCode: string) => {
    try {
      console.log('💱 Setting selected currency:', currencyCode);
      await useFallbackStorage(
        () => {
          storage.set(StorageKeys.SELECTED_CURRENCY, currencyCode);
          console.log('✅ Selected currency saved to MMKV successfully');
        },
        async () => {
          await AsyncStorage.setItem(StorageKeys.SELECTED_CURRENCY, currencyCode);
          console.log('✅ Selected currency saved to AsyncStorage successfully');
        }
      );
    } catch (error) {
      console.error('❌ Failed to save selected currency:', error);
      throw error;
    }
  },

  getSelectedCurrency: async (): Promise<string | undefined> => {
    try {
      return await useFallbackStorage(
        () => storage.getString(StorageKeys.SELECTED_CURRENCY),
        async () => await AsyncStorage.getItem(StorageKeys.SELECTED_CURRENCY)
      );
    } catch (error) {
      console.error('❌ Failed to get selected currency:', error);
      return undefined;
    }
  },

  removeSelectedCurrency: () => {
    storage.delete(StorageKeys.SELECTED_CURRENCY);
  },
};
