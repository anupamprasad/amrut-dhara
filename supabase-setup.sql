-- ============================================
-- Amrut-Dhara B2B App - Supabase Database Setup
-- ============================================

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  bottle_type TEXT NOT NULL CHECK (bottle_type IN ('200ML', '300ML', '500ML')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  notes TEXT,
  order_status TEXT DEFAULT 'pending' NOT NULL CHECK (order_status IN ('pending', 'processing', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;

-- Create RLS Policies
-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own orders
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for order statistics (useful for admin dashboard)
CREATE OR REPLACE VIEW order_statistics AS
SELECT
  user_id,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE order_status = 'pending') as pending_orders,
  COUNT(*) FILTER (WHERE order_status = 'processing') as processing_orders,
  COUNT(*) FILTER (WHERE order_status = 'confirmed') as confirmed_orders,
  COUNT(*) FILTER (WHERE order_status = 'delivered') as delivered_orders,
  COUNT(*) FILTER (WHERE order_status = 'cancelled') as cancelled_orders,
  SUM(quantity) as total_quantity,
  MAX(created_at) as last_order_date
FROM orders
GROUP BY user_id;

-- Grant access to authenticated users
GRANT SELECT ON order_statistics TO authenticated;

-- ============================================
-- Test Data (Optional - Remove in production)
-- ============================================
-- Uncomment below to insert test data after creating a user

-- INSERT INTO orders (user_id, company_name, contact_name, mobile_number, bottle_type, quantity, delivery_address, delivery_date, notes, order_status)
-- VALUES 
--   (
--     'your-test-user-uuid-here',
--     'Test Company Ltd',
--     'John Doe',
--     '9876543210',
--     '20L',
--     50,
--     '123 Main Street, City, State - 123456',
--     CURRENT_DATE + INTERVAL '3 days',
--     'Please deliver in the morning',
--     'pending'
--   );

-- ============================================
-- Verification Queries
-- ============================================
-- Run these queries to verify setup

-- Check if table exists
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'orders';
