import {supabase} from './supabase';
import {Order, NewOrderInput} from '../types';
import {notificationService} from './notificationService';

export interface OrderResponse {
  success: boolean;
  error?: string;
  order?: Order;
  orders?: Order[];
}

export const orderService = {
  async createOrder(
    userId: string,
    orderData: NewOrderInput,
  ): Promise<OrderResponse> {
    try {
      const {data, error} = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          ...orderData,
          order_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Order creation failed:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log('✅ Order created successfully:', data?.id);

      // Send notifications after successful order creation
      if (data) {
        console.log('🔔 Triggering notifications for order:', data.id);
        notificationService
          .sendOrderNotifications(data.id, orderData)
          .then(() => console.log('✅ Notification process completed'))
          .catch(err => console.error('❌ Notification error:', err));
      }

      return {
        success: true,
        order: data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async getOrders(userId: string): Promise<OrderResponse> {
    try {
      const {data, error} = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        orders: data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },

  async getOrderById(orderId: string): Promise<OrderResponse> {
    try {
      const {data, error} = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        order: data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },
};
