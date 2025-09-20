import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { Typography, FastImage } from '../../components';
import { usersApi } from '../../services/api/users';
import { styles } from './CartScreen.styles';

export const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector(state => state.cart);
  
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
    [closeGiftSheet]
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
      'Ürünü Kaldır',
      `${productTitle} ürününü sepetten kaldırmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Kaldır', style: 'destructive', onPress: () => dispatch(removeFromCart(productId)) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Sepeti Temizle',
      'Tüm ürünleri sepetten kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Temizle', style: 'destructive', onPress: () => dispatch(clearCart()) },
      ]
    );
  };

  const handleCheckout = () => {
    if (itemCount === 0) {
      Alert.alert('Uyarı', 'Sepetinizde ürün bulunmuyor.');
      return;
    }

    Alert.alert(
      'Sipariş Ver',
      `Toplam ${itemCount} ürün için $${total.toFixed(2)} ödeme yapmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ödeme Yap', onPress: () => {
          (navigation as any).navigate('Payment', {
            totalAmount: total,
            cartItems: items,
          });
        }},
      ]
    );
  };
  
  const handleGiftToUser = () => {
    if (!selectedUser) {
      Alert.alert('Uyarı', 'Lütfen hediye edilecek kullanıcıyı seçin.');
      return;
    }
    
    Alert.alert(
      'Hediye Et',
      `Sepetinizi ${selectedUser.username} kullanıcısına hediye etmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Hediye Et', onPress: () => {
          // Fake loading delay
          setTimeout(() => {
            Alert.alert(
              '🎉 Başarılı!', 
              `Sepetiniz ${selectedUser.username} kullanıcısına hediye edildi!\n\nHediye paketi kullanıcıya gönderildi.`,
              [
                { 
                  text: 'Harika!', 
                  onPress: () => {
                    dispatch(clearCart());
                    closeGiftSheet();
                    setSelectedUser(null);
                  }
                }
              ]
            );
          }, 1000);
        }},
      ]
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
        <Typography variant="body" style={styles.productTitle} numberOfLines={2}>
          {item.product.title}
        </Typography>
        
        <Typography variant="h3" style={styles.productPrice}>
          ${item.product.price}
        </Typography>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
          >
            <Typography variant="body" style={styles.quantityButtonText}>-</Typography>
          </TouchableOpacity>
          
          <Typography variant="body" style={styles.quantityText}>
            {item.quantity}
          </Typography>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
          >
            <Typography variant="body" style={styles.quantityButtonText}>+</Typography>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Typography variant="h3" style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Typography>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.product.id, item.product.title)}
        >
          <Typography variant="body" style={styles.removeButtonText}>✕</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Typography variant="h2" style={styles.emptyTitle}>
        Sepetiniz Boş
      </Typography>
      <Typography variant="body" style={styles.emptyText}>
        Henüz sepetinize ürün eklemediniz. Ürünleri keşfetmek için ana sayfaya dönün.
      </Typography>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Typography variant="h1" style={styles.title}>
        Sepetim
      </Typography>
      {itemCount > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Typography variant="body" style={styles.clearButtonText}>
            Temizle
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
              Toplam Ürün:
            </Typography>
            <Typography variant="body" style={styles.totalValue}>
              {itemCount} adet
            </Typography>
          </View>
          
          <View style={styles.totalRow}>
            <Typography variant="h2" style={styles.totalLabel}>
              Toplam Tutar:
            </Typography>
            <Typography variant="h1" style={styles.totalAmount}>
              ${total.toFixed(2)}
            </Typography>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.giftButton} onPress={openGiftSheet}>
            <Typography variant="body" style={styles.giftButtonText}>
              🎁 Hediye Et
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Typography variant="body" style={styles.checkoutButtonText}>
              Sipariş Ver
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
            Kullanıcı Seç
          </Typography>
          
          <View style={styles.usersList}>
            {isLoadingUsers ? (
              <Typography variant="body" style={styles.loadingText}>
                Kullanıcılar yükleniyor...
              </Typography>
            ) : (
              users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userItem,
                    selectedUser?.id === user.id && styles.selectedUserItem
                  ]}
                  onPress={() => setSelectedUser(user)}
                >
                  <View style={styles.userInfo}>
                    <Typography variant="body" style={styles.userName}>
                      {user.name?.firstname && user.name?.lastname 
                        ? `${user.name.firstname} ${user.name.lastname}`
                        : user.username
                      }
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
            <TouchableOpacity style={styles.cancelButton} onPress={closeGiftSheet}>
              <Typography variant="body" style={styles.cancelButtonText}>
                İptal
              </Typography>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.giftConfirmButton, !selectedUser && styles.disabledButton]} 
              onPress={handleGiftToUser}
              disabled={!selectedUser}
            >
              <Typography variant="body" style={styles.giftConfirmButtonText}>
                Hediye Et
              </Typography>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};