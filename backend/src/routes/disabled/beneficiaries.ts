import express from 'express';
import { supabase } from '../config/database';
// Auth middleware removed - using Supabase auth instead
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all beneficiaries
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = '',
      category = '',
      urgency = '',
      region = ''
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter (name, phone, or address)
    if (search) {
      whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR address ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Category filter
    if (category) {
      whereClause += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    // Urgency filter
    if (urgency) {
      whereClause += ` AND urgency = $${paramIndex}`;
      queryParams.push(urgency);
      paramIndex++;
    }

    // Region filter
    if (region) {
      whereClause += ` AND region = $${paramIndex}`;
      queryParams.push(region);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM beneficiaries ${whereClause}`,
      queryParams
    );
    const totalBeneficiaries = parseInt(countResult.rows[0].count);

    // Get beneficiaries with pagination
    const beneficiariesResult = await query(
      `SELECT id, first_name, last_name, phone, email, address, region, category, 
              status, urgency, family_size, monthly_income, description, 
              registration_date, created_at, updated_at
       FROM beneficiaries ${whereClause}
       ORDER BY 
         CASE urgency 
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END,
         registration_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const beneficiaries = beneficiariesResult.rows.map(beneficiary => ({
      id: beneficiary.id,
      firstName: beneficiary.first_name,
      lastName: beneficiary.last_name,
      phone: beneficiary.phone,
      email: beneficiary.email,
      address: beneficiary.address,
      region: beneficiary.region,
      category: beneficiary.category,
      status: beneficiary.status,
      urgency: beneficiary.urgency,
      familySize: beneficiary.family_size,
      monthlyIncome: beneficiary.monthly_income ? parseFloat(beneficiary.monthly_income) : null,
      description: beneficiary.description,
      registrationDate: beneficiary.registration_date,
      createdAt: beneficiary.created_at,
      updatedAt: beneficiary.updated_at
    }));

    res.json({
      success: true,
      data: {
        beneficiaries,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalBeneficiaries,
          totalPages: Math.ceil(totalBeneficiaries / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get beneficiary by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const beneficiaryResult = await query(
      `SELECT id, first_name, last_name, phone, email, address, region, category,
              status, urgency, family_size, monthly_income, description, notes,
              registration_date, created_at, updated_at, created_by
       FROM beneficiaries WHERE id = $1`,
      [id]
    );

    if (beneficiaryResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    const beneficiary = beneficiaryResult.rows[0];

    // Get aid history for this beneficiary
    const aidHistoryResult = await query(
      `SELECT id, aid_type, amount, description, aid_date, created_at
       FROM aid_records WHERE beneficiary_id = $1
       ORDER BY aid_date DESC
       LIMIT 10`,
      [id]
    );

    const aidHistory = aidHistoryResult.rows.map(aid => ({
      id: aid.id,
      aidType: aid.aid_type,
      amount: aid.amount ? parseFloat(aid.amount) : null,
      description: aid.description,
      aidDate: aid.aid_date,
      createdAt: aid.created_at
    }));

    res.json({
      success: true,
      data: {
        beneficiary: {
          id: beneficiary.id,
          firstName: beneficiary.first_name,
          lastName: beneficiary.last_name,
          phone: beneficiary.phone,
          email: beneficiary.email,
          address: beneficiary.address,
          region: beneficiary.region,
          category: beneficiary.category,
          status: beneficiary.status,
          urgency: beneficiary.urgency,
          familySize: beneficiary.family_size,
          monthlyIncome: beneficiary.monthly_income ? parseFloat(beneficiary.monthly_income) : null,
          description: beneficiary.description,
          notes: beneficiary.notes,
          registrationDate: beneficiary.registration_date,
          createdAt: beneficiary.created_at,
          updatedAt: beneficiary.updated_at,
          createdBy: beneficiary.created_by,
          aidHistory
        }
      }
    });
  } catch (error) {
    console.error('Get beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new beneficiary
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      region,
      category,
      urgency = 'medium',
      familySize,
      monthlyIncome,
      description,
      notes,
      registrationDate
    } = req.body;

    // Validation
    if (!firstName || !lastName || !phone || !address || !region || !category) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: firstName, lastName, phone, address, region, category'
      });
    }

    // Validate category
    const validCategories = ['family', 'elderly', 'disabled', 'orphan', 'refugee', 'student', 'medical', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Validate urgency
    const validUrgencies = ['low', 'medium', 'high', 'critical'];
    if (!validUrgencies.includes(urgency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid urgency level'
      });
    }

    // Create beneficiary
    const beneficiaryId = uuidv4();
    await query(
      `INSERT INTO beneficiaries (
        id, first_name, last_name, phone, email, address, region, category,
        status, urgency, family_size, monthly_income, description, notes,
        registration_date, created_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), $16)`,
      [
        beneficiaryId, firstName, lastName, phone, email, address, region, category,
        'active', urgency, familySize, monthlyIncome, description, notes,
        registrationDate || new Date().toISOString().split('T')[0], null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Beneficiary created successfully',
      data: {
        beneficiary: {
          id: beneficiaryId,
          firstName,
          lastName,
          phone,
          email,
          address,
          region,
          category,
          status: 'active',
          urgency,
          familySize,
          monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
          description,
          notes,
          registrationDate: registrationDate || new Date().toISOString().split('T')[0]
        }
      }
    });
  } catch (error) {
    console.error('Create beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update beneficiary
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      region,
      category,
      status,
      urgency,
      familySize,
      monthlyIncome,
      description,
      notes
    } = req.body;

    // Check if beneficiary exists
    const existingBeneficiary = await query(
      'SELECT id FROM beneficiaries WHERE id = $1',
      [id]
    );

    if (existingBeneficiary.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // Build update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (firstName !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`);
      updateValues.push(firstName);
      paramIndex++;
    }

    if (lastName !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`);
      updateValues.push(lastName);
      paramIndex++;
    }

    if (phone !== undefined) {
      updateFields.push(`phone = $${paramIndex}`);
      updateValues.push(phone);
      paramIndex++;
    }

    if (email !== undefined) {
      updateFields.push(`email = $${paramIndex}`);
      updateValues.push(email);
      paramIndex++;
    }

    if (address !== undefined) {
      updateFields.push(`address = $${paramIndex}`);
      updateValues.push(address);
      paramIndex++;
    }

    if (region !== undefined) {
      updateFields.push(`region = $${paramIndex}`);
      updateValues.push(region);
      paramIndex++;
    }

    if (category !== undefined) {
      const validCategories = ['family', 'elderly', 'disabled', 'orphan', 'refugee', 'student', 'medical', 'other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
      updateFields.push(`category = $${paramIndex}`);
      updateValues.push(category);
      paramIndex++;
    }

    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'completed', 'suspended'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      updateFields.push(`status = $${paramIndex}`);
      updateValues.push(status);
      paramIndex++;
    }

    if (urgency !== undefined) {
      const validUrgencies = ['low', 'medium', 'high', 'critical'];
      if (!validUrgencies.includes(urgency)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid urgency level'
        });
      }
      updateFields.push(`urgency = $${paramIndex}`);
      updateValues.push(urgency);
      paramIndex++;
    }

    if (familySize !== undefined) {
      updateFields.push(`family_size = $${paramIndex}`);
      updateValues.push(familySize);
      paramIndex++;
    }

    if (monthlyIncome !== undefined) {
      updateFields.push(`monthly_income = $${paramIndex}`);
      updateValues.push(monthlyIncome);
      paramIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      updateValues.push(description);
      paramIndex++;
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${paramIndex}`);
      updateValues.push(notes);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    await query(
      `UPDATE beneficiaries SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
      updateValues
    );

    // Get updated beneficiary
    const updatedBeneficiary = await query(
      `SELECT id, first_name, last_name, phone, email, address, region, category,
              status, urgency, family_size, monthly_income, description, notes, updated_at
       FROM beneficiaries WHERE id = $1`,
      [id]
    );

    const beneficiary = updatedBeneficiary.rows[0];

    res.json({
      success: true,
      message: 'Beneficiary updated successfully',
      data: {
        beneficiary: {
          id: beneficiary.id,
          firstName: beneficiary.first_name,
          lastName: beneficiary.last_name,
          phone: beneficiary.phone,
          email: beneficiary.email,
          address: beneficiary.address,
          region: beneficiary.region,
          category: beneficiary.category,
          status: beneficiary.status,
          urgency: beneficiary.urgency,
          familySize: beneficiary.family_size,
          monthlyIncome: beneficiary.monthly_income ? parseFloat(beneficiary.monthly_income) : null,
          description: beneficiary.description,
          notes: beneficiary.notes,
          updatedAt: beneficiary.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Update beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete beneficiary (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if beneficiary exists
    const existingBeneficiary = await query(
      'SELECT id FROM beneficiaries WHERE id = $1',
      [id]
    );

    if (existingBeneficiary.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // Soft delete (mark as inactive) instead of hard delete
    await query(
      'UPDATE beneficiaries SET status = $1, updated_at = NOW() WHERE id = $2',
      ['inactive', id]
    );

    res.json({
      success: true,
      message: 'Beneficiary deactivated successfully'
    });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add aid record for beneficiary
router.post('/:id/aid', async (req, res) => {
  try {
    const { id } = req.params;
    const { aidType, amount, description, aidDate } = req.body;

    // Validation
    if (!aidType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Aid type and description are required'
      });
    }

    // Check if beneficiary exists
    const existingBeneficiary = await query(
      'SELECT id FROM beneficiaries WHERE id = $1',
      [id]
    );

    if (existingBeneficiary.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // Create aid record
    const aidId = uuidv4();
    await query(
      `INSERT INTO aid_records (id, beneficiary_id, aid_type, amount, description, aid_date, created_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
      [aidId, id, aidType, amount, description, aidDate || new Date().toISOString().split('T')[0], null]
    );

    res.status(201).json({
      success: true,
      message: 'Aid record added successfully',
      data: {
        aidRecord: {
          id: aidId,
          beneficiaryId: id,
          aidType,
          amount: amount ? parseFloat(amount) : null,
          description,
          aidDate: aidDate || new Date().toISOString().split('T')[0]
        }
      }
    });
  } catch (error) {
    console.error('Add aid record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get beneficiary statistics
router.get('/stats', async (req, res) => {
  try {
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_beneficiaries,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_beneficiaries,
        COUNT(CASE WHEN urgency = 'critical' THEN 1 END) as critical_cases,
        COUNT(CASE WHEN urgency = 'high' THEN 1 END) as high_priority_cases,
        COUNT(CASE WHEN category = 'family' THEN 1 END) as family_cases,
        COUNT(CASE WHEN category = 'elderly' THEN 1 END) as elderly_cases,
        COUNT(CASE WHEN category = 'medical' THEN 1 END) as medical_cases,
        COUNT(CASE WHEN registration_date >= NOW() - INTERVAL '30 days' THEN 1 END) as new_beneficiaries_last_month,
        COALESCE(AVG(family_size), 0) as average_family_size
      FROM beneficiaries
    `);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        totalBeneficiaries: parseInt(stats.total_beneficiaries),
        activeBeneficiaries: parseInt(stats.active_beneficiaries),
        criticalCases: parseInt(stats.critical_cases),
        highPriorityCases: parseInt(stats.high_priority_cases),
        categoryDistribution: {
          family: parseInt(stats.family_cases),
          elderly: parseInt(stats.elderly_cases),
          medical: parseInt(stats.medical_cases)
        },
        newBeneficiariesLastMonth: parseInt(stats.new_beneficiaries_last_month),
        averageFamilySize: parseFloat(stats.average_family_size)
      }
    });
  } catch (error) {
    console.error('Get beneficiary stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;