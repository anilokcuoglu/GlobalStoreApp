import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearCart } from '../../store/slices/cartSlice';
import { Typography } from '../../components';
import PrimaryButton from '../../components/molecules/PrimaryButton/PrimaryButton';
import { colors } from '../../constants/theme';
import { PaymentCard } from '../../types/payment.types';
import { StorageService } from '../../utils/storage';
import { convertPrice, formatPrice } from '../../utils/currency';
import { styles } from './PaymentScreen.styles';

export const PaymentScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { totalAmount, cartItems } = route.params as any;
  const { selectedCurrency, exchangeRates } = useAppSelector((state) => state.currency);

  const [cardData, setCardData] = useState<PaymentCard>({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentCard>>({});

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^[0-9]{16}$/.test(cleaned);
  };

  const validateExpiry = (month: string, year: string): boolean => {
    if (!month || !year) return false;
    const expDate = new Date(parseInt('20' + year, 10), parseInt(month, 10) - 1);
    const currentDate = new Date();
    return expDate > currentDate;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^[0-9]{3,4}$/.test(cvv);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentCard> = {};

    if (!validateCardNumber(cardData.cardNumber)) {
      newErrors.cardNumber = t('payment.validation.cardNumberInvalid');
    }

    if (!cardData.cardHolderName.trim()) {
      newErrors.cardHolderName = t('payment.validation.cardHolderRequired');
    }

    if (!validateExpiry(cardData.expiryMonth, cardData.expiryYear)) {
      newErrors.expiryMonth = t('payment.validation.expiryInvalid');
    }

    if (!validateCVV(cardData.cvv)) {
      newErrors.cvv = t('payment.validation.cvvInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      validateCardNumber(cardData.cardNumber) &&
      cardData.cardHolderName.trim().length > 0 &&
      validateExpiry(cardData.expiryMonth, cardData.expiryYear) &&
      validateCVV(cardData.cvv)
    );
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      Alert.alert(t('common.error'), t('payment.fillAllFieldsError'));
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

      const orderNumber = `#${Math.floor(Math.random() * 1000000)}`;
      const orderDate = new Date().toISOString();

      const order = {
        id: Date.now().toString(),
        orderNumber,
        date: orderDate,
        totalAmount,
        items: cartItems,
        status: 'completed',
        paymentMethod: `${cardData.cardNumber.slice(-4)} ending`,
        shippingAddress: {
          street: 'Sample Street',
          city: 'Sample City',
          zipcode: '12345',
        },
      };

      await StorageService.addOrder(order);

      await StorageService.addPaymentCard({
        ...cardData,
        lastUsed: orderDate,
        isDefault: true,
      });

      Alert.alert(
        '🎉 ' + t('payment.success'),
        `${t('payment.successMessage')}\n\n${t('payment.amount')}: ${formatPrice(convertPrice(totalAmount, selectedCurrency, exchangeRates), selectedCurrency)}\n\n${t('payment.orderNumber')}: ${orderNumber}`,
        [
          {
            text: t('common.ok'),
            onPress: () => {
              dispatch(clearCart());
              (navigation as any).navigate('MainApp');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('payment.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof PaymentCard, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    }
    
    setCardData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => (navigation as any).goBack()}
        >
          <Typography variant="body" style={styles.backIcon}>←</Typography>
        </TouchableOpacity>
        <Typography variant="h3" style={styles.headerTitle}>
          {t('payment.title')}
        </Typography>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            {t('payment.title')}
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            {t('payment.orderAmount')}: {formatPrice(convertPrice(totalAmount, selectedCurrency, exchangeRates), selectedCurrency)}
          </Typography>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Typography variant="h3" style={styles.cardTitle}>
                {t('payment.cardInfo')}
              </Typography>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Typography variant="caption" style={styles.label}>
                  {t('payment.cardNumber')}
                </Typography>
                <TextInput
                  style={[styles.input, errors.cardNumber && styles.inputError]}
                  placeholder={t('payment.cardNumberPlaceholder')}
                  value={cardData.cardNumber}
                  onChangeText={(text) => handleInputChange('cardNumber', text)}
                  keyboardType="numeric"
                  maxLength={19}
                  returnKeyType="next"
                />
                {errors.cardNumber && (
                  <Typography variant="caption" style={styles.errorText}>
                    {errors.cardNumber}
                  </Typography>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="caption" style={styles.label}>
                  {t('payment.cardHolder')}
                </Typography>
                <TextInput
                  style={[styles.input, errors.cardHolderName && styles.inputError]}
                  placeholder={t('payment.cardHolderPlaceholder')}
                  value={cardData.cardHolderName}
                  onChangeText={(text) => handleInputChange('cardHolderName', text.toUpperCase())}
                  autoCapitalize="characters"
                  returnKeyType="next"
                  autoCorrect={false}
                />
                {errors.cardHolderName && (
                  <Typography variant="caption" style={styles.errorText}>
                    {errors.cardHolderName}
                  </Typography>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Typography variant="caption" style={styles.label}>
                    {t('payment.expiryDate')}
                  </Typography>
                  <View style={styles.expiryContainer}>
                    <TextInput
                      style={[styles.input, styles.expiryInput, errors.expiryMonth && styles.inputError]}
                      placeholder={t('payment.monthPlaceholder')}
                      value={cardData.expiryMonth}
                      onChangeText={(text) => handleInputChange('expiryMonth', text.replace(/[^0-9]/g, '').slice(0, 2))}
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="next"
                    />
                    <Typography variant="body" style={styles.expirySeparator}>
                      /
                    </Typography>
                    <TextInput
                      style={[styles.input, styles.expiryInput, errors.expiryMonth && styles.inputError]}
                      placeholder={t('payment.yearPlaceholder')}
                      value={cardData.expiryYear}
                      onChangeText={(text) => handleInputChange('expiryYear', text.replace(/[^0-9]/g, '').slice(0, 2))}
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="done"
                    />
                  </View>
                  {errors.expiryMonth && (
                    <Typography variant="caption" style={styles.errorText}>
                      {errors.expiryMonth}
                    </Typography>
                  )}
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Typography variant="caption" style={styles.label}>
                    {t('payment.cvv')}
                  </Typography>
                  <TextInput
                    style={[styles.input, errors.cvv && styles.inputError]}
                    placeholder={t('payment.cvvPlaceholder')}
                    value={cardData.cvv}
                    onChangeText={(text) => handleInputChange('cvv', text.replace(/[^0-9]/g, '').slice(0, 4))}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="done"
                  />
                  {errors.cvv && (
                    <Typography variant="caption" style={styles.errorText}>
                      {errors.cvv}
                    </Typography>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Typography variant="h3" style={styles.summaryTitle}>
              {t('payment.orderSummary')}
            </Typography>
            <View style={styles.summaryRow}>
              <Typography variant="body">{t('orders.productCount')}:</Typography>
              <Typography variant="body" style={styles.summaryValue}>
                {cartItems.length} {t('product.quantity')}
              </Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography variant="body">{t('payment.shipping')}:</Typography>
              <Typography variant="body" style={styles.summaryValue}>
                {t('payment.freeShipping')}
              </Typography>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Typography variant="h3">{t('payment.total')}:</Typography>
              <Typography variant="h3" style={styles.totalAmount}>
                {formatPrice(convertPrice(totalAmount, selectedCurrency, exchangeRates), selectedCurrency)}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={isProcessing ? t('payment.processing') : t('payment.completePayment')}
            onPress={handlePayment}
            disabled={isProcessing || !isFormValid()}
            style={[
              styles.payButton,
              (!isFormValid() || isProcessing) && styles.disabledButton
            ]}
          />
        </View>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingCard}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Typography variant="body" style={styles.processingText}>
                {t('payment.paymentProcessing')}
              </Typography>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
