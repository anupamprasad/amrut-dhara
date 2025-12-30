-- ============================================
-- Enhanced Orders Table Schema - Amrut Dhara B2B
-- Run this SQL in Supabase SQL Editor to add new fields
-- ============================================

-- Add new columns to existing orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
  ADD COLUMN IF NOT EXISTS delivery_time_preference TEXT CHECK (delivery_time_preference IN ('morning', 'afternoon', 'evening', 'anytime')),
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'online', 'credit')),
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS gst_number TEXT,
  ADD COLUMN IF NOT EXISTS billing_address TEXT,
  ADD COLUMN IF NOT EXISTS landmark TEXT,
  ADD COLUMN IF NOT EXISTS pincode TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS delivery_person_id UUID,
  ADD COLUMN IF NOT EXISTS delivery_person_name TEXT,
  ADD COLUMN IF NOT EXISTS delivery_otp TEXT,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS cancelled_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_by UUID,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS feedback TEXT,
  ADD COLUMN IF NOT EXISTS is_priority BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS empty_bottles_returned INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create indexes for new searchable fields
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_pincode ON orders(pincode);
CREATE INDEX IF NOT EXISTS idx_orders_city ON orders(city);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_person ON orders(delivery_person_id);
CREATE INDEX IF NOT EXISTS idx_orders_is_priority ON orders(is_priority);
CREATE INDEX IF NOT EXISTS idx_orders_delivered_at ON orders(delivered_at);

-- Update RLS policies to allow users to update their orders (for feedback, etc.)
CREATE POLICY IF NOT EXISTS "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a function to calculate order amount based on quantity and bottle type
CREATE OR REPLACE FUNCTION calculate_order_amount()
RETURNS TRIGGER AS $$
DECLARE
  unit_price DECIMAL(10,2);
BEGIN
  -- Set price based on bottle type
  CASE NEW.bottle_type
    WHEN '20L' THEN unit_price := 50.00;
    WHEN '10L' THEN unit_price := 30.00;
    WHEN '5L' THEN unit_price := 20.00;
    WHEN '2L' THEN unit_price := 10.00;
    WHEN '1L' THEN unit_price := 6.00;
    ELSE unit_price := 0.00;
  END CASE;
  
  -- Calculate total amount
  NEW.total_amount := unit_price * NEW.quantity;
  
  -- Calculate final amount (total - discount)
  IF NEW.discount_amount IS NULL THEN
    NEW.discount_amount := 0;
  END IF;
  NEW.final_amount := NEW.total_amount - NEW.discount_amount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate amounts
DROP TRIGGER IF EXISTS calculate_order_amount_trigger ON orders;
CREATE TRIGGER calculate_order_amount_trigger
  BEFORE INSERT OR UPDATE OF quantity, bottle_type, discount_amount
  ON orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_amount();

-- Create a function to generate delivery OTP
CREATE OR REPLACE FUNCTION generate_delivery_otp()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate 6-digit OTP when order is confirmed
  IF NEW.order_status = 'confirmed' AND OLD.order_status != 'confirmed' THEN
    NEW.delivery_otp := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for OTP generation
DROP TRIGGER IF EXISTS generate_otp_trigger ON orders;
CREATE TRIGGER generate_otp_trigger
  BEFORE UPDATE OF order_status
  ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_delivery_otp();

-- Updated order statistics view with new fields
DROP VIEW IF EXISTS order_statistics;
CREATE OR REPLACE VIEW order_statistics AS
SELECT
  user_id,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE order_status = 'pending') as pending_orders,
  COUNT(*) FILTER (WHERE order_status = 'processing') as processing_orders,
  COUNT(*) FILTER (WHERE order_status = 'confirmed') as confirmed_orders,
  COUNT(*) FILTER (WHERE order_status = 'delivered') as delivered_orders,
  COUNT(*) FILTER (WHERE order_status = 'cancelled') as cancelled_orders,
  SUM(quantity) as total_bottles,
  SUM(final_amount) as total_revenue,
  AVG(rating) FILTER (WHERE rating IS NOT NULL) as avg_rating,
  COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_orders,
  COUNT(*) FILTER (WHERE is_priority = true) as priority_orders,
  MAX(created_at) as last_order_date,
  MAX(delivered_at) as last_delivery_date
FROM orders
GROUP BY user_id;

GRANT SELECT ON order_statistics TO authenticated;

-- Create delivery personnel table (optional - for future use)
CREATE TABLE IF NOT EXISTS delivery_personnel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for delivery person
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS fk_delivery_person;

ALTER TABLE orders
  ADD CONSTRAINT fk_delivery_person
  FOREIGN KEY (delivery_person_id)
  REFERENCES delivery_personnel(id)
  ON DELETE SET NULL;

-- Create index for active delivery personnel
CREATE INDEX IF NOT EXISTS idx_delivery_personnel_active ON delivery_personnel(is_active);

COMMENT ON TABLE orders IS 'Enhanced orders table with payment, delivery tracking, and customer feedback';
COMMENT ON COLUMN orders.email IS 'Customer email for notifications';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: cash, online, or credit';
COMMENT ON COLUMN orders.payment_status IS 'Payment status tracking';
COMMENT ON COLUMN orders.delivery_otp IS 'OTP for delivery confirmation';
COMMENT ON COLUMN orders.is_priority IS 'Flag for priority orders';
COMMENT ON COLUMN orders.is_recurring IS 'Flag for recurring orders';
COMMENT ON COLUMN orders.empty_bottles_returned IS 'Count of empty bottles returned';

-- ============================================
-- Verification Queries
-- ============================================

-- Check new columns
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- ORDER BY ordinal_position;

-- Check all triggers
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE event_object_table = 'orders';
