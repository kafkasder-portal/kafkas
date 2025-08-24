-- Migration: 007_create_meetings_table
-- Create meetings table for meeting management

CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50) DEFAULT 'general' CHECK (meeting_type IN ('general', 'board', 'committee', 'training', 'planning', 'review')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    virtual_meeting_url TEXT,
    meeting_platform VARCHAR(50), -- Zoom, Teams, Google Meet, etc.
    organizer_id UUID REFERENCES users(id) NOT NULL,
    max_participants INTEGER,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB, -- JSON object for recurrence rules
    agenda JSONB DEFAULT '[]'::jsonb, -- Array of agenda items
    minutes TEXT,
    action_items JSONB DEFAULT '[]'::jsonb, -- Array of action items
    attachments JSONB DEFAULT '[]'::jsonb, -- Array of file attachments
    recording_url TEXT,
    is_public BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_meeting_time CHECK (end_time > start_time)
);

-- Create meeting participants table
CREATE TABLE IF NOT EXISTS meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('organizer', 'presenter', 'participant', 'observer')),
    status VARCHAR(20) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'tentative', 'attended', 'no_show')),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(meeting_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_title ON meetings(title);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_type ON meetings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_end_time ON meetings(end_time);
CREATE INDEX IF NOT EXISTS idx_meetings_is_public ON meetings(is_public);
CREATE INDEX IF NOT EXISTS idx_meetings_tags ON meetings USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at);

CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user_id ON meeting_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_status ON meeting_participants(status);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_role ON meeting_participants(role);

-- Create trigger for updated_at
CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update meeting status
CREATE OR REPLACE FUNCTION update_meeting_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-complete meetings that have passed their end time
    IF NEW.end_time < NOW() AND NEW.status = 'scheduled' THEN
        NEW.status = 'completed';
    END IF;
    
    -- Auto-start meetings that are currently happening
    IF NEW.start_time <= NOW() AND NEW.end_time > NOW() AND NEW.status = 'scheduled' THEN
        NEW.status = 'in_progress';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER meeting_status_trigger
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_meeting_status();

-- Create function to handle participant attendance
CREATE OR REPLACE FUNCTION update_participant_attendance()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark as attended if joined_at is set and meeting has started
    IF NEW.joined_at IS NOT NULL AND OLD.joined_at IS NULL THEN
        NEW.status = 'attended';
    END IF;
    
    -- Set responded_at when status changes from invited
    IF NEW.status != 'invited' AND OLD.status = 'invited' AND NEW.responded_at IS NULL THEN
        NEW.responded_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER participant_attendance_trigger
    BEFORE UPDATE ON meeting_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_participant_attendance();

-- Create function to auto-add organizer as participant
CREATE OR REPLACE FUNCTION add_organizer_as_participant()
RETURNS TRIGGER AS $$
BEGIN
    -- Add organizer as participant with organizer role
    INSERT INTO meeting_participants (meeting_id, user_id, role, status)
    VALUES (NEW.id, NEW.organizer_id, 'organizer', 'accepted')
    ON CONFLICT (meeting_id, user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER add_organizer_participant_trigger
    AFTER INSERT ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION add_organizer_as_participant();

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings
CREATE POLICY "Public meetings are viewable by all" ON meetings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Meeting participants can view meetings" ON meetings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meeting_participants mp
            WHERE mp.meeting_id = id AND mp.user_id = auth.uid()
        ) OR
        organizer_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create meetings" ON meetings
    FOR INSERT WITH CHECK (
        organizer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Organizers can update their meetings" ON meetings
    FOR UPDATE USING (
        organizer_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Organizers and admins can delete meetings" ON meetings
    FOR DELETE USING (
        organizer_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Create policies for meeting participants
CREATE POLICY "Participants can view meeting participants" ON meeting_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meetings m
            WHERE m.id = meeting_id AND (
                m.organizer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM meeting_participants mp2
                    WHERE mp2.meeting_id = meeting_id AND mp2.user_id = auth.uid()
                ) OR
                m.is_public = true OR
                EXISTS (
                    SELECT 1 FROM users
                    WHERE id = auth.uid() AND role IN ('admin', 'manager')
                )
            )
        )
    );

CREATE POLICY "Meeting organizers can manage participants" ON meeting_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM meetings m
            WHERE m.id = meeting_id AND (
                m.organizer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users
                    WHERE id = auth.uid() AND role IN ('admin', 'manager')
                )
            )
        )
    );

CREATE POLICY "Users can update their own participation" ON meeting_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON meetings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meeting_participants TO authenticated;
GRANT SELECT ON meetings TO anon;
GRANT SELECT ON meeting_participants TO anon;