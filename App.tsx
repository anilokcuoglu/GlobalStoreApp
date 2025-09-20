/**
 * GlobalStoreApp - React Native E-commerce App
 * @format
 */

import React, { useEffect } from 'react';
import 'react-native-screens/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useDispatch } from 'react-redux';
import './src/i18n';
import { AppNavigator } from './src/navigation';
import { store } from './src/store';
import { loadCurrencyFromStorage } from './src/store/slices/currencySlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppWithCurrency = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrencyFromStorage() as any);
  }, [dispatch]);

  return <AppNavigator />;
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <AppWithCurrency />
          </SafeAreaProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
