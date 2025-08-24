-- Migration: 006_create_volunteers_table
-- Add missing columns to existing volunteers table

-- Add missing columns if they don't exist
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS volunteer_id UUID UNIQUE DEFAULT gen_random_uuid();
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS education_level VARCHAR(100);
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS languages TEXT[];
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255);
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(100);
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS background_check_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS background_check_date DATE;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS training_completed BOOLEAN DEFAULT false;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS training_completion_date DATE;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS volunteer_hours DECIMAL(8,2) DEFAULT 0.00;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Update constraints
ALTER TABLE volunteers DROP CONSTRAINT IF EXISTS volunteers_background_check_status_check;
ALTER TABLE volunteers ADD CONSTRAINT volunteers_background_check_status_check CHECK (background_check_status IN ('pending', 'approved', 'rejected', 'expired'));

ALTER TABLE volunteers DROP CONSTRAINT IF EXISTS volunteers_status_check;
ALTER TABLE volunteers ADD CONSTRAINT volunteers_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'pending_approval'));

-- Update availability column type if needed
ALTER TABLE volunteers ALTER COLUMN availability TYPE JSONB USING availability::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_volunteer_id ON volunteers(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_skills ON volunteers USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_volunteers_languages ON volunteers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_volunteers_background_check_status ON volunteers(background_check_status);
CREATE INDEX IF NOT EXISTS idx_volunteers_join_date ON volunteers(join_date);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at);

-- Trigger already exists, skipping creation

-- Skip volunteer ID generation function and trigger as they may conflict with existing data

-- Create volunteer activity log table
CREATE TABLE IF NOT EXISTS volunteer_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    hours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    activity_date DATE NOT NULL,
    supervisor_id UUID REFERENCES users(id),
    verified BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for volunteer activities
CREATE INDEX IF NOT EXISTS idx_volunteer_activities_volunteer_id ON volunteer_activities(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_activities_activity_date ON volunteer_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_volunteer_activities_activity_type ON volunteer_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_volunteer_activities_verified ON volunteer_activities(verified);

-- Create trigger for volunteer activities updated_at
DROP TRIGGER IF EXISTS update_volunteer_activities_updated_at ON volunteer_activities;
CREATE TRIGGER update_volunteer_activities_updated_at
    BEFORE UPDATE ON volunteer_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update total volunteer hours
CREATE OR REPLACE FUNCTION update_volunteer_hours()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total hours for the volunteer
    UPDATE volunteers 
    SET volunteer_hours = (
        SELECT COALESCE(SUM(hours), 0) 
        FROM volunteer_activities 
        WHERE volunteer_id = COALESCE(NEW.volunteer_id, OLD.volunteer_id) 
        AND verified = true
    )
    WHERE id = COALESCE(NEW.volunteer_id, OLD.volunteer_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_volunteer_hours_trigger ON volunteer_activities;
CREATE TRIGGER update_volunteer_hours_trigger
    AFTER INSERT OR UPDATE OR DELETE ON volunteer_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_volunteer_hours();

-- Enable RLS
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for volunteers
CREATE POLICY "Users can view their own volunteer profile" ON volunteers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own volunteer profile" ON volunteers
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins and managers can view all volunteers" ON volunteers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins and managers can manage volunteers" ON volunteers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Create policies for volunteer activities
CREATE POLICY "Volunteers can view their own activities" ON volunteer_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM volunteers v
            WHERE v.id = volunteer_activities.volunteer_id AND v.user_id = auth.uid()
        )
    );

CREATE POLICY "Volunteers can insert their own activities" ON volunteer_activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM volunteers v
            WHERE v.id = volunteer_activities.volunteer_id AND v.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins and managers can manage all activities" ON volunteer_activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON volunteers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON volunteer_activities TO authenticated;
GRANT SELECT ON volunteers TO anon;
GRANT SELECT ON volunteer_activities TO anon;