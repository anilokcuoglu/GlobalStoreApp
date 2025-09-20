import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../../store/slices/cartSlice';
import { Typography, FastImage } from '../../components';
import { usersApi } from '../../services/api/users';
import { styles } from './CartScreen.styles';
import { convertPrice, formatPrice } from '../../utils/currency';

export const CartScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector(state => state.cart);
  const { selectedCurrency, exchangeRates } = useAppSelector((state) => state.currency);

  // Bottom sheet state
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Users query
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAllUsers,
  });

  // Bottom sheet callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const openGiftSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const closeGiftSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Backdrop callback
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeGiftSheet}
      />
    ),
    [closeGiftSheet],
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number, productTitle: string) => {
    Alert.alert(
      t('cart.removeProduct'),
      `${productTitle} ${t('cart.removeProductConfirm')}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cart.remove'),
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId)),
        },
      ],
    );
  };

  const handleClearCart = () => {
    Alert.alert(t('cart.clearCart'), t('cart.clearCartConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.clear'),
        style: 'destructive',
        onPress: () => dispatch(clearCart()),
      },
    ]);
  };

  const handleCheckout = () => {
    if (itemCount === 0) {
      Alert.alert(t('cart.warning'), t('cart.emptyCartWarning'));
      return;
    }

    Alert.alert(
      t('cart.placeOrder'),
      `${itemCount} ${t('cart.placeOrderConfirm', { 
        amount: formatPrice(convertPrice(total, selectedCurrency, exchangeRates), selectedCurrency)
      })}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cart.checkout'),
          onPress: () => {
            (navigation as any).navigate('Payment', {
              totalAmount: total,
              cartItems: items,
            });
          },
        },
      ],
    );
  };

  const handleGiftToUser = () => {
    if (!selectedUser) {
      Alert.alert(t('cart.warning'), t('cart.selectUserWarning'));
      return;
    }

    Alert.alert(
      t('cart.gift'),
      t('cart.giftConfirm').replace('user', selectedUser.username),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('cart.gift'),
          onPress: () => {
            // Fake loading delay
            setTimeout(() => {
              Alert.alert(
                '🎉 ' + t('common.success'),
                t('cart.giftSuccessMessage').replace(
                  'user',
                  selectedUser.username,
                ) +
                  '\n\n' +
                  t('cart.giftPackageSent'),
                [
                  {
                    text: t('common.great'),
                    onPress: () => {
                      dispatch(clearCart());
                      closeGiftSheet();
                      setSelectedUser(null);
                    },
                  },
                ],
              );
            }, 1000);
          },
        },
      ],
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>
        <FastImage
          source={{ uri: item.product.image }}
          style={styles.productImage}
          width={100}
          height={100}
          borderRadius={12}
          resizeMode="contain"
        />
      </View>

      <View style={styles.itemDetails}>
        <Typography
          variant="body"
          style={styles.productTitle}
          numberOfLines={2}
        >
          {item.product.title}
        </Typography>

        <Typography variant="h3" style={styles.productPrice}>
          {formatPrice(convertPrice(item.product.price, selectedCurrency, exchangeRates), selectedCurrency)}
        </Typography>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity - 1)
            }
          >
            <Typography variant="body" style={styles.quantityButtonText}>
              -
            </Typography>
          </TouchableOpacity>

          <Typography variant="body" style={styles.quantityText}>
            {item.quantity}
          </Typography>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity + 1)
            }
          >
            <Typography variant="body" style={styles.quantityButtonText}>
              +
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemActions}>
        <Typography variant="h3" style={styles.itemTotal}>
          {formatPrice(convertPrice(item.product.price * item.quantity, selectedCurrency, exchangeRates), selectedCurrency)}
        </Typography>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.product.id, item.product.title)}
        >
          <Typography variant="body" style={styles.removeButtonText}>
            ✕
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Typography variant="h2" style={styles.emptyTitle}>
        {t('cart.empty')}
      </Typography>
      <Typography variant="body" style={styles.emptyText}>
        {t('cart.emptyMessage')}
      </Typography>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Typography variant="h1" style={styles.title}>
        {t('cart.title')}
      </Typography>
      {itemCount > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Typography variant="body" style={styles.clearButtonText}>
            {t('cart.clearAll')}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (itemCount === 0) return null;

    return (
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Typography variant="body" style={styles.totalLabel}>
              {t('cart.total')}:
            </Typography>
            <Typography variant="body" style={styles.totalValue}>
              {itemCount} {t('product.quantity')}
            </Typography>
          </View>

          <View style={styles.totalRow}>
            <Typography variant="h2" style={styles.totalLabel}>
              {t('cart.totalAmount')}:
            </Typography>
            <Typography variant="h1" style={styles.totalAmount}>
              {formatPrice(convertPrice(total, selectedCurrency, exchangeRates), selectedCurrency)}
            </Typography>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.giftButton} onPress={openGiftSheet}>
            <Typography variant="body" style={styles.giftButtonText}>
              🎁 {t('cart.gift')}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Typography variant="body" style={styles.checkoutButtonText}>
              {t('cart.checkout')}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={item => item.product.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyCart}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Sheet for Gift Selection */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '75%']}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        enableOverDrag={false}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView
          style={styles.bottomSheetContent}
          contentContainerStyle={styles.bottomSheetScrollContent}
        >
          <Typography variant="h2" style={styles.bottomSheetTitle}>
            {t('cart.giftTo')}
          </Typography>

          <View style={styles.usersList}>
            {isLoadingUsers ? (
              <Typography variant="body" style={styles.loadingText}>
                {t('common.loading')}
              </Typography>
            ) : (
              users.map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userItem,
                    selectedUser?.id === user.id && styles.selectedUserItem,
                  ]}
                  onPress={() => setSelectedUser(user)}
                >
                  <View style={styles.userInfo}>
                    <Typography variant="body" style={styles.userName}>
                      {user.name?.firstname && user.name?.lastname
                        ? `${user.name.firstname} ${user.name.lastname}`
                        : user.username}
                    </Typography>
                    <Typography variant="caption" style={styles.userEmail}>
                      {user.email || `@${user.username}`}
                    </Typography>
                  </View>
                  {selectedUser?.id === user.id && (
                    <Typography variant="body" style={styles.selectedIcon}>
                      ✓
                    </Typography>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.bottomSheetActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeGiftSheet}
            >
              <Typography variant="body" style={styles.cancelButtonText}>
                {t('common.cancel')}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.giftConfirmButton,
                !selectedUser && styles.disabledButton,
              ]}
              onPress={handleGiftToUser}
              disabled={!selectedUser}
            >
              <Typography variant="body" style={styles.giftConfirmButtonText}>
                {t('cart.gift')}
              </Typography>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};
