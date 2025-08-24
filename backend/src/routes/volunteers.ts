import express from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all volunteers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', skills = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Skills filter
    if (skills) {
      whereClause += ` AND skills ILIKE $${paramIndex}`;
      queryParams.push(`%${skills}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM volunteers ${whereClause}`,
      queryParams
    );
    const totalVolunteers = parseInt((countResult.rows[0] as any).count);

    // Get volunteers with pagination
    const volunteersResult = await query(
      `SELECT id, first_name, last_name, email, phone, skills, status, availability, hours_contributed, created_at, updated_at
       FROM volunteers ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const volunteers = volunteersResult.rows.map((volunteer: any) => ({
      id: volunteer.id,
      firstName: volunteer.first_name,
      lastName: volunteer.last_name,
      email: volunteer.email,
      phone: volunteer.phone,
      skills: volunteer.skills,
      status: volunteer.status,
      availability: volunteer.availability,
      hoursContributed: volunteer.hours_contributed,
      createdAt: volunteer.created_at,
      updatedAt: volunteer.updated_at
    }));

    res.json({
      success: true,
      data: {
        volunteers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalVolunteers,
          totalPages: Math.ceil(totalVolunteers / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get volunteer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const volunteerResult = await query(
      `SELECT id, first_name, last_name, email, phone, skills, status, availability, hours_contributed, created_at, updated_at
       FROM volunteers WHERE id = $1`,
      [id]
    );

    if (volunteerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    const volunteer: any = volunteerResult.rows[0];

    res.json({
      success: true,
      data: {
        volunteer: {
          id: volunteer.id,
          firstName: volunteer.first_name,
          lastName: volunteer.last_name,
          email: volunteer.email,
          phone: volunteer.phone,
          skills: volunteer.skills,
          status: volunteer.status,
          availability: volunteer.availability,
          hoursContributed: volunteer.hours_contributed,
          createdAt: volunteer.created_at,
          updatedAt: volunteer.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new volunteer
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, skills, status, availability } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Check if volunteer already exists
    const existingVolunteer = await query(
      'SELECT id FROM volunteers WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingVolunteer.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer with this email already exists'
      });
    }

    // Create volunteer
    const volunteerId = uuidv4();
    await query(
      `INSERT INTO volunteers (id, first_name, last_name, email, phone, skills, status, availability, hours_contributed, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [volunteerId, firstName, lastName, email.toLowerCase(), phone || null, skills || null, status || 'pending', availability || null, 0]
    );

    res.status(201).json({
      success: true,
      message: 'Volunteer created successfully',
      data: {
        volunteer: {
          id: volunteerId,
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone,
          skills,
          status: status || 'pending',
          availability
        }
      }
    });
  } catch (error) {
    console.error('Create volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update volunteer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, skills, status, availability, hoursContributed } = req.body;

    // Check if volunteer exists
    const existingVolunteer = await query(
      'SELECT id FROM volunteers WHERE id = $1',
      [id]
    );

    if (existingVolunteer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'suspended'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Check if email is already used by another volunteer
    const emailCheck = await query(
      'SELECT id FROM volunteers WHERE email = $1 AND id != $2',
      [email.toLowerCase(), id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is already used by another volunteer'
      });
    }

    // Update volunteer
    await query(
      `UPDATE volunteers 
       SET first_name = $1, last_name = $2, email = $3, phone = $4, skills = $5, status = $6, availability = $7, hours_contributed = $8, updated_at = NOW()
       WHERE id = $9`,
      [firstName, lastName, email.toLowerCase(), phone, skills, status || 'pending', availability, hoursContributed || 0, id]
    );

    res.json({
      success: true,
      message: 'Volunteer updated successfully'
    });
  } catch (error) {
    console.error('Update volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete volunteer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if volunteer exists
    const existingVolunteer = await query(
      'SELECT id FROM volunteers WHERE id = $1',
      [id]
    );

    if (existingVolunteer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    // Delete volunteer
    await query('DELETE FROM volunteers WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    console.error('Delete volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;