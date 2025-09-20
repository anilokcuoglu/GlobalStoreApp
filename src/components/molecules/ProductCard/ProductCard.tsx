import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Product } from '../../../types/product.types';
import { FastImage, Typography } from '../../atoms';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2; // 16px padding on each side + 16px gap

export const ProductCard = ({
  product,
  onPress,
}) => {
  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <FastImage
          source={{ uri: product.image }}
          style={styles.image}
          width={cardWidth - 32}
          height={120}
        />
      </View>
      
      <View style={styles.content}>
        <Typography
          variant="caption"
          style={styles.category}
          numberOfLines={1}
        >
          {product.category.toUpperCase()}
        </Typography>
        
        <Typography
          variant="body"
          style={styles.title}
          numberOfLines={2}
        >
          {truncateTitle(product.title)}
        </Typography>
        
        <View style={styles.footer}>
          <Typography variant="h3" style={styles.price}>
            ${product.price}
          </Typography>
          
          <View style={styles.rating}>
            <Typography variant="caption" style={styles.ratingText}>
              ⭐ {product.rating.rate.toFixed(1)}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
