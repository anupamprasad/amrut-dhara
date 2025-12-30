export interface User {
  id: string;
  email: string;
  companyName?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';

export type BottleType = '200ml' | '300ml' | '500ml';

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
}
