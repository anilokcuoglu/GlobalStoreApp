import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../components';
import { colors } from '../../constants/theme';
import { StorageService } from '../../utils/storage';
import { styles } from './OrdersScreen.styles';

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const ordersData = await StorageService.getOrders();
      setOrders(ordersData);
      console.log('📦 Loaded orders:', ordersData.length);
      console.log('📦 Orders data:', JSON.stringify(ordersData, null, 2));
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.semantic.success;
      case 'processing':
        return colors.semantic.warning;
      case 'cancelled':
        return colors.semantic.error;
      default:
        return colors.neutral[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'processing':
        return 'Hazırlanıyor';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item: order }: { item: any }) => {
    // Debug: Log order data
    console.log('🔍 Rendering order:', order);
    
    return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Typography variant="body" style={styles.orderNumber}>
            {order.orderNumber}
          </Typography>
          <Typography variant="caption" style={styles.orderDate}>
            {formatDate(order.date)}
          </Typography>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Typography variant="caption" style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Typography>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Typography variant="body" style={styles.summaryLabel}>
            Ürün Sayısı:
          </Typography>
          <Typography variant="body" style={styles.summaryValue}>
            {order.items.length} ürün
          </Typography>
        </View>
        <View style={styles.summaryRow}>
          <Typography variant="body" style={styles.summaryLabel}>
            Toplam Tutar:
          </Typography>
          <Typography variant="body" style={styles.summaryValue}>
            ${(order.totalAmount || 0).toFixed(2)}
          </Typography>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Typography variant="caption" style={styles.paymentMethod}>
          {order.paymentMethod}
        </Typography>
      </View>
    </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Typography style={styles.emptyIcon}>📦</Typography>
      <Typography variant="h2" style={styles.emptyTitle}>
        Henüz siparişiniz yok
      </Typography>
      <Typography variant="body" style={styles.emptySubtitle}>
        İlk siparişinizi vermek için ürünleri sepete ekleyin ve ödeme yapın
      </Typography>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation as any).goBack()}
        >
          <Typography variant="body" style={styles.backIcon}>
            ←
          </Typography>
        </TouchableOpacity>
        <Typography variant="h3" style={styles.headerTitle}>
          Siparişlerim
        </Typography>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={orders.length === 0 ? styles.emptyListContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
    </View>
  );
};

export default OrdersScreen;
