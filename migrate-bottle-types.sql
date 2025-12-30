-- ============================================
-- CRITICAL: Run this IMMEDIATELY in Supabase SQL Editor
-- Migration: Update Bottle Types from L to ML
-- ============================================

-- Step 1: Drop ALL check constraints on the orders table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'orders'::regclass 
        AND contype = 'c'
    ) LOOP
        EXECUTE 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- Step 2: Update existing data to new bottle types (if any exist)
UPDATE orders 
SET bottle_type = CASE 
  WHEN bottle_type = '20L' THEN '500ML'
  WHEN bottle_type = '10L' THEN '300ML'
  WHEN bottle_type = '5L' THEN '200ML'
  WHEN bottle_type = '2L' THEN '200ML'
  WHEN bottle_type = '1L' THEN '200ML'
  ELSE bottle_type
END
WHERE bottle_type IN ('20L', '10L', '5L', '2L', '1L');

-- Step 3: Re-add all necessary constraints
ALTER TABLE orders 
ADD CONSTRAINT orders_bottle_type_check 
CHECK (bottle_type IN ('200ML', '300ML', '500ML'));

ALTER TABLE orders 
ADD CONSTRAINT orders_quantity_check 
CHECK (quantity > 0);

ALTER TABLE orders 
ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('pending', 'processing', 'confirmed', 'delivered', 'cancelled'));

-- Step 4: Verify the migration worked
SELECT 'Migration complete!' as status;
SELECT bottle_type, COUNT(*) as count 
FROM orders 
GROUP BY bottle_type;
