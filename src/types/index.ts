export interface User {
  id: string;
  email: string;
  companyName?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';

export type BottleType = '20L' | '10L' | '5L' | '2L' | '1L';

export type DeliveryTimePreference = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type PaymentMethod = 'cash' | 'online' | 'credit';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface Order {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  mobile_number: string;
  bottle_type: BottleType;
  quantity: number;
  delivery_address: string;
  delivery_date: string;
  notes?: string;
  order_status: OrderStatus;
  created_at: string;
  updated_at?: string;
  // Enhanced fields
  email?: string;
  alternate_phone?: string;
  delivery_time_preference?: DeliveryTimePreference;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  total_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  gst_number?: string;
  billing_address?: string;
  landmark?: string;
  pincode?: string;
  city?: string;
  state?: string;
  delivery_person_id?: string;
  delivery_person_name?: string;
  delivery_otp?: string;
  delivered_at?: string;
  cancelled_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  rating?: number;
  feedback?: string;
  is_priority?: boolean;
  is_recurring?: boolean;
  recurring_frequency?: RecurringFrequency;
  empty_bottles_returned?: number;
  admin_notes?: string;
}

export interface NewOrderInput {
  company_name: string;
  contact_name: string;
  mobile_number: string;
  bottle_type: BottleType;
  quantity: number;
  delivery_address: string;
  delivery_date: string;
  notes?: string;
  // Optional enhanced fields
  email?: string;
  alternate_phone?: string;
  delivery_time_preference?: DeliveryTimePreference;
  payment_method?: PaymentMethod;
  gst_number?: string;
  billing_address?: string;
  landmark?: string;
  pincode?: string;
  city?: string;
  state?: string;
  is_priority?: boolean;
  is_recurring?: boolean;
  recurring_frequency?: RecurringFrequency;
}
