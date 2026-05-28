-- ============================================
-- ANCHOR CUSTOMS — SCHEMA MIGRATION
-- Run this in Supabase SQL Editor (Dashboard)
-- ============================================

-- 1. Order counter (starts at 3441 so first order = #3442)
CREATE TABLE IF NOT EXISTS order_counter (
  id INT PRIMARY KEY DEFAULT 1,
  current_number INT NOT NULL DEFAULT 3441
);
INSERT INTO order_counter (id, current_number) VALUES (1, 3441)
ON CONFLICT (id) DO NOTHING;

-- 2. New orders table (1 row = 1 complete order)
CREATE TABLE IF NOT EXISTS orders_v2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,

  -- Customer
  full_name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,

  -- Structured shipping address
  shipping_address JSONB NOT NULL DEFAULT '{}',

  -- Payment
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',

  -- Totals
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,

  -- Status
  order_status TEXT DEFAULT 'received',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Order items table (1 row = 1 product inside an order)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders_v2(id) ON DELETE CASCADE,

  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  category TEXT,
  quantity INT DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,

  -- Customization
  custom_text TEXT,
  special_instructions TEXT,

  -- Images (Cloudinary URLs)
  cover_photo TEXT,
  images TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Atomic function to get next sequential order number
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS TEXT AS $$
DECLARE
  next_num INT;
BEGIN
  UPDATE order_counter
  SET current_number = current_number + 1
  WHERE id = 1
  RETURNING current_number INTO next_num;
  RETURN '#' || next_num::TEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES
-- ============================================

-- orders_v2 policies
ALTER TABLE orders_v2 ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "users_select_own_orders_v2" ON orders_v2
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "users_insert_own_orders_v2" ON orders_v2
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin emails can view ALL orders
CREATE POLICY "admin_select_all_orders_v2" ON orders_v2
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN ('karampreets090@gmail.com', 'madhur123rastogi@gmail.com')
  );

-- Admin emails can update ALL orders (status changes)
CREATE POLICY "admin_update_all_orders_v2" ON orders_v2
  FOR UPDATE USING (
    auth.jwt() ->> 'email' IN ('karampreets090@gmail.com', 'madhur123rastogi@gmail.com')
  );

-- order_items policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items of their own orders
CREATE POLICY "users_select_own_order_items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders_v2 WHERE orders_v2.id = order_items.order_id AND orders_v2.user_id = auth.uid())
  );

-- Users can insert items into their own orders
CREATE POLICY "users_insert_own_order_items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders_v2 WHERE orders_v2.id = order_items.order_id AND orders_v2.user_id = auth.uid())
  );

-- Admin emails can view ALL order items
CREATE POLICY "admin_select_all_order_items" ON order_items
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN ('karampreets090@gmail.com', 'madhur123rastogi@gmail.com')
  );

-- order_counter policies
ALTER TABLE order_counter ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can call the counter (needed during checkout)
CREATE POLICY "authenticated_use_counter" ON order_counter
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- DONE! Verify by running:
-- SELECT get_next_order_number();
-- Should return '#3442'
-- ============================================
