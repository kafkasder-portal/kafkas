-- Clean existing policies and recreate the complete setup

-- Drop existing policies for messages table
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can view their sent messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages sent to them" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their sent messages" ON messages;

-- Drop existing policies for message_recipients table if they exist
DROP POLICY IF EXISTS "Users can view their message recipients" ON message_recipients;
DROP POLICY IF EXISTS "Users can add message recipients" ON message_recipients;
DROP POLICY IF EXISTS "Users can update message recipients" ON message_recipients;
DROP POLICY IF EXISTS "Users can delete message recipients" ON message_recipients;

-- Create tables that might be missing (with IF NOT EXISTS)

-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(50) DEFAULT 'volunteer' CHECK (role IN ('admin', 'manager', 'volunteer', 'donor')),
  type VARCHAR(50) DEFAULT 'individual' CHECK (type IN ('individual', 'organization', 'government', 'ngo')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory tablosu
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity INTEGER DEFAULT 0,
  unit VARCHAR(50),
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('food', 'clothing', 'medical', 'educational', 'general')),
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'distributed', 'expired')),
  expiry_date DATE,
  location VARCHAR(255),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks tablosu
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('administrative', 'field_work', 'fundraising', 'general')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beneficiaries tablosu
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  family_size INTEGER,
  type VARCHAR(50) DEFAULT 'individual' CHECK (type IN ('individual', 'family', 'group', 'community')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aid records tablosu
CREATE TABLE IF NOT EXISTS aid_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID REFERENCES beneficiaries(id),
  aid_type VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'direct' CHECK (type IN ('direct', 'indirect', 'emergency', 'regular')),
  amount DECIMAL(10,2),
  description TEXT,
  aid_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions tablosu
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) DEFAULT 'income' CHECK (type IN ('income', 'expense')),
  category VARCHAR(100),
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations tablosu
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  donor_phone VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) DEFAULT 'monetary' CHECK (type IN ('monetary', 'in_kind', 'service', 'other')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'received')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers tablosu
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skills TEXT,
  availability VARCHAR(255),
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('field_worker', 'coordinator', 'specialist', 'general')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings tablosu
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('board', 'team', 'training', 'general')),
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  organizer_id UUID REFERENCES users(id),
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
  type VARCHAR(50) DEFAULT 'academic' CHECK (type IN ('academic', 'need_based', 'merit_based', 'special')),
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
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('emergency', 'routine', 'specialist', 'general')),
  referral_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory(type);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_created_by ON inventory(created_by);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_beneficiaries_type ON beneficiaries(type);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_created_by ON beneficiaries(created_by);

CREATE INDEX IF NOT EXISTS idx_aid_records_beneficiary_id ON aid_records(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_aid_records_type ON aid_records(type);
CREATE INDEX IF NOT EXISTS idx_aid_records_aid_type ON aid_records(aid_type);
CREATE INDEX IF NOT EXISTS idx_aid_records_aid_date ON aid_records(aid_date);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_transaction_date ON financial_transactions(transaction_date);

CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(type);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
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

-- Inventory policies
CREATE POLICY "Anyone can view inventory" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage inventory" ON inventory
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Tasks policies
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

-- Beneficiaries policies
CREATE POLICY "Anyone can view beneficiaries" ON beneficiaries
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage beneficiaries" ON beneficiaries
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Aid records policies
CREATE POLICY "Anyone can view aid records" ON aid_records
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage aid records" ON aid_records
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Financial transactions policies
CREATE POLICY "Anyone can view financial transactions" ON financial_transactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage financial transactions" ON financial_transactions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Donations policies
CREATE POLICY "Anyone can view donations" ON donations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage donations" ON donations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Volunteers policies
CREATE POLICY "Anyone can view volunteers" ON volunteers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage volunteers" ON volunteers
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Meetings policies
CREATE POLICY "Anyone can view meetings" ON meetings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage meetings" ON meetings
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Scholarships policies
CREATE POLICY "Anyone can view scholarships" ON scholarships
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage scholarships" ON scholarships
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Hospital referrals policies
CREATE POLICY "Anyone can view hospital referrals" ON hospital_referrals
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage hospital referrals" ON hospital_referrals
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Messages policies (working with existing message_recipients structure)
CREATE POLICY "Users can view their sent messages" ON messages
  FOR SELECT USING (sender_id = auth.uid());

CREATE POLICY "Users can view messages sent to them" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM message_recipients 
      WHERE message_id = messages.id 
      AND recipient_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their sent messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their sent messages" ON messages
  FOR DELETE USING (sender_id = auth.uid());

-- Message recipients policies
CREATE POLICY "Users can view their message recipients" ON message_recipients
  FOR SELECT USING (
    recipient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM messages 
      WHERE id = message_recipients.message_id 
      AND sender_id = auth.uid()
    )
  );

CREATE POLICY "Users can add message recipients" ON message_recipients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages 
      WHERE id = message_recipients.message_id 
      AND sender_id = auth.uid()
    )
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aid_records_updated_at BEFORE UPDATE ON aid_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospital_referrals_updated_at BEFORE UPDATE ON hospital_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (email, full_name, role, type) VALUES
('admin@kaf.org', 'KAF Admin', 'admin', 'individual'),
('manager@kaf.org', 'KAF Manager', 'manager', 'individual'),
('volunteer@kaf.org', 'KAF Volunteer', 'volunteer', 'individual')
ON CONFLICT (email) DO NOTHING;

INSERT INTO inventory (item_name, category, quantity, unit, type, status) VALUES
('Rice', 'Food', 100, 'kg', 'food', 'available'),
('Blankets', 'Clothing', 50, 'pieces', 'clothing', 'available'),
('First Aid Kit', 'Medical', 20, 'pieces', 'medical', 'available')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, type, status, priority) VALUES
('Organize food distribution', 'Coordinate weekly food distribution to beneficiaries', 'field_work', 'pending', 'high'),
('Update donor database', 'Update contact information for all donors', 'administrative', 'in_progress', 'medium'),
('Plan fundraising event', 'Organize annual charity dinner', 'fundraising', 'pending', 'high')
ON CONFLICT DO NOTHING;

INSERT INTO financial_transactions (amount, type, category, description) VALUES
(5000.00, 'income', 'Donations', 'Monthly donations received'),
(1500.00, 'expense', 'Food Purchase', 'Rice and essential food items'),
(800.00, 'expense', 'Transportation', 'Vehicle fuel and maintenance')
ON CONFLICT DO NOTHING;