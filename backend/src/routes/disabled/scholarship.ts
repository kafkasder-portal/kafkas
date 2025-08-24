import express from 'express';
import { supabase } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all scholarships
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', type = '', level = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR provider ILIKE $${paramIndex})`;
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

    // Level filter
    if (level) {
      whereClause += ` AND education_level = $${paramIndex}`;
      queryParams.push(level);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM scholarships ${whereClause}`,
      queryParams
    );
    const totalScholarships = parseInt((countResult.rows[0] as any).count);

    // Get scholarships with pagination
    const scholarshipsResult = await query(
      `SELECT id, name, description, type, education_level, amount, provider, requirements, 
              application_deadline, status, available_slots, applied_count, created_at, updated_at
       FROM scholarships ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const scholarships = scholarshipsResult.rows.map((scholarship: any) => ({
      id: scholarship.id,
      name: scholarship.name,
      description: scholarship.description,
      type: scholarship.type,
      educationLevel: scholarship.education_level,
      amount: scholarship.amount ? parseFloat(scholarship.amount) : null,
      provider: scholarship.provider,
      requirements: scholarship.requirements,
      applicationDeadline: scholarship.application_deadline,
      status: scholarship.status,
      availableSlots: scholarship.available_slots,
      appliedCount: scholarship.applied_count || 0,
      remainingSlots: scholarship.available_slots ? scholarship.available_slots - (scholarship.applied_count || 0) : null,
      createdAt: scholarship.created_at,
      updatedAt: scholarship.updated_at
    }));

    res.json({
      success: true,
      data: {
        scholarships,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalScholarships,
          totalPages: Math.ceil(totalScholarships / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get scholarship by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const scholarshipResult = await query(
      `SELECT id, name, description, type, education_level, amount, provider, requirements, 
              application_deadline, status, available_slots, applied_count, created_at, updated_at
       FROM scholarships WHERE id = $1`,
      [id]
    );

    if (scholarshipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    const scholarship: any = scholarshipResult.rows[0];

    res.json({
      success: true,
      data: {
        scholarship: {
          id: scholarship.id,
          name: scholarship.name,
          description: scholarship.description,
          type: scholarship.type,
          educationLevel: scholarship.education_level,
          amount: scholarship.amount ? parseFloat(scholarship.amount) : null,
          provider: scholarship.provider,
          requirements: scholarship.requirements,
          applicationDeadline: scholarship.application_deadline,
          status: scholarship.status,
          availableSlots: scholarship.available_slots,
          appliedCount: scholarship.applied_count || 0,
          remainingSlots: scholarship.available_slots ? scholarship.available_slots - (scholarship.applied_count || 0) : null,
          createdAt: scholarship.created_at,
          updatedAt: scholarship.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new scholarship
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      type, 
      educationLevel, 
      amount, 
      provider, 
      requirements, 
      applicationDeadline, 
      status, 
      availableSlots 
    } = req.body;

    // Validation
    if (!name || !description || !type || !educationLevel || !provider) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, type, education level, and provider are required'
      });
    }

    // Validate type
    const validTypes = ['merit', 'need_based', 'athletic', 'academic', 'minority', 'disability', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship type'
      });
    }

    // Validate education level
    const validLevels = ['elementary', 'middle_school', 'high_school', 'undergraduate', 'graduate', 'postgraduate', 'vocational'];
    if (!validLevels.includes(educationLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid education level'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'closed', 'draft'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate amount
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Validate available slots
    if (availableSlots !== undefined && (isNaN(availableSlots) || availableSlots <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Available slots must be a positive number'
      });
    }

    // Create scholarship
    const scholarshipId = uuidv4();
    await query(
      `INSERT INTO scholarships (id, name, description, type, education_level, amount, provider, requirements, 
                                application_deadline, status, available_slots, applied_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
      [
        scholarshipId, 
        name, 
        description, 
        type, 
        educationLevel, 
        amount || null, 
        provider, 
        requirements || null, 
        applicationDeadline || null, 
        status || 'active', 
        availableSlots || null, 
        0
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Scholarship created successfully',
      data: {
        scholarship: {
          id: scholarshipId,
          name,
          description,
          type,
          educationLevel,
          amount,
          provider,
          requirements,
          applicationDeadline,
          status: status || 'active',
          availableSlots,
          appliedCount: 0
        }
      }
    });
  } catch (error) {
    console.error('Create scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update scholarship
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      type, 
      educationLevel, 
      amount, 
      provider, 
      requirements, 
      applicationDeadline, 
      status, 
      availableSlots 
    } = req.body;

    // Check if scholarship exists
    const existingScholarship = await query(
      'SELECT id FROM scholarships WHERE id = $1',
      [id]
    );

    if (existingScholarship.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Validation
    if (!name || !description || !type || !educationLevel || !provider) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, type, education level, and provider are required'
      });
    }

    // Validate type
    const validTypes = ['merit', 'need_based', 'athletic', 'academic', 'minority', 'disability', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scholarship type'
      });
    }

    // Validate education level
    const validLevels = ['elementary', 'middle_school', 'high_school', 'undergraduate', 'graduate', 'postgraduate', 'vocational'];
    if (!validLevels.includes(educationLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid education level'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'closed', 'draft'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate amount
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Validate available slots
    if (availableSlots !== undefined && (isNaN(availableSlots) || availableSlots <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Available slots must be a positive number'
      });
    }

    // Update scholarship
    await query(
      `UPDATE scholarships 
       SET name = $1, description = $2, type = $3, education_level = $4, amount = $5, provider = $6, 
           requirements = $7, application_deadline = $8, status = $9, available_slots = $10, updated_at = NOW()
       WHERE id = $11`,
      [
        name, 
        description, 
        type, 
        educationLevel, 
        amount, 
        provider, 
        requirements, 
        applicationDeadline, 
        status || 'active', 
        availableSlots, 
        id
      ]
    );

    res.json({
      success: true,
      message: 'Scholarship updated successfully'
    });
  } catch (error) {
    console.error('Update scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete scholarship
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if scholarship exists
    const existingScholarship = await query(
      'SELECT id FROM scholarships WHERE id = $1',
      [id]
    );

    if (existingScholarship.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Delete scholarship
    await query('DELETE FROM scholarships WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Scholarship deleted successfully'
    });
  } catch (error) {
    console.error('Delete scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Apply for scholarship
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { applicantName, applicantEmail, applicantPhone, documents, personalStatement } = req.body;

    // Check if scholarship exists and is active
    const scholarshipResult = await query(
      'SELECT id, status, available_slots, applied_count FROM scholarships WHERE id = $1',
      [id]
    );

    if (scholarshipResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    const scholarship: any = scholarshipResult.rows[0];
    if (scholarship.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Scholarship is not active for applications'
      });
    }

    // Check if slots are available
    if (scholarship.available_slots && scholarship.applied_count >= scholarship.available_slots) {
      return res.status(400).json({
        success: false,
        message: 'No available slots for this scholarship'
      });
    }

    // Validation
    if (!applicantName || !applicantEmail) {
      return res.status(400).json({
        success: false,
        message: 'Applicant name and email are required'
      });
    }

    // Create application record (if scholarship_applications table exists)
    try {
      const applicationId = uuidv4();
      await query(
        `INSERT INTO scholarship_applications (id, scholarship_id, applicant_name, applicant_email, applicant_phone, 
                                              documents, personal_statement, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [applicationId, id, applicantName, applicantEmail, applicantPhone || null, documents || null, personalStatement || null, 'pending']
      );
    } catch (applicationError) {
      // If scholarship_applications table doesn't exist, continue without creating application record
      console.log('Scholarship applications table not found, skipping application record creation');
    }

    // Update applied count
    await query(
      'UPDATE scholarships SET applied_count = applied_count + 1, updated_at = NOW() WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        scholarshipId: id,
        applicantName,
        applicantEmail
      }
    });
  } catch (error) {
    console.error('Apply for scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get scholarship statistics
router.get('/statistics/overview', async (req, res) => {
  try {
    // Get scholarship statistics
    const statsResult = await query(
      `SELECT 
         status,
         COUNT(*) as count,
         SUM(amount) as total_amount,
         SUM(available_slots) as total_slots,
         SUM(applied_count) as total_applications
       FROM scholarships
       GROUP BY status`
    );

    const totalScholarshipsResult = await query('SELECT COUNT(*) as total FROM scholarships');
    const totalScholarships = parseInt((totalScholarshipsResult.rows[0] as any).total);

    const typeStatsResult = await query(
      `SELECT 
         type,
         COUNT(*) as count,
         AVG(amount) as avg_amount
       FROM scholarships
       WHERE amount IS NOT NULL
       GROUP BY type
       ORDER BY count DESC`
    );

    const levelStatsResult = await query(
      `SELECT 
         education_level,
         COUNT(*) as count
       FROM scholarships
       GROUP BY education_level
       ORDER BY count DESC`
    );

    const statistics: {
      totalScholarships: number;
      byStatus: { [key: string]: { count: number; totalAmount: number; totalSlots: number; totalApplications: number } };
      byType: { [key: string]: { count: number; averageAmount: number } };
      byEducationLevel: { [key: string]: number };
      totalAmount: number;
      totalSlots: number;
      totalApplications: number;
    } = {
      totalScholarships,
      byStatus: {},
      byType: {},
      byEducationLevel: {},
      totalAmount: 0,
      totalSlots: 0,
      totalApplications: 0
    };

    let totalAmount = 0;
    let totalSlots = 0;
    let totalApplications = 0;

    statsResult.rows.forEach((row: any) => {
      const amount = parseFloat(row.total_amount) || 0;
      const slots = parseInt(row.total_slots) || 0;
      const applications = parseInt(row.total_applications) || 0;
      
      statistics.byStatus[row.status] = {
        count: parseInt(row.count),
        totalAmount: amount,
        totalSlots: slots,
        totalApplications: applications
      };
      
      totalAmount += amount;
      totalSlots += slots;
      totalApplications += applications;
    });

    typeStatsResult.rows.forEach((row: any) => {
      statistics.byType[row.type] = {
        count: parseInt(row.count),
        averageAmount: parseFloat(row.avg_amount) || 0
      };
    });

    levelStatsResult.rows.forEach((row: any) => {
      statistics.byEducationLevel[row.education_level] = parseInt(row.count);
    });

    statistics.totalAmount = totalAmount;
    statistics.totalSlots = totalSlots;
    statistics.totalApplications = totalApplications;

    res.json({
      success: true,
      data: { statistics }
    });
  } catch (error) {
    console.error('Get scholarship statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;