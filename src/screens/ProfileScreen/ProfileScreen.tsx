import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components';
import { useAuth, useLogout } from '../../hooks/useAuth';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen = () => {
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
              onError: (error) => {
                Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
              }
            });
          },
        },
      ]
    );
  };

  const menuItems = [
    { title: 'Kişisel Bilgiler', subtitle: 'Profil bilgilerinizi düzenleyin', icon: '👤' },
    { title: 'Siparişlerim', subtitle: 'Geçmiş siparişlerinizi görüntüleyin', icon: '📦' },
    { title: 'Adreslerim', subtitle: 'Teslimat adreslerinizi yönetin', icon: '📍' },
    { title: 'Ödeme Yöntemleri', subtitle: 'Kart bilgilerinizi yönetin', icon: '💳' },
    { title: 'Bildirimler', subtitle: 'Bildirim tercihlerinizi ayarlayın', icon: '🔔' },
    { title: 'Dil Seçimi', subtitle: 'Uygulama dilini değiştirin', icon: '🌐' },
    { title: 'Yardım', subtitle: 'Sık sorulan sorular ve destek', icon: '❓' },
    { title: 'Çıkış Yap', subtitle: 'Hesabınızdan güvenli çıkış yapın', icon: '🚪' },
  ];

  const renderMenuItem = (item: typeof menuItems[0], index: number) => (
    <TouchableOpacity 
      key={index} 
      style={styles.menuItem} 
      activeOpacity={0.7}
      onPress={() => {
        if (item.title === 'Çıkış Yap') {
          handleLogout();
        } else {
          Alert.alert('Bilgi', `${item.title} özelliği yakında!`);
        }
      }}
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImage}>
            <Typography style={styles.profileInitial}>A</Typography>
          </View>
          <Typography variant="h2" style={styles.profileName}>
            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || 'Kullanıcı'}
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
    </SafeAreaView>
  );
};
