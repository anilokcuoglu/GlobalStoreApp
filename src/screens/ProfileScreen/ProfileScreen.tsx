import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../components';
import { useAuth, useLogout } from '../../hooks/useAuth';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            logoutMutation.mutate(undefined, {
              onError: (_error) => {
                Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
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
    // TODO: Implement orders screen
    Alert.alert('Bilgi', 'Siparişlerim özelliği yakında!');
  };

  const handleLanguage = () => {
    // TODO: Implement language selection
    Alert.alert('Bilgi', 'Dil seçimi özelliği yakında!');
  };


  const menuItems = [
    { 
      title: 'Kişisel Bilgiler', 
      subtitle: 'Profil bilgilerinizi düzenleyin', 
      icon: '👤',
      onPress: handlePersonalInfo
    },
    { 
      title: 'Siparişlerim', 
      subtitle: 'Geçmiş siparişlerinizi görüntüleyin', 
      icon: '📦',
      onPress: handleOrders
    },
    { 
      title: 'Dil Seçimi', 
      subtitle: 'Uygulama dilini değiştirin', 
      icon: '🌐',
      onPress: handleLanguage
    },
    { 
      title: 'Çıkış Yap', 
      subtitle: 'Hesabınızdan güvenli çıkış yapın', 
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
            GlobalStoreApp v1.0.0
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
};
