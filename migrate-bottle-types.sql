-- ============================================
-- Migration: Update Bottle Types from L to ML
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop ALL existing constraints on bottle_type
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    FOR constraint_name IN 
        SELECT con.conname
        FROM pg_constraint con
        INNER JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'orders' 
        AND con.contype = 'c'
        AND pg_get_constraintdef(con.oid) LIKE '%bottle_type%'
    LOOP
        EXECUTE 'ALTER TABLE orders DROP CONSTRAINT ' || quote_ident(constraint_name);
    END LOOP;
END $$;

-- Step 2: Update existing data to new bottle types
-- Map old values to new values
UPDATE orders 
SET bottle_type = CASE 
  WHEN bottle_type IN ('20L', '10L', '5L', '2L', '1L') THEN 
    CASE 
      WHEN bottle_type = '20L' THEN '500ML'
      WHEN bottle_type = '10L' THEN '300ML'
      WHEN bottle_type IN ('5L', '2L', '1L') THEN '200ML'
    END
  ELSE bottle_type
END;

-- Step 3: Add new check constraint with ML values
ALTER TABLE orders 
ADD CONSTRAINT orders_bottle_type_check 
CHECK (bottle_type IN ('200ML', '300ML', '500ML'));

-- Verify the migration
SELECT bottle_type, COUNT(*) as count 
FROM orders 
GROUP BY bottle_type;
