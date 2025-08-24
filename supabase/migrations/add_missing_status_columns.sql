-- Add missing status columns to tables that don't have them

-- Add status column to aid_records table
ALTER TABLE aid_records 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'completed', 'cancelled', 'rejected'));

-- Add status column to users table (for account status)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' 
CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification', 'banned'));

-- Update existing records to have default status if null
UPDATE aid_records SET status = 'pending' WHERE status IS NULL;
UPDATE users SET status = 'active' WHERE status IS NULL;

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE ON aid_records TO anon;
GRANT SELECT, INSERT, UPDATE ON aid_records TO authenticated;
GRANT ALL PRIVILEGES ON aid_records TO authenticated;

GRANT SELECT ON users TO anon;
GRANT SELECT, UPDATE ON users TO authenticated;
GRANT ALL PRIVILEGES ON users TO authenticated;

-- Create indexes for better performance on status columns
CREATE INDEX IF NOT EXISTS idx_aid_records_status ON aid_records(status);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_hospital_referrals_status ON hospital_referrals(status);

-- Add comments to explain status columns
COMMENT ON COLUMN aid_records.status IS 'Status of the aid record: pending, approved, completed, cancelled, rejected';
COMMENT ON COLUMN users.status IS 'Account status: active, inactive, suspended, pending_verification, banned';