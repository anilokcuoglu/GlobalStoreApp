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
import { useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/slices/cartSlice';
import { Typography } from '../../components';
import PrimaryButton from '../../components/molecules/PrimaryButton/PrimaryButton';
import { colors } from '../../constants/theme';
import { PaymentCard } from '../../types/payment.types';
import { StorageService } from '../../utils/storage';
import { styles } from './PaymentScreen.styles';

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { totalAmount, cartItems } = route.params as any;

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
      newErrors.cardNumber = 'Kart numarası 16 haneli olmalıdır';
    }

    if (!cardData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Kart sahibi adı gerekli';
    }

    if (!validateExpiry(cardData.expiryMonth, cardData.expiryYear)) {
      newErrors.expiryMonth = 'Geçerli bir son kullanma tarihi girin';
    }

    if (!validateCVV(cardData.cvv)) {
      newErrors.cvv = 'CVV 3-4 haneli olmalıdır';
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
      Alert.alert('Hata', 'Lütfen tüm alanları doğru şekilde doldurun.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

      // Save payment card to storage
      await StorageService.addPaymentCard({
        ...cardData,
        lastUsed: new Date().toISOString(),
        isDefault: true,
      });

      // Show success message
      Alert.alert(
        '🎉 Ödeme Başarılı!',
        `Siparişiniz başarıyla oluşturuldu.\n\nTutar: $${totalAmount.toFixed(2)}\n\nSipariş numaranız: #${Math.floor(Math.random() * 1000000)}`,
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Clear cart and go back to main app
              dispatch(clearCart());
              (navigation as any).navigate('MainApp');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Ödeme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof PaymentCard, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    }
    
    setCardData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
          <Typography variant="body" style={styles.backIcon}>←</Typography>
        </TouchableOpacity>
        <Typography variant="h3" style={styles.headerTitle}>
          Ödeme
        </Typography>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Ödeme
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            Sipariş tutarı: ${totalAmount.toFixed(2)}
          </Typography>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Typography variant="h3" style={styles.cardTitle}>
                Kredi Kartı Bilgileri
              </Typography>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Typography variant="caption" style={styles.label}>
                  Kart Numarası
                </Typography>
                <TextInput
                  style={[styles.input, errors.cardNumber && styles.inputError]}
                  placeholder="1234 5678 9012 3456"
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
                  Kart Sahibi Adı
                </Typography>
                <TextInput
                  style={[styles.input, errors.cardHolderName && styles.inputError]}
                  placeholder="JOHN DOE"
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
                    Son Kullanma Tarihi
                  </Typography>
                  <View style={styles.expiryContainer}>
                    <TextInput
                      style={[styles.input, styles.expiryInput, errors.expiryMonth && styles.inputError]}
                      placeholder="MM"
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
                      placeholder="YY"
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
                    CVV
                  </Typography>
                  <TextInput
                    style={[styles.input, errors.cvv && styles.inputError]}
                    placeholder="123"
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
              Sipariş Özeti
            </Typography>
            <View style={styles.summaryRow}>
              <Typography variant="body">Ürün Sayısı:</Typography>
              <Typography variant="body" style={styles.summaryValue}>
                {cartItems.length} adet
              </Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography variant="body">Kargo:</Typography>
              <Typography variant="body" style={styles.summaryValue}>
                Ücretsiz
              </Typography>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Typography variant="h3">Toplam:</Typography>
              <Typography variant="h3" style={styles.totalAmount}>
                ${totalAmount.toFixed(2)}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={isProcessing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
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
                Ödeme işleniyor...
              </Typography>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
