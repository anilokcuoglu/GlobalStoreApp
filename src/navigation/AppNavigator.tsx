import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { TabNavigator } from './TabNavigator';
import { AuthScreen } from '../screens';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Loading screen
  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.white,
      }}>
        <ActivityIndicator size="large" color={colors.darkMode.primary[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // User is authenticated - show main app
          <Stack.Screen name="MainApp" component={TabNavigator} />
        ) : (
          // User is not authenticated - show auth screen
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
