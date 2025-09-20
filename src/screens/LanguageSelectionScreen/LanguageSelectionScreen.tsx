import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../components';
import { StorageService } from '../../utils/storage';
import { styles } from './LanguageSelectionScreen.styles';

export const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'tr', name: t('language.turkish'), nativeName: 'Türkçe' },
    { code: 'en', name: t('language.english'), nativeName: 'English' },
  ];

  // Load saved language preference on component mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await StorageService.getSelectedLanguage();
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('❌ Failed to load saved language:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === selectedLanguage) return;

    try {
      // 1. MMKV'ye kaydet
      await StorageService.setSelectedLanguage(languageCode);
      console.log('✅ Language preference saved to MMKV:', languageCode);

      // 2. i18n dilini değiştir
      await i18n.changeLanguage(languageCode);
      setSelectedLanguage(languageCode);

      Alert.alert(t('language.changeSuccess'), '', [
        {
          text: t('common.confirm'),
          onPress: () => {
            (navigation as any).goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Failed to change language:', error);
      Alert.alert(t('common.error'), 'Failed to change language');
    }
  };

  const renderLanguageItem = (language: any) => (
    <TouchableOpacity
      key={language.code}
      style={[
        styles.languageItem,
        selectedLanguage === language.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageChange(language.code)}
      activeOpacity={0.7}
    >
      <View style={styles.languageContent}>
        <View>
          <Typography variant="body" style={styles.languageName}>
            {language.nativeName}
          </Typography>
          <Typography variant="caption" style={styles.languageCode}>
            {language.name}
          </Typography>
        </View>
        {selectedLanguage === language.code && (
          <View style={styles.selectedIndicator}>
            <Typography style={styles.checkIcon}>✓</Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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
          {t('language.title')}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            {t('language.selectLanguage')}
          </Typography>

          <View style={styles.languagesList}>
            {languages.map(renderLanguageItem)}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LanguageSelectionScreen;
