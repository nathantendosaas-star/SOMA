-- ============================================
-- SOMA UGANDA - Production Database Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the schools table (the paying entity)
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  district TEXT,
  plan TEXT DEFAULT 'free',
  voucher_code TEXT,
  max_teachers INTEGER DEFAULT 2,
  generations_used INTEGER DEFAULT 0,
  generations_limit INTEGER DEFAULT 20,
  billing_cycle_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Add school_id to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- 3. Create the vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL,
  redeemed_by UUID REFERENCES schools(id),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. RLS for schools
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own school" ON schools
  FOR SELECT USING (
    id IN (SELECT school_id FROM profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Principals can update their own school" ON schools
  FOR UPDATE USING (
    id IN (SELECT school_id FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'principal')
  );

-- 5. RLS for vouchers (locked down, only service role can manage)
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read vouchers (for redemption check)
CREATE POLICY "Authenticated users can check vouchers" ON vouchers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only service_role can insert/update vouchers (admin portal uses service key)
-- No insert/update policy = blocked for normal users

-- 6. Seed some starter vouchers for testing
INSERT INTO vouchers (code, plan) VALUES
  ('4K9N-1J7Z-2B6W-202', 'pro'),
  ('8X2P-9L1V-5M7Q-499', 'institutional'),
  ('SOMA-PRO-TEST-001', 'pro'),
  ('SOMA-INST-TEST-01', 'institutional')
ON CONFLICT (code) DO NOTHING;
