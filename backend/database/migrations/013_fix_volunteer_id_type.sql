-- Migration: 013_fix_volunteer_id_type
-- Fix volunteer_id column type from VARCHAR to UUID

-- Drop the existing volunteer_id column if it exists and recreate as UUID
ALTER TABLE volunteers DROP COLUMN IF EXISTS volunteer_id;
ALTER TABLE volunteers ADD COLUMN volunteer_id UUID UNIQUE DEFAULT gen_random_uuid();

-- Create index for the new volunteer_id column
CREATE INDEX IF NOT EXISTS idx_volunteers_volunteer_id ON volunteers(volunteer_id);