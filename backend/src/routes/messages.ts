import express from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', sender = '', recipient = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (subject ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Sender filter
    if (sender) {
      whereClause += ` AND sender_id = $${paramIndex}`;
      queryParams.push(sender);
      paramIndex++;
    }

    // Recipient filter
    if (recipient) {
      whereClause += ` AND recipient_id = $${paramIndex}`;
      queryParams.push(recipient);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM messages ${whereClause}`,
      queryParams
    );
    const totalMessages = parseInt((countResult.rows[0] as any).count);

    // Get messages with pagination
    const messagesResult = await query(
      `SELECT id, sender_id, recipient_id, subject, content, status, priority, sent_at, read_at, created_at, updated_at
       FROM messages ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const messages = messagesResult.rows.map((message: any) => ({
      id: message.id,
      senderId: message.sender_id,
      recipientId: message.recipient_id,
      subject: message.subject,
      content: message.content,
      status: message.status,
      priority: message.priority,
      sentAt: message.sent_at,
      readAt: message.read_at,
      createdAt: message.created_at,
      updatedAt: message.updated_at
    }));

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalMessages,
          totalPages: Math.ceil(totalMessages / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get message by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const messageResult = await query(
      `SELECT id, sender_id, recipient_id, subject, content, status, priority, sent_at, read_at, created_at, updated_at
       FROM messages WHERE id = $1`,
      [id]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const message: any = messageResult.rows[0];

    res.json({
      success: true,
      data: {
        message: {
          id: message.id,
          senderId: message.sender_id,
          recipientId: message.recipient_id,
          subject: message.subject,
          content: message.content,
          status: message.status,
          priority: message.priority,
          sentAt: message.sent_at,
          readAt: message.read_at,
          createdAt: message.created_at,
          updatedAt: message.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new message
router.post('/', async (req, res) => {
  try {
    const { senderId, recipientId, subject, content, priority } = req.body;

    // Validation
    if (!senderId || !recipientId || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID, recipient ID, subject, and content are required'
      });
    }

    // Validate priority
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority'
      });
    }

    // Create message
    const messageId = uuidv4();
    await query(
      `INSERT INTO messages (id, sender_id, recipient_id, subject, content, status, priority, sent_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())`,
      [messageId, senderId, recipientId, subject, content, 'sent', priority || 'normal']
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: {
          id: messageId,
          senderId,
          recipientId,
          subject,
          content,
          status: 'sent',
          priority: priority || 'normal'
        }
      }
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update message (mark as read, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, readAt } = req.body;

    // Check if message exists
    const existingMessage = await query(
      'SELECT id FROM messages WHERE id = $1',
      [id]
    );

    if (existingMessage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Validate status
    const validStatuses = ['sent', 'delivered', 'read', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Update message
    let updateQuery = 'UPDATE messages SET updated_at = NOW()';
    const updateParams: any[] = [];
    let paramIndex = 1;

    if (status) {
      updateQuery += `, status = $${paramIndex}`;
      updateParams.push(status);
      paramIndex++;
    }

    if (readAt || status === 'read') {
      updateQuery += `, read_at = $${paramIndex}`;
      updateParams.push(readAt || new Date().toISOString());
      paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex}`;
    updateParams.push(id);

    await query(updateQuery, updateParams);

    res.json({
      success: true,
      message: 'Message updated successfully'
    });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const existingMessage = await query(
      'SELECT id FROM messages WHERE id = $1',
      [id]
    );

    if (existingMessage.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Delete message
    await query('DELETE FROM messages WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get messages for a specific user (inbox)
router.get('/user/:userId/inbox', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE recipient_id = $1';
    const queryParams: any[] = [userId];
    let paramIndex = 2;

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM messages ${whereClause}`,
      queryParams
    );
    const totalMessages = parseInt((countResult.rows[0] as any).count);

    // Get messages with pagination
    const messagesResult = await query(
      `SELECT id, sender_id, recipient_id, subject, content, status, priority, sent_at, read_at, created_at
       FROM messages ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const messages = messagesResult.rows.map((message: any) => ({
      id: message.id,
      senderId: message.sender_id,
      recipientId: message.recipient_id,
      subject: message.subject,
      content: message.content,
      status: message.status,
      priority: message.priority,
      sentAt: message.sent_at,
      readAt: message.read_at,
      createdAt: message.created_at
    }));

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalMessages,
          totalPages: Math.ceil(totalMessages / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get user inbox error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;