import express from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all funds
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', type = '', category = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
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

    // Category filter
    if (category) {
      whereClause += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM funds ${whereClause}`,
      queryParams
    );
    const totalFunds = parseInt((countResult.rows[0] as any).count);

    // Get funds with pagination
    const fundsResult = await query(
      `SELECT id, name, description, type, category, target_amount, current_amount, status, start_date, end_date, created_at, updated_at
       FROM funds ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const funds = fundsResult.rows.map((fund: any) => ({
      id: fund.id,
      name: fund.name,
      description: fund.description,
      type: fund.type,
      category: fund.category,
      targetAmount: parseFloat(fund.target_amount),
      currentAmount: parseFloat(fund.current_amount),
      status: fund.status,
      startDate: fund.start_date,
      endDate: fund.end_date,
      progress: fund.target_amount > 0 ? (parseFloat(fund.current_amount) / parseFloat(fund.target_amount)) * 100 : 0,
      createdAt: fund.created_at,
      updatedAt: fund.updated_at
    }));

    res.json({
      success: true,
      data: {
        funds,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalFunds,
          totalPages: Math.ceil(totalFunds / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fund by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const fundResult = await query(
      `SELECT id, name, description, type, category, target_amount, current_amount, status, start_date, end_date, created_at, updated_at
       FROM funds WHERE id = $1`,
      [id]
    );

    if (fundResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fund not found'
      });
    }

    const fund: any = fundResult.rows[0];

    res.json({
      success: true,
      data: {
        fund: {
          id: fund.id,
          name: fund.name,
          description: fund.description,
          type: fund.type,
          category: fund.category,
          targetAmount: parseFloat(fund.target_amount),
          currentAmount: parseFloat(fund.current_amount),
          status: fund.status,
          startDate: fund.start_date,
          endDate: fund.end_date,
          progress: fund.target_amount > 0 ? (parseFloat(fund.current_amount) / parseFloat(fund.target_amount)) * 100 : 0,
          createdAt: fund.created_at,
          updatedAt: fund.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get fund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new fund
router.post('/', async (req, res) => {
  try {
    const { name, description, type, category, targetAmount, status, startDate, endDate } = req.body;

    // Validation
    if (!name || !description || !type || !category || targetAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, type, category, and target amount are required'
      });
    }

    // Validate type
    const validTypes = ['emergency', 'project', 'campaign', 'scholarship', 'medical', 'education', 'infrastructure'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fund type'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate target amount
    if (isNaN(targetAmount) || targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be a positive number'
      });
    }

    // Create fund
    const fundId = uuidv4();
    await query(
      `INSERT INTO funds (id, name, description, type, category, target_amount, current_amount, status, start_date, end_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      [fundId, name, description, type, category, targetAmount, 0, status || 'active', startDate || new Date().toISOString(), endDate || null]
    );

    res.status(201).json({
      success: true,
      message: 'Fund created successfully',
      data: {
        fund: {
          id: fundId,
          name,
          description,
          type,
          category,
          targetAmount,
          currentAmount: 0,
          status: status || 'active',
          startDate: startDate || new Date().toISOString(),
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Create fund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update fund
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, category, targetAmount, currentAmount, status, startDate, endDate } = req.body;

    // Check if fund exists
    const existingFund = await query(
      'SELECT id FROM funds WHERE id = $1',
      [id]
    );

    if (existingFund.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fund not found'
      });
    }

    // Validation
    if (!name || !description || !type || !category || targetAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, type, category, and target amount are required'
      });
    }

    // Validate type
    const validTypes = ['emergency', 'project', 'campaign', 'scholarship', 'medical', 'education', 'infrastructure'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fund type'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate amounts
    if (isNaN(targetAmount) || targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be a positive number'
      });
    }

    if (currentAmount !== undefined && (isNaN(currentAmount) || currentAmount < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Current amount must be a non-negative number'
      });
    }

    // Update fund
    await query(
      `UPDATE funds 
       SET name = $1, description = $2, type = $3, category = $4, target_amount = $5, current_amount = $6, status = $7, start_date = $8, end_date = $9, updated_at = NOW()
       WHERE id = $10`,
      [name, description, type, category, targetAmount, currentAmount || 0, status || 'active', startDate, endDate, id]
    );

    res.json({
      success: true,
      message: 'Fund updated successfully'
    });
  } catch (error) {
    console.error('Update fund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete fund
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if fund exists
    const existingFund = await query(
      'SELECT id FROM funds WHERE id = $1',
      [id]
    );

    if (existingFund.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fund not found'
      });
    }

    // Delete fund
    await query('DELETE FROM funds WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Fund deleted successfully'
    });
  } catch (error) {
    console.error('Delete fund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add donation to fund
router.post('/:id/donate', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, donorName, donorEmail, message } = req.body;

    // Validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid donation amount is required'
      });
    }

    // Check if fund exists and is active
    const fundResult = await query(
      'SELECT id, current_amount, status FROM funds WHERE id = $1',
      [id]
    );

    if (fundResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fund not found'
      });
    }

    const fund: any = fundResult.rows[0];
    if (fund.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Fund is not active for donations'
      });
    }

    // Update fund current amount
    const newCurrentAmount = parseFloat(fund.current_amount) + parseFloat(amount);
    await query(
      'UPDATE funds SET current_amount = $1, updated_at = NOW() WHERE id = $2',
      [newCurrentAmount, id]
    );

    // Create donation record (if donations table exists)
    try {
      const donationId = uuidv4();
      await query(
        `INSERT INTO donations (id, fund_id, amount, donor_name, donor_email, message, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [donationId, id, amount, donorName || 'Anonymous', donorEmail || null, message || null, 'completed']
      );
    } catch (donationError) {
      // If donations table doesn't exist, continue without creating donation record
      console.log('Donations table not found, skipping donation record creation');
    }

    res.json({
      success: true,
      message: 'Donation added successfully',
      data: {
        newCurrentAmount,
        donationAmount: amount
      }
    });
  } catch (error) {
    console.error('Add donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fund statistics
router.get('/statistics/overview', async (req, res) => {
  try {
    // Get fund statistics
    const statsResult = await query(
      `SELECT 
         status,
         COUNT(*) as count,
         SUM(target_amount) as total_target,
         SUM(current_amount) as total_raised
       FROM funds
       GROUP BY status`
    );

    const totalFundsResult = await query('SELECT COUNT(*) as total FROM funds');
    const totalFunds = parseInt((totalFundsResult.rows[0] as any).total);

    const statistics: {
      totalFunds: number;
      byStatus: { [key: string]: { count: number; totalTarget: number; totalRaised: number } };
      totalTargetAmount: number;
      totalRaisedAmount: number;
      overallProgress: number;
    } = {
      totalFunds,
      byStatus: {},
      totalTargetAmount: 0,
      totalRaisedAmount: 0,
      overallProgress: 0
    };

    let totalTarget = 0;
    let totalRaised = 0;

    statsResult.rows.forEach((row: any) => {
      const target = parseFloat(row.total_target) || 0;
      const raised = parseFloat(row.total_raised) || 0;
      
      statistics.byStatus[row.status] = {
        count: parseInt(row.count),
        totalTarget: target,
        totalRaised: raised
      };
      
      totalTarget += target;
      totalRaised += raised;
    });

    statistics.totalTargetAmount = totalTarget;
    statistics.totalRaisedAmount = totalRaised;
    statistics.overallProgress = totalTarget > 0 ? (totalRaised / totalTarget) * 100 : 0;

    res.json({
      success: true,
      data: { statistics }
    });
  } catch (error) {
    console.error('Get fund statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;