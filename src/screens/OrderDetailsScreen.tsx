import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Chip, Divider} from 'react-native-paper';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {OrderStatus} from '../types';

type OrderDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'OrderDetails'
>;

const OrderDetailsScreen = () => {
  const route = useRoute<OrderDetailsScreenRouteProp>();
  const {order} = route.params;

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.header}>
              <Text variant="headlineSmall" style={styles.title}>
                Order Summary
              </Text>
              <Chip
                mode="flat"
                style={{backgroundColor: getStatusColor(order.order_status)}}
                textStyle={styles.chipText}>
                {order.order_status.toUpperCase()}
              </Chip>
            </View>

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Order ID
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.id}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Order Date
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {new Date(order.created_at).toLocaleString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Company & Contact Details
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Company Name
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.company_name}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Contact Person
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.contact_name}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Mobile Number
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.mobile_number}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Order Details
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Bottle Type
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.bottle_type}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Quantity
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.quantity}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Delivery Information
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Delivery Address
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {order.delivery_address}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="bodySmall" style={styles.label}>
                Preferred Delivery Date
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {new Date(order.delivery_date).toLocaleDateString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {order.notes && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Additional Notes
              </Text>
              <Divider style={styles.divider} />
              <Text variant="bodyLarge" style={styles.notes}>
                {order.notes}
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  value: {
    fontWeight: '500',
  },
  notes: {
    fontStyle: 'italic',
    color: '#333',
  },
});

export default OrderDetailsScreen;
