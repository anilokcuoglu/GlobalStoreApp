import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { Typography, FastImage } from '../../components';
import { styles } from './CartScreen.styles';

export const CartScreen = () => {
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector(state => state.cart);

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
    Alert.alert(
      'Sipariş Ver',
      `Toplam ${itemCount} ürün için $${total.toFixed(2)} ödeme yapmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ödeme Yap', onPress: () => {
          Alert.alert('Başarılı', 'Siparişiniz alındı!');
          dispatch(clearCart());
        }},
      ]
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <FastImage
        source={{ uri: item.product.image }}
        style={styles.productImage}
        width={80}
        height={80}
        borderRadius={8}
      />
      
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
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Typography variant="body" style={styles.checkoutButtonText}>
            Sipariş Ver
          </Typography>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
};