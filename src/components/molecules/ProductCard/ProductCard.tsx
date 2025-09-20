import { View, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Product } from '../../../types/product.types';
import { FastImage, Typography } from '../../atoms';
import { styles } from './ProductCard.styles';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart, updateQuantity } from '../../../store/slices/cartSlice';
import { FavoritesService } from '../../../utils/favorites';
import { colors } from '../../../constants/theme';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2; 

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);
  
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const cartItem = items.find(item => item.product.id === product.id);
  const inCartQuantity = cartItem?.quantity || 0;
  
  useEffect(() => {
    setIsFavorite(FavoritesService.isFavorite(product.id));
  }, [product.id]);
  
  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };
  
  const handleFavoriteToggle = () => {
    const success = FavoritesService.toggleFavorite(product.id);
    if (success) {
      const newFavoriteStatus = FavoritesService.isFavorite(product.id);
      setIsFavorite(newFavoriteStatus);
      
      if (newFavoriteStatus) {
        Alert.alert('Başarılı', 'Ürün favorilere eklendi!');
      } else {
        Alert.alert('Başarılı', 'Ürün favorilerden çıkarıldı!');
      }
    } else {
      Alert.alert('Hata', 'Favori işlemi başarısız oldu!');
    }
  };
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setIsLoading(true);
      
      // Fake loading for better UX
      setTimeout(() => {
        setQuantity(newQuantity);
        setIsLoading(false);
      }, 300);
    }
  };
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    
    // Fake loading for better UX
    setTimeout(() => {
      if (inCartQuantity > 0) {
        dispatch(updateQuantity({ productId: product.id, quantity: inCartQuantity + quantity }));
        Alert.alert('Başarılı', `${quantity} adet ürün sepete eklendi!`);
      } else {
        dispatch(addToCart(product));
        Alert.alert('Başarılı', 'Ürün sepete eklendi!');
      }
      setQuantity(1);
      setIsLoading(false);
    }, 300);
  };

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <FastImage
            source={{ uri: product.image }}
            style={styles.image}
            width={cardWidth - 32}
            height={120}
            borderRadius={8}
            resizeMode="contain"
          />
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Typography variant="body" style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Typography variant="caption" style={styles.category} numberOfLines={1}>
            {product.category.toUpperCase()}
          </Typography>

          <Typography variant="body" style={styles.title} numberOfLines={2}>
            {truncateTitle(product.title)}
          </Typography>

          <View style={styles.ratingAndQuantityRow}>
            <View style={styles.rating}>
              <Typography variant="caption" style={styles.ratingText}>
                ⭐ {product.rating?.rate?.toFixed(1) || '0.0'}
              </Typography>
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isLoading}
              >
                <Typography variant="caption" style={[styles.quantityButtonText, quantity <= 1 && styles.disabledText]}>
                  -
                </Typography>
              </TouchableOpacity>
              
              <Typography variant="caption" style={styles.quantityText}>
                {quantity}
              </Typography>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99 || isLoading}
              >
                <Typography variant="caption" style={[styles.quantityButtonText, quantity >= 99 && styles.disabledText]}>
                  +
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Full Width Add to Cart Button */}
      <View style={styles.topActionContainer}>
        <TouchableOpacity
          style={[styles.addToCartButton, inCartQuantity > 0 && styles.addToCartButtonActive]}
          onPress={handleAddToCart}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Typography variant="body" style={[styles.addToCartIcon, inCartQuantity > 0 && styles.addToCartIconActive]}>
            🛒
          </Typography>
          <Typography variant="body" style={[styles.addToCartText, inCartQuantity > 0 && styles.addToCartTextActive]}>
            {inCartQuantity > 0 ? `Sepette (${inCartQuantity})` : 'Sepete Ekle'}
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Typography variant="h3" style={styles.price}>
          ${product.price}
        </Typography>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};
