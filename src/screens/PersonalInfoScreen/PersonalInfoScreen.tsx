import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../components';
import PrimaryButton from '../../components/molecules/PrimaryButton/PrimaryButton';
import { colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { usersApi } from '../../services/api/users';
import { User } from '../../types/user.types';
import { styles } from './PersonalInfoScreen.styles';

export const PersonalInfoScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuth();

  const [userData, setUserData] = useState<Partial<User>>({
    username: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      const user = currentUser as User;
      setUserData({
        username: user.username || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [currentUser]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!userData.username || !userData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gerekli';
    }

    // Email validation - daha esnek regex
    if (!userData.email || !userData.email.trim()) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Password validation
    if (!userData.password || !userData.password.trim()) {
      newErrors.password = 'Şifre gerekli';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setErrors(newErrors);

    // Debug: Log validation results
    console.log('🔍 Validation Results:', {
      userData,
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    const isValid = validateForm();
    if (!isValid) {
      const errorMessages = Object.values(errors).filter(Boolean);
      console.log('❌ Validation Failed:', errorMessages);
      Alert.alert(
        'Hata',
        `Lütfen tüm alanları doğru şekilde doldurun.\n\nHatalar:\n• ${errorMessages.join(
          '\n• ',
        )}`,
      );
      return;
    }

    setIsLoading(true);

    try {
      await usersApi.updateUser(0, userData);

      Alert.alert(
        '🎉 Başarılı!',
        'Kişisel bilgileriniz başarıyla güncellendi.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              (navigation as any).goBack();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation as any).goBack()}
        >
          <Typography variant="body" style={styles.backIcon}>
            ←
          </Typography>
        </TouchableOpacity>
        <Typography variant="h3" style={styles.headerTitle}>
          {t('personalInfo.title')}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              {t('personalInfo.title')}
            </Typography>

            <View style={styles.inputGroup}>
              <Typography variant="caption" style={styles.label}>
                Kullanıcı Adı
              </Typography>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder={t('personalInfo.usernamePlaceholder')}
                value={userData.username || ''}
                onChangeText={text => handleInputChange('username', text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.username && (
                <Typography variant="caption" style={styles.errorText}>
                  {errors.username}
                </Typography>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="caption" style={styles.label}>
                {t('personalInfo.email')}
              </Typography>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder={t('personalInfo.emailPlaceholder')}
                value={userData.email || ''}
                onChangeText={text => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Typography variant="caption" style={styles.errorText}>
                  {errors.email}
                </Typography>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="caption" style={styles.label}>
                {t('personalInfo.password')}
              </Typography>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder={t('personalInfo.passwordPlaceholder')}
                value={userData.password || ''}
                onChangeText={text => handleInputChange('password', text)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.password && (
                <Typography variant="caption" style={styles.errorText}>
                  {errors.password}
                </Typography>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isLoading ? t('personalInfo.updating') : t('personalInfo.update')}
              onPress={handleUpdate}
              disabled={isLoading}
              style={[styles.updateButton, isLoading && styles.disabledButton]}
            />
          </View>
        </View>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Typography variant="body" style={styles.loadingText}>
              {t('personalInfo.updating')}
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
};

export default PersonalInfoScreen;
