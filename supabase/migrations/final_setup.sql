-- Final setup - Drop existing triggers and policies, then recreate everything

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP TRIGGER IF EXISTS update_beneficiaries_updated_at ON beneficiaries;
DROP TRIGGER IF EXISTS update_aid_records_updated_at ON aid_records;
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON financial_transactions;
DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
DROP TRIGGER IF EXISTS update_scholarships_updated_at ON scholarships;
DROP TRIGGER IF EXISTS update_hospital_referrals_updated_at ON hospital_referrals;
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;

-- Drop existing policies for all tables
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Anyone can view inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can manage inventory" ON inventory;
DROP POLICY IF EXISTS "Users can view assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Managers and admins can manage tasks" ON tasks;
DROP POLICY IF EXISTS "Anyone can view beneficiaries" ON beneficiaries;
DROP POLICY IF EXISTS "Authenticated users can manage beneficiaries" ON beneficiaries;
DROP POLICY IF EXISTS "Anyone can view aid records" ON aid_records;
DROP POLICY IF EXISTS "Authenticated users can manage aid records" ON aid_records;
DROP POLICY IF EXISTS "Anyone can view financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Authenticated users can manage financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Anyone can view donations" ON donations;
DROP POLICY IF EXISTS "Authenticated users can manage donations" ON donations;
DROP POLICY IF EXISTS "Anyone can view volunteers" ON volunteers;
DROP POLICY IF EXISTS "Authenticated users can manage volunteers" ON volunteers;
DROP POLICY IF EXISTS "Anyone can view meetings" ON meetings;
DROP POLICY IF EXISTS "Authenticated users can manage meetings" ON meetings;
DROP POLICY IF EXISTS "Anyone can view scholarships" ON scholarships;
DROP POLICY IF EXISTS "Authenticated users can manage scholarships" ON scholarships;
DROP POLICY IF EXISTS "Anyone can view hospital referrals" ON hospital_referrals;
DROP POLICY IF EXISTS "Authenticated users can manage hospital referrals" ON hospital_referrals;
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can view their sent messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages sent to them" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their sent messages" ON messages;
DROP POLICY IF EXISTS "Users can view their message recipients" ON message_recipients;
DROP POLICY IF EXISTS "Users can add message recipients" ON message_recipients;
DROP POLICY IF EXISTS "Users can update message recipients" ON message_recipients;
DROP POLICY IF EXISTS "Users can delete message recipients" ON message_recipients;

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

-- Create or replace trigger function for updated_at
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
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to anon and authenticated roles for all tables
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

GRANT SELECT ON inventory TO anon;
GRANT ALL PRIVILEGES ON inventory TO authenticated;

GRANT SELECT ON tasks TO anon;
GRANT ALL PRIVILEGES ON tasks TO authenticated;

GRANT SELECT ON beneficiaries TO anon;
GRANT ALL PRIVILEGES ON beneficiaries TO authenticated;

GRANT SELECT ON aid_records TO anon;
GRANT ALL PRIVILEGES ON aid_records TO authenticated;

GRANT SELECT ON financial_transactions TO anon;
GRANT ALL PRIVILEGES ON financial_transactions TO authenticated;

GRANT SELECT ON donations TO anon;
GRANT ALL PRIVILEGES ON donations TO authenticated;

GRANT SELECT ON volunteers TO anon;
GRANT ALL PRIVILEGES ON volunteers TO authenticated;

GRANT SELECT ON meetings TO anon;
GRANT ALL PRIVILEGES ON meetings TO authenticated;

GRANT SELECT ON messages TO anon;
GRANT ALL PRIVILEGES ON messages TO authenticated;

GRANT SELECT ON scholarships TO anon;
GRANT ALL PRIVILEGES ON scholarships TO authenticated;

GRANT SELECT ON hospital_referrals TO anon;
GRANT ALL PRIVILEGES ON hospital_referrals TO authenticated;

GRANT SELECT ON message_recipients TO anon;
GRANT ALL PRIVILEGES ON message_recipients TO authenticated;

GRANT SELECT ON message_folders TO anon;
GRANT ALL PRIVILEGES ON message_folders TO authenticated;

GRANT SELECT ON message_folder_assignments TO anon;
GRANT ALL PRIVILEGES ON message_folder_assignments TO authenticated;