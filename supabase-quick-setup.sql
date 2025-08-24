-- =====================================================
-- KAF PORTAL SUPABASE QUICK SETUP
-- Bu komutları Supabase SQL Editor'de çalıştırın
-- =====================================================

-- Önce mevcut tabloları kontrol edin
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Eğer tablolar yoksa, bu komutları çalıştırın:

-- 1. Users tablosu
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'volunteer')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inventory tablosu
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INTEGER DEFAULT 0,
  unit VARCHAR(50),
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'low_stock', 'out_of_stock', 'discontinued')),
  location VARCHAR(255),
  min_quantity INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Analytics Events tablosu
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  properties JSONB,
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) ayarları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Temel politikalar
CREATE POLICY "Anyone can view inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can view analytics events" ON analytics_events FOR SELECT USING (true);

-- Örnek veri ekleme
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@kafportal.com', '$2b$10$example_hash', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO inventory (name, description, category, quantity, unit, status, location) VALUES
('Pirinç', '5kg paket pirinç', 'Gıda', 50, 'paket', 'available', 'Depo A'),
('Makarna', '500g paket makarna', 'Gıda', 100, 'paket', 'available', 'Depo A'),
('Süt', '1L süt', 'Gıda', 30, 'adet', 'low_stock', 'Depo B')
ON CONFLICT DO NOTHING;

-- Son kontrol
SELECT 'Kurulum tamamlandı!' as status, COUNT(*) as user_count FROM users;
SELECT 'Envanter hazır!' as status, COUNT(*) as inventory_count FROM inventory;
