import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../components';
import { useAuth, useLogout } from '../../hooks/useAuth';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: () => {
            logoutMutation.mutate(undefined, {
              onError: (_error) => {
                Alert.alert(t('common.error'), t('auth.logoutError'));
              }
            });
          },
        },
      ]
    );
  };

  const handlePersonalInfo = () => {
    (navigation as any).navigate('PersonalInfo');
  };

  const handleOrders = () => {
    (navigation as any).navigate('Orders');
  };

  const handleLanguage = () => {
    (navigation as any).navigate('LanguageSelection');
  };

  const handleCurrency = () => {
    (navigation as any).navigate('CurrencySelection');
  };


  const menuItems = [
    { 
      title: t('profile.personalInfo'), 
      subtitle: t('profile.personalInfoSubtitle'), 
      icon: '👤',
      onPress: handlePersonalInfo
    },
    { 
      title: t('profile.orders'), 
      subtitle: t('profile.ordersSubtitle'), 
      icon: '📦',
      onPress: handleOrders
    },
    { 
      title: t('profile.language'), 
      subtitle: t('profile.languageSubtitle'), 
      icon: '🌐',
      onPress: handleLanguage
    },
    { 
      title: t('profile.currency'), 
      subtitle: t('profile.currencySubtitle'), 
      icon: '💱',
      onPress: handleCurrency
    },
    { 
      title: t('profile.logout'), 
      subtitle: t('profile.logoutSubtitle'), 
      icon: '🚪',
      onPress: handleLogout
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0], index: number) => (
    <TouchableOpacity 
      key={index} 
      style={styles.menuItem} 
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <View style={styles.menuIcon}>
        <Typography style={styles.iconText}>{item.icon}</Typography>
      </View>
      <View style={styles.menuContent}>
        <Typography variant="body" style={styles.menuTitle}>
          {item.title}
        </Typography>
        <Typography variant="caption" style={styles.menuSubtitle}>
          {item.subtitle}
        </Typography>
      </View>
      <Typography style={styles.arrow}>→</Typography>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImage}>
            <Typography style={styles.profileInitial}>
              {(user?.username || 'Kullanıcı').charAt(0).toUpperCase()}
            </Typography>
          </View>
          <Typography variant="h2" style={styles.profileName}>
            {user?.username || 'Kullanıcı'}
          </Typography>
          <Typography variant="body" style={styles.profileEmail}>
            {user?.email || 'user@example.com'}
          </Typography>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        <View style={styles.footer}>
          <Typography variant="caption" style={styles.versionText}>
            {t('profile.version')}
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
};
