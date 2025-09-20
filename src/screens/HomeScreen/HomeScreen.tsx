import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types/product.types';
import { ProductCard, Typography } from '../../components';
import { styles } from './HomeScreen.styles.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, clearError } from '../../store/slices/productsSlice';
import { colors } from '../../constants/theme.ts';
import GradientText from '../../components/molecules/GradientText/GradientText.tsx';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update filtered products when products or search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay for better UX
      setTimeout(() => {
        const filtered = products.filter(
          product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredProducts(filtered);
        setIsSearching(false);
      }, 300);
    } else {
      setFilteredProducts(products);
      setIsSearching(false);
    }
  }, [products, searchQuery]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchProducts());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor={colors.neutral[400]}
          value={searchQuery}
          onChangeText={query => handleSearch(query)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Typography variant="body" style={styles.clearButtonText}>
              ✕
            </Typography>
          </TouchableOpacity>
        )}
        {isSearching && (
          <View style={styles.searchLoadingContainer}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
          </View>
        )}
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.searchResultsInfo}>
          <Typography variant="body" style={styles.searchResultsText}>
            {filteredProducts.length} {t('product.quantity')} {t('home.found')}
          </Typography>
        </View>
      )}
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => {
        Alert.alert(t('home.productSelected'), `${item.title} - $${item.price}`);
      }}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Typography variant="h3" style={styles.emptyTitle}>
        {searchQuery ? t('home.emptyTitle') : t('home.emptyTitle')}
      </Typography>
      <Typography variant="body" style={styles.emptyText}>
        {searchQuery
          ? `"${searchQuery}" ${t('home.noResults')}`
          : t('home.loading')}
      </Typography>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={clearSearch}
        >
          <Typography variant="body" style={styles.clearSearchButtonText}>
            {t('home.clearSearch')}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <GradientText
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={styles.title}
      >
        {t('auth.appName')}
      </GradientText>
      <Typography variant="body" style={styles.subtitle}>
        {t('home.subtitle')}
      </Typography>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="body" style={styles.loadingText}>
            {t('home.loading')}
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
      {renderHeader()}
      {renderSearchBar()}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      />
    </SafeAreaView>
  );
};
