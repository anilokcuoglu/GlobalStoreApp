import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { StorageService } from '../utils/storage';

import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

const getInitialLanguage = async (): Promise<string> => {
  try {
    // 1. Öncelik: Kullanıcının seçtiği dil (MMKV'den)
    const selectedLanguage = await StorageService.getSelectedLanguage();
    if (selectedLanguage) {
      console.log('🌐 Using saved language preference:', selectedLanguage);
      return selectedLanguage;
    }

    // 2. İkinci öncelik: Device language
    const locales = RNLocalize.getLocales();
    if (locales.length > 0) {
      const deviceLanguage = locales[0].languageCode;
      const supportedLanguage = deviceLanguage === 'tr' ? 'tr' : 'en';
      console.log('🌐 Using device language:', deviceLanguage, '->', supportedLanguage);
      return supportedLanguage;
    }

    // 3. Fallback: İngilizce
    console.log('🌐 Using fallback language: en');
    return 'en';
  } catch (error) {
    console.error('❌ Failed to get initial language:', error);
    return 'en';
  }
};

const initializeI18n = async () => {
  const initialLanguage = await getInitialLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      debug: __DEV__,
      interpolation: {
        escapeValue: false,
      },
    });

  console.log('🌐 i18n initialized with language:', initialLanguage);
};

// Initialize i18n
initializeI18n().catch(console.error);

export default i18n;
