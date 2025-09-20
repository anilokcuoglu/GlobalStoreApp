import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Product } from '../../types/product.types';
import { ProductCard, Typography } from '../../components';
import { styles } from './HomeScreen.styles.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, clearError } from '../../store/slices/productsSlice';

export const HomeScreen = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  // Component mount olduğunda ürünleri getir
  useEffect(() => {
    dispatch(fetchProducts(10)); // İlk 20 ürünü getir
  }, [dispatch]);

  // // Refresh fonksiyonu
  // const handleRefresh = () => {
  //   dispatch(clearError()); // Önceki hataları temizle
  //   dispatch(fetchProducts(10));
  // };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => {
        Alert.alert('Product Selected', `${item.title} - $${item.price}`);
      }}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Typography variant="h1" style={styles.title}>
        Global Store
      </Typography>
      <Typography variant="body" style={styles.subtitle}>
        Discover amazing products
      </Typography>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Typography variant="body" style={styles.loadingText}>
            Loading products...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Typography variant="h3" style={styles.errorTitle}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body" style={styles.errorText}>
            {error || 'Failed to load products'}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        // refreshControl={
        //   <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        // }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
