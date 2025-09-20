import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CartScreen, CategoriesScreen, HomeScreen, ProfileScreen } from '../screens';
import { useAppSelector } from '../store/hooks';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { itemCount } = useAppSelector(state => state.cart);
  
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size * 0.8 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Kategoriler',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size * 0.8 }}>📂</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Sepet',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size * 0.8 }}>🛒</Text>
          ),
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size * 0.8 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
