-- Migration: 008_create_messages_table
-- Create messages table for messaging system

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'direct' CHECK (message_type IN ('direct', 'broadcast', 'announcement', 'notification', 'system')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'archived', 'deleted')),
    sender_id UUID REFERENCES users(id),
    parent_message_id UUID REFERENCES messages(id), -- For replies/threads
    thread_id UUID, -- To group related messages
    attachments JSONB DEFAULT '[]'::jsonb, -- Array of file attachments
    metadata JSONB DEFAULT '{}'::jsonb, -- Additional message metadata
    scheduled_at TIMESTAMP WITH TIME ZONE, -- For scheduled messages
    expires_at TIMESTAMP WITH TIME ZONE, -- Message expiration
    is_encrypted BOOLEAN DEFAULT false,
    read_receipt_requested BOOLEAN DEFAULT false,
    delivery_receipt_requested BOOLEAN DEFAULT false,
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message recipients table
CREATE TABLE IF NOT EXISTS message_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_type VARCHAR(20) DEFAULT 'to' CHECK (recipient_type IN ('to', 'cc', 'bcc')),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed', 'bounced')),
    read_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, recipient_id, recipient_type)
);

-- Create message folders table for organization
CREATE TABLE IF NOT EXISTS message_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    folder_type VARCHAR(20) DEFAULT 'custom' CHECK (folder_type IN ('inbox', 'sent', 'drafts', 'trash', 'archive', 'custom')),
    parent_folder_id UUID REFERENCES message_folders(id),
    color VARCHAR(7), -- Hex color code
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create message folder assignments
CREATE TABLE IF NOT EXISTS message_folder_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES message_folders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, folder_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON messages(priority);
CREATE INDEX IF NOT EXISTS idx_messages_parent_message_id ON messages(parent_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_scheduled_at ON messages(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_messages_expires_at ON messages(expires_at);
CREATE INDEX IF NOT EXISTS idx_messages_tags ON messages USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_message_recipients_message_id ON message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_recipient_id ON message_recipients(recipient_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_status ON message_recipients(status);
CREATE INDEX IF NOT EXISTS idx_message_recipients_read_at ON message_recipients(read_at);

CREATE INDEX IF NOT EXISTS idx_message_folders_user_id ON message_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_message_folders_folder_type ON message_folders(folder_type);
CREATE INDEX IF NOT EXISTS idx_message_folders_parent_folder_id ON message_folders(parent_folder_id);

CREATE INDEX IF NOT EXISTS idx_message_folder_assignments_message_id ON message_folder_assignments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_folder_assignments_folder_id ON message_folder_assignments(folder_id);
CREATE INDEX IF NOT EXISTS idx_message_folder_assignments_user_id ON message_folder_assignments(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_folders_updated_at
    BEFORE UPDATE ON message_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to set thread_id
CREATE OR REPLACE FUNCTION set_message_thread_id()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is a reply, use the parent's thread_id or parent's id as thread_id
    IF NEW.parent_message_id IS NOT NULL THEN
        SELECT COALESCE(thread_id, id) INTO NEW.thread_id
        FROM messages
        WHERE id = NEW.parent_message_id;
    ELSE
        -- If this is a new thread, use the message's own id
        NEW.thread_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_thread_id_trigger
    BEFORE INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION set_message_thread_id();

-- Create function to update read status
CREATE OR REPLACE FUNCTION update_message_read_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update read_at timestamp when status changes to read
    IF NEW.status = 'read' AND OLD.status != 'read' THEN
        NEW.read_at = NOW();
    END IF;
    
    -- Update delivered_at timestamp when status changes to delivered
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        NEW.delivered_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_read_status_trigger
    BEFORE UPDATE ON message_recipients
    FOR EACH ROW
    EXECUTE FUNCTION update_message_read_status();

-- Create function to create default folders for new users
CREATE OR REPLACE FUNCTION create_default_message_folders()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default folders for new user
    INSERT INTO message_folders (user_id, name, folder_type, sort_order) VALUES
    (NEW.id, 'Inbox', 'inbox', 1),
    (NEW.id, 'Sent', 'sent', 2),
    (NEW.id, 'Drafts', 'drafts', 3),
    (NEW.id, 'Archive', 'archive', 4),
    (NEW.id, 'Trash', 'trash', 5);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- This trigger would be created on the users table
-- CREATE TRIGGER create_user_message_folders_trigger
--     AFTER INSERT ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION create_default_message_folders();

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_folder_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view messages they sent" ON messages
    FOR SELECT USING (sender_id = auth.uid());

CREATE POLICY "Users can view messages sent to them" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM message_recipients mr
            WHERE mr.message_id = id AND mr.recipient_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all messages" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'manager', 'user')
        )
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (
        sender_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policies for message recipients
CREATE POLICY "Users can view recipients of their messages" ON message_recipients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND m.sender_id = auth.uid()
        ) OR
        recipient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Message senders can manage recipients" ON message_recipients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM messages m
            WHERE m.id = message_id AND m.sender_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Recipients can update their status" ON message_recipients
    FOR UPDATE USING (recipient_id = auth.uid());

-- Create policies for message folders
CREATE POLICY "Users can manage their own folders" ON message_folders
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all folders" ON message_folders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policies for folder assignments
CREATE POLICY "Users can manage their folder assignments" ON message_folder_assignments
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all folder assignments" ON message_folder_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_recipients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_folders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON message_folder_assignments TO authenticated;
GRANT SELECT ON messages TO anon;
GRANT SELECT ON message_recipients TO anon;
GRANT SELECT ON message_folders TO anon;
GRANT SELECT ON message_folder_assignments TO anon;