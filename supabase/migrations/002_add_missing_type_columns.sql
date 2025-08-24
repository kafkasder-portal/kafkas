-- Add missing 'type' columns to tables that need them

-- Add type column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'individual' CHECK (type IN ('individual', 'organization', 'volunteer', 'staff'));

-- Add type column to inventory table
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'medical', 'food', 'clothing', 'equipment'));

-- Add type column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'administrative', 'field_work', 'meeting', 'project'));

-- Add type column to beneficiaries table
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'individual' CHECK (type IN ('individual', 'family', 'organization', 'community'));

-- Add type column to aid_records table
ALTER TABLE aid_records ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'direct' CHECK (type IN ('direct', 'indirect', 'emergency', 'regular'));

-- Add type column to volunteers table
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'specialist', 'coordinator', 'field_worker'));

-- Add type column to meetings table
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'board', 'committee', 'volunteer', 'training'));

-- Add type column to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'notification', 'announcement', 'urgent'));

-- Add type column to scholarships table
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'academic' CHECK (type IN ('academic', 'vocational', 'special_needs', 'merit_based'));

-- Add type column to hospital_referrals table
ALTER TABLE hospital_referrals ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'emergency', 'specialist', 'follow_up'));

-- Update existing records with default values
UPDATE users SET type = 'individual' WHERE type IS NULL;
UPDATE inventory SET type = 'general' WHERE type IS NULL;
UPDATE tasks SET type = 'general' WHERE type IS NULL;
UPDATE beneficiaries SET type = 'individual' WHERE type IS NULL;
UPDATE aid_records SET type = 'direct' WHERE type IS NULL;
UPDATE volunteers SET type = 'general' WHERE type IS NULL;
UPDATE meetings SET type = 'general' WHERE type IS NULL;
UPDATE messages SET type = 'general' WHERE type IS NULL;
UPDATE scholarships SET type = 'academic' WHERE type IS NULL;
UPDATE hospital_referrals SET type = 'general' WHERE type IS NULL;

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Create indexes for the new type columns
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory(type);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_type ON beneficiaries(type);
CREATE INDEX IF NOT EXISTS idx_aid_records_type ON aid_records(type);
CREATE INDEX IF NOT EXISTS idx_volunteers_type ON volunteers(type);
CREATE INDEX IF NOT EXISTS idx_meetings_type ON meetings(type);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);
CREATE INDEX IF NOT EXISTS idx_scholarships_type ON scholarships(type);
CREATE INDEX IF NOT EXISTS idx_hospital_referrals_type ON hospital_referrals(type);

SELECT 'Missing type columns added successfully!' as result;