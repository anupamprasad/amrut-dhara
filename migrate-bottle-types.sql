-- ============================================
-- Migration: Update Bottle Types from L to ML
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop the existing check constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_bottle_type_check;

-- Step 2: Update existing data to new bottle types
-- Map old values to new values
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

-- Step 3: Add new check constraint with ML values
ALTER TABLE orders 
ADD CONSTRAINT orders_bottle_type_check 
CHECK (bottle_type IN ('200ML', '300ML', '500ML'));

-- Verify the migration
-- SELECT bottle_type, COUNT(*) as count 
-- FROM orders 
-- GROUP BY bottle_type;
