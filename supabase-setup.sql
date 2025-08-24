-- KAF Portal Supabase Database Setup
-- Bu dosya Supabase SQL Editor'de çalıştırılmalıdır

-- =====================================================
-- TABLOLAR
-- =====================================================

-- Users tablosu
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

-- Inventory tablosu
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

-- Tasks tablosu
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beneficiaries tablosu
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  family_size INTEGER DEFAULT 1,
  income_level VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aid records tablosu
CREATE TABLE IF NOT EXISTS aid_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID REFERENCES beneficiaries(id),
  aid_type VARCHAR(100) NOT NULL CHECK (aid_type IN ('financial', 'food', 'clothing', 'medical', 'education', 'other')),
  amount DECIMAL(10,2),
  description TEXT,
  aid_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'delivered', 'cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions tablosu
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations tablosu
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255),
  donor_phone VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers tablosu
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skills TEXT[],
  availability TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings tablosu
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- dakika cinsinden
  location VARCHAR(255),
  meeting_type VARCHAR(50) CHECK (meeting_type IN ('board', 'committee', 'general', 'volunteer')),
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages tablosu
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships tablosu
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  academic_year VARCHAR(9),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospital referrals tablosu
CREATE TABLE IF NOT EXISTS hospital_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20),
  hospital_name VARCHAR(255),
  department VARCHAR(100),
  referral_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXLER
-- =====================================================

-- Users tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Inventory tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_created_by ON inventory(created_by);

-- Tasks tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Beneficiaries tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_created_by ON beneficiaries(created_by);

-- Aid records tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_aid_records_beneficiary_id ON aid_records(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_aid_records_aid_type ON aid_records(aid_type);
CREATE INDEX IF NOT EXISTS idx_aid_records_aid_date ON aid_records(aid_date);

-- Financial transactions tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_transaction_date ON financial_transactions(transaction_date);

-- Donations tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Tüm tablolar için RLS'yi etkinleştir
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_referrals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GÜVENLİK POLİTİKALARI
-- =====================================================

-- Users tablosu için politikalar
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Inventory tablosu için politikalar
CREATE POLICY "Anyone can view inventory" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage inventory" ON inventory
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Tasks tablosu için politikalar
CREATE POLICY "Users can view assigned tasks" ON tasks
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Managers and admins can manage tasks" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Beneficiaries tablosu için politikalar
CREATE POLICY "Anyone can view beneficiaries" ON beneficiaries
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage beneficiaries" ON beneficiaries
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Aid records tablosu için politikalar
CREATE POLICY "Anyone can view aid records" ON aid_records
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage aid records" ON aid_records
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Financial transactions tablosu için politikalar
CREATE POLICY "Anyone can view financial transactions" ON financial_transactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage financial transactions" ON financial_transactions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Donations tablosu için politikalar
CREATE POLICY "Anyone can view donations" ON donations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage donations" ON donations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Volunteers tablosu için politikalar
CREATE POLICY "Anyone can view volunteers" ON volunteers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage volunteers" ON volunteers
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Meetings tablosu için politikalar
CREATE POLICY "Anyone can view meetings" ON meetings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage meetings" ON meetings
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Messages tablosu için politikalar
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR
    recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Scholarships tablosu için politikalar
CREATE POLICY "Anyone can view scholarships" ON scholarships
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage scholarships" ON scholarships
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Hospital referrals tablosu için politikalar
CREATE POLICY "Anyone can view hospital referrals" ON hospital_referrals
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage hospital referrals" ON hospital_referrals
  FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- TRIGGER FONKSİYONLARI
-- =====================================================

-- Updated_at alanını otomatik güncelleyen fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tüm tablolar için updated_at trigger'ları
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aid_records_updated_at BEFORE UPDATE ON aid_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospital_referrals_updated_at BEFORE UPDATE ON hospital_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ÖRNEK VERİLER
-- =====================================================

-- Admin kullanıcısı oluştur
INSERT INTO users (email, password_hash, first_name, last_name, role, status) VALUES
('admin@kafportal.com', '$2b$10$example_hash', 'Admin', 'User', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Örnek kategoriler için inventory
INSERT INTO inventory (name, description, category, quantity, unit, status, location) VALUES
('Pirinç', '5kg paket pirinç', 'Gıda', 50, 'paket', 'available', 'Depo A'),
('Makarna', '500g paket makarna', 'Gıda', 100, 'paket', 'available', 'Depo A'),
('Süt', '1L süt', 'Gıda', 30, 'adet', 'low_stock', 'Depo B'),
('Kalem', 'Mavi kalem', 'Kırtasiye', 200, 'adet', 'available', 'Depo C')
ON CONFLICT DO NOTHING;

-- Örnek görevler
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Depo kontrolü', 'Haftalık depo kontrolü yapılacak', 'pending', 'medium', NOW() + INTERVAL '7 days'),
('Bağış toplama', 'Mahalle bağış toplama kampanyası', 'pending', 'high', NOW() + INTERVAL '3 days'),
('Toplantı hazırlığı', 'Aylık yönetim kurulu toplantısı hazırlığı', 'pending', 'medium', NOW() + INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Örnek maddi yardım kayıtları
INSERT INTO financial_transactions (type, category, amount, description, status) VALUES
('income', 'Bağış', 5000.00, 'Anonim bağış', 'completed'),
('expense', 'Gıda Yardımı', 1500.00, 'Aile yardımı', 'completed'),
('income', 'Üye Aidatı', 2000.00, 'Aylık üye aidatları', 'completed')
ON CONFLICT DO NOTHING;

-- =====================================================
-- KURULUM TAMAMLANDI
-- =====================================================

-- Kurulum durumunu kontrol et
SELECT 
  'Database setup completed successfully!' as status,
  COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
