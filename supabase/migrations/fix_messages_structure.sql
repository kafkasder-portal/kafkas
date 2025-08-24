-- Fix messages table structure to match existing schema

-- Drop the existing messages table policies that reference recipient_id
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Create new policies that work with the existing message_recipients structure
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

-- Add policies for message_recipients table
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

CREATE POLICY "Users can update message recipients" ON message_recipients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM messages 
      WHERE id = message_recipients.message_id 
      AND sender_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete message recipients" ON message_recipients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM messages 
      WHERE id = message_recipients.message_id 
      AND sender_id = auth.uid()
    )
  );