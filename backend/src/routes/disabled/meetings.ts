import express from 'express';
import { supabase } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', type = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Type filter
    if (type) {
      whereClause += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM meetings ${whereClause}`,
      queryParams
    );
    const totalMeetings = parseInt((countResult.rows[0] as any).count);

    // Get meetings with pagination
    const meetingsResult = await query(
      `SELECT id, title, description, type, status, start_time, end_time, location, organizer, attendees, created_at, updated_at
       FROM meetings ${whereClause}
       ORDER BY start_time DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const meetings = meetingsResult.rows.map((meeting: any) => ({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      type: meeting.type,
      status: meeting.status,
      startTime: meeting.start_time,
      endTime: meeting.end_time,
      location: meeting.location,
      organizer: meeting.organizer,
      attendees: meeting.attendees,
      createdAt: meeting.created_at,
      updatedAt: meeting.updated_at
    }));

    res.json({
      success: true,
      data: {
        meetings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalMeetings,
          totalPages: Math.ceil(totalMeetings / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get meeting by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const meetingResult = await query(
      `SELECT id, title, description, type, status, start_time, end_time, location, organizer, attendees, created_at, updated_at
       FROM meetings WHERE id = $1`,
      [id]
    );

    if (meetingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const meeting: any = meetingResult.rows[0];

    res.json({
      success: true,
      data: {
        meeting: {
          id: meeting.id,
          title: meeting.title,
          description: meeting.description,
          type: meeting.type,
          status: meeting.status,
          startTime: meeting.start_time,
          endTime: meeting.end_time,
          location: meeting.location,
          organizer: meeting.organizer,
          attendees: meeting.attendees,
          createdAt: meeting.created_at,
          updatedAt: meeting.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new meeting
router.post('/', async (req, res) => {
  try {
    const { title, description, type, status, startTime, endTime, location, organizer, attendees } = req.body;

    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, and end time are required'
      });
    }

    // Validate status
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate type
    const validTypes = ['board', 'team', 'project', 'training', 'other'];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting type'
      });
    }

    // Validate time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Create meeting
    const meetingId = uuidv4();
    await query(
      `INSERT INTO meetings (id, title, description, type, status, start_time, end_time, location, organizer, attendees, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      [meetingId, title, description || null, type || 'other', status || 'scheduled', startTime, endTime, location || null, organizer || null, attendees || null]
    );

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      data: {
        meeting: {
          id: meetingId,
          title,
          description,
          type: type || 'other',
          status: status || 'scheduled',
          startTime,
          endTime,
          location,
          organizer,
          attendees
        }
      }
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update meeting
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, status, startTime, endTime, location, organizer, attendees } = req.body;

    // Check if meeting exists
    const existingMeeting = await query(
      'SELECT id FROM meetings WHERE id = $1',
      [id]
    );

    if (existingMeeting.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, and end time are required'
      });
    }

    // Validate status
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate type
    const validTypes = ['board', 'team', 'project', 'training', 'other'];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting type'
      });
    }

    // Validate time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Update meeting
    await query(
      `UPDATE meetings 
       SET title = $1, description = $2, type = $3, status = $4, start_time = $5, end_time = $6, location = $7, organizer = $8, attendees = $9, updated_at = NOW()
       WHERE id = $10`,
      [title, description, type || 'other', status || 'scheduled', startTime, endTime, location, organizer, attendees, id]
    );

    res.json({
      success: true,
      message: 'Meeting updated successfully'
    });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete meeting
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meeting exists
    const existingMeeting = await query(
      'SELECT id FROM meetings WHERE id = $1',
      [id]
    );

    if (existingMeeting.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    // Delete meeting
    await query('DELETE FROM meetings WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;