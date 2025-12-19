import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Text, Card, Chip, ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../hooks/useAuth';
import {orderService} from '../services/orderService';
import {Order, OrderStatus} from '../types';

type OrderHistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderHistory'
>;

const OrderHistoryScreen = () => {
  const navigation = useNavigation<OrderHistoryScreenNavigationProp>();
  const {user} = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    const result = await orderService.getOrders(user.id);
    if (result.success && result.orders) {
      setOrders(result.orders);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '#FFA000';
      case 'processing':
        return '#1976D2';
      case 'confirmed':
        return '#388E3C';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#D32F2F';
      default:
        return '#757575';
    }
  };

  const renderOrderItem = ({item}: {item: Order}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetails', {order: item})}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.orderId}>
              Order #{item.id.slice(0, 8)}
            </Text>
            <Chip
              mode="flat"
              style={{backgroundColor: getStatusColor(item.order_status)}}
              textStyle={styles.chipText}>
              {item.order_status.toUpperCase()}
            </Chip>
          </View>

          <View style={styles.cardBody}>
            <Text variant="bodyMedium" style={styles.detailText}>
              {item.bottle_type} × {item.quantity}
            </Text>
            <Text variant="bodySmall" style={styles.dateText}>
              Ordered: {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <Text variant="bodySmall" style={styles.dateText}>
              Delivery: {new Date(item.delivery_date).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Orders Yet
      </Text>
      <Text variant="bodyLarge" style={styles.emptyText}>
        You haven't placed any orders yet.
      </Text>
      <Text variant="bodyLarge" style={styles.emptyText}>
        Start by creating your first order!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={
          orders.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontWeight: 'bold',
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 4,
  },
  detailText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default OrderHistoryScreen;
