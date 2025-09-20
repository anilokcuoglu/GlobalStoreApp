import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components';
import { styles } from './CategoriesScreen.styles';

export const CategoriesScreen = () => {
  const { data: categories, isLoading, error } = useProductCategories();

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
      <View style={styles.categoryContent}>
        <Typography variant="h3" style={styles.categoryTitle}>
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Typography>
        <Typography variant="caption" style={styles.categorySubtitle}>
          Kategorideki ürünleri keşfet
        </Typography>
      </View>
      <Typography style={styles.arrow}>→</Typography>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Typography variant="body" style={styles.loadingText}>
            Kategoriler yükleniyor...
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
            Kategoriler yüklenemedi
          </Typography>
          <Typography variant="body" style={styles.errorText}>
            {error.message || 'Bir hata oluştu'}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>
          Kategoriler
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          İlgilendiğiniz kategorileri keşfedin
        </Typography>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
