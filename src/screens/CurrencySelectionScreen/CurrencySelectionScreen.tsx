import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '../../components';
import { Currency } from '../../store/slices/currencySlice';
import { saveCurrencyToStorage } from '../../store/slices/currencySlice';
import { RootState } from '../../store';
import { getCurrencyInfo } from '../../utils/currency';
import { styles } from './CurrencySelectionScreen.styles';

const CurrencySelectionScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.currency,
  );

  const [currentCurrency, setCurrentCurrency] =
    useState<Currency>(selectedCurrency);

  const currencies: Currency[] = ['USD', 'EUR', 'TRY'];

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const handleSave = async () => {
    if (currentCurrency !== selectedCurrency) {
      try {
        await dispatch(saveCurrencyToStorage(currentCurrency) as any).unwrap();
        Alert.alert('🎉 ' + t('common.success'), t('currency.changeSuccess'), [
          {
            text: t('common.ok'),
            onPress: () => {
              (navigation as any).goBack();
            },
          },
        ]);
      } catch (error) {
        console.error('Failed to save currency:', error);
        Alert.alert(t('common.error'), 'Failed to save currency preference');
      }
    } else {
      (navigation as any).goBack();
    }
  };

  const renderCurrencyOption = (currency: Currency) => {
    const isSelected = currentCurrency === currency;
    const currencyInfo = getCurrencyInfo(currency);

    return (
      <TouchableOpacity
        key={currency}
        style={[styles.currencyOption, isSelected && styles.selectedOption]}
        onPress={() => handleCurrencyChange(currency)}
        activeOpacity={0.7}
      >
        <View style={styles.currencyInfo}>
          <Typography variant="h3" style={styles.currencyCode}>
            {currencyInfo.code}
          </Typography>
          <Typography variant="body" style={styles.currencyName}>
            {currencyInfo.name}
          </Typography>
        </View>
        <View style={styles.currencySymbol}>
          <Typography variant="h2" style={styles.symbol}>
            {currencyInfo.symbol}
          </Typography>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Typography style={styles.checkmark}>✓</Typography>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation as any).goBack()}
          activeOpacity={0.7}
        >
          <Typography style={styles.backIcon}>←</Typography>
        </TouchableOpacity>
        <Typography variant="h3" style={styles.headerTitle}>
          {t('currency.title')}
        </Typography>
      </View>

      <View style={styles.content}>
        <Typography variant="body" style={styles.subtitle}>
          {t('currency.selectCurrency')}
        </Typography>

        <View style={styles.currencyList}>
          {currencies.map(renderCurrencyOption)}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Typography variant="body" style={styles.saveButtonText}>
              {t('common.save')}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CurrencySelectionScreen;
