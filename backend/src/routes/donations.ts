import express from 'express';
import { query } from '../config/database';
// Auth middleware removed - using Supabase auth instead
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all donations
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      type = '', 
      status = '',
      startDate = '',
      endDate = '',
      minAmount = '',
      maxAmount = ''
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter (donor name, email, or description)
    if (search) {
      whereClause += ` AND (donor_name ILIKE $${paramIndex} OR donor_email ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Type filter
    if (type) {
      whereClause += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Date range filter
    if (startDate) {
      whereClause += ` AND donation_date >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereClause += ` AND donation_date <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    // Amount range filter
    if (minAmount) {
      whereClause += ` AND amount >= $${paramIndex}`;
      queryParams.push(Number(minAmount));
      paramIndex++;
    }

    if (maxAmount) {
      whereClause += ` AND amount <= $${paramIndex}`;
      queryParams.push(Number(maxAmount));
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM donations ${whereClause}`,
      queryParams
    );
    const totalDonations = parseInt(countResult.rows[0].count);

    // Get donations with pagination
    const donationsResult = await query(
      `SELECT id, donor_name, donor_email, donor_phone, amount, currency, type, status, 
              description, donation_date, receipt_number, payment_method, created_at, updated_at
       FROM donations ${whereClause}
       ORDER BY donation_date DESC, created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const donations = donationsResult.rows.map(donation => ({
      id: donation.id,
      donorName: donation.donor_name,
      donorEmail: donation.donor_email,
      donorPhone: donation.donor_phone,
      amount: parseFloat(donation.amount),
      currency: donation.currency,
      type: donation.type,
      status: donation.status,
      description: donation.description,
      donationDate: donation.donation_date,
      receiptNumber: donation.receipt_number,
      paymentMethod: donation.payment_method,
      createdAt: donation.created_at,
      updatedAt: donation.updated_at
    }));

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalDonations,
          totalPages: Math.ceil(totalDonations / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const donationResult = await query(
      `SELECT id, donor_name, donor_email, donor_phone, amount, currency, type, status,
              description, donation_date, receipt_number, payment_method, notes,
              created_at, updated_at, created_by
       FROM donations WHERE id = $1`,
      [id]
    );

    if (donationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    const donation = donationResult.rows[0];

    res.json({
      success: true,
      data: {
        donation: {
          id: donation.id,
          donorName: donation.donor_name,
          donorEmail: donation.donor_email,
          donorPhone: donation.donor_phone,
          amount: parseFloat(donation.amount),
          currency: donation.currency,
          type: donation.type,
          status: donation.status,
          description: donation.description,
          donationDate: donation.donation_date,
          receiptNumber: donation.receipt_number,
          paymentMethod: donation.payment_method,
          notes: donation.notes,
          createdAt: donation.created_at,
          updatedAt: donation.updated_at,
          createdBy: donation.created_by
        }
      }
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new donation
router.post('/', async (req, res) => {
  try {
    const {
      donorName,
      donorEmail,
      donorPhone,
      amount,
      currency = 'TRY',
      type,
      description,
      donationDate,
      paymentMethod,
      notes
    } = req.body;

    // Validation
    if (!donorName || !amount || !type || !donationDate || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: donorName, amount, type, donationDate, paymentMethod'
      });
    }

    // Validate donation type
    const validTypes = ['monetary', 'in_kind', 'service', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation type'
      });
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'bank_transfer', 'credit_card', 'check', 'online', 'other'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Generate receipt number
    const receiptNumber = `DN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create donation
    const donationId = uuidv4();
    await query(
      `INSERT INTO donations (
        id, donor_name, donor_email, donor_phone, amount, currency, type, status,
        description, donation_date, receipt_number, payment_method, notes,
        created_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), $14)`,
      [
        donationId, donorName, donorEmail, donorPhone, amount, currency, type, 'confirmed',
        description, donationDate, receiptNumber, paymentMethod, notes, null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: {
        donation: {
          id: donationId,
          donorName,
          donorEmail,
          donorPhone,
          amount: parseFloat(amount),
          currency,
          type,
          status: 'confirmed',
          description,
          donationDate,
          receiptNumber,
          paymentMethod,
          notes
        }
      }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update donation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      donorName,
      donorEmail,
      donorPhone,
      amount,
      currency,
      type,
      status,
      description,
      donationDate,
      paymentMethod,
      notes
    } = req.body;

    // Check if donation exists
    const existingDonation = await query(
      'SELECT id FROM donations WHERE id = $1',
      [id]
    );

    if (existingDonation.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Build update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (donorName !== undefined) {
      updateFields.push(`donor_name = $${paramIndex}`);
      updateValues.push(donorName);
      paramIndex++;
    }

    if (donorEmail !== undefined) {
      updateFields.push(`donor_email = $${paramIndex}`);
      updateValues.push(donorEmail);
      paramIndex++;
    }

    if (donorPhone !== undefined) {
      updateFields.push(`donor_phone = $${paramIndex}`);
      updateValues.push(donorPhone);
      paramIndex++;
    }

    if (amount !== undefined) {
      updateFields.push(`amount = $${paramIndex}`);
      updateValues.push(amount);
      paramIndex++;
    }

    if (currency !== undefined) {
      updateFields.push(`currency = $${paramIndex}`);
      updateValues.push(currency);
      paramIndex++;
    }

    if (type !== undefined) {
      const validTypes = ['monetary', 'in_kind', 'service', 'other'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid donation type'
        });
      }
      updateFields.push(`type = $${paramIndex}`);
      updateValues.push(type);
      paramIndex++;
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'refunded'];
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

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      updateValues.push(description);
      paramIndex++;
    }

    if (donationDate !== undefined) {
      updateFields.push(`donation_date = $${paramIndex}`);
      updateValues.push(donationDate);
      paramIndex++;
    }

    if (paymentMethod !== undefined) {
      const validPaymentMethods = ['cash', 'bank_transfer', 'credit_card', 'check', 'online', 'other'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method'
        });
      }
      updateFields.push(`payment_method = $${paramIndex}`);
      updateValues.push(paymentMethod);
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
      `UPDATE donations SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
      updateValues
    );

    // Get updated donation
    const updatedDonation = await query(
      `SELECT id, donor_name, donor_email, donor_phone, amount, currency, type, status,
              description, donation_date, receipt_number, payment_method, notes, updated_at
       FROM donations WHERE id = $1`,
      [id]
    );

    const donation = updatedDonation.rows[0];

    res.json({
      success: true,
      message: 'Donation updated successfully',
      data: {
        donation: {
          id: donation.id,
          donorName: donation.donor_name,
          donorEmail: donation.donor_email,
          donorPhone: donation.donor_phone,
          amount: parseFloat(donation.amount),
          currency: donation.currency,
          type: donation.type,
          status: donation.status,
          description: donation.description,
          donationDate: donation.donation_date,
          receiptNumber: donation.receipt_number,
          paymentMethod: donation.payment_method,
          notes: donation.notes,
          updatedAt: donation.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete donation (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if donation exists
    const existingDonation = await query(
      'SELECT id FROM donations WHERE id = $1',
      [id]
    );

    if (existingDonation.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Soft delete (mark as cancelled) instead of hard delete
    await query(
      'UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', id]
    );

    res.json({
      success: true,
      message: 'Donation cancelled successfully'
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get donation statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    const queryParams: any[] = [];
    
    if (startDate && endDate) {
      dateFilter = 'WHERE donation_date BETWEEN $1 AND $2';
      queryParams.push(startDate, endDate);
    }

    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_donations,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_donations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_donations,
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) as total_amount,
        COALESCE(AVG(CASE WHEN status = 'confirmed' THEN amount ELSE NULL END), 0) as average_amount,
        COUNT(CASE WHEN type = 'monetary' THEN 1 END) as monetary_donations,
        COUNT(CASE WHEN type = 'in_kind' THEN 1 END) as in_kind_donations,
        COUNT(CASE WHEN donation_date >= NOW() - INTERVAL '30 days' THEN 1 END) as donations_last_month
      FROM donations ${dateFilter}
    `, queryParams);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        totalDonations: parseInt(stats.total_donations),
        confirmedDonations: parseInt(stats.confirmed_donations),
        pendingDonations: parseInt(stats.pending_donations),
        totalAmount: parseFloat(stats.total_amount),
        averageAmount: parseFloat(stats.average_amount),
        typeDistribution: {
          monetary: parseInt(stats.monetary_donations),
          inKind: parseInt(stats.in_kind_donations)
        },
        donationsLastMonth: parseInt(stats.donations_last_month)
      }
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;