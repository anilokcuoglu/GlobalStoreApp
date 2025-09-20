/**
 * GlobalStoreApp - React Native E-commerce App
 * @format
 */

import 'react-native-screens/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/navigation';
import { store } from './src/store';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppNavigator />
          </SafeAreaProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
