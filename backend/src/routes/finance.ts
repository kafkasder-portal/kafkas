import express from 'express';
import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all financial transactions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type = '', category = '', status = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereClause += ` AND (description ILIKE $${paramIndex} OR reference ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
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

    // Status filter
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM financial_transactions ${whereClause}`,
      queryParams
    );
    const totalTransactions = parseInt((countResult.rows[0] as any).count);

    // Get transactions with pagination
    const transactionsResult = await query(
      `SELECT id, type, category, amount, description, reference, status, transaction_date, created_at, updated_at
       FROM financial_transactions ${whereClause}
       ORDER BY transaction_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, Number(limit), offset]
    );

    const transactions = transactionsResult.rows.map((transaction: any) => ({
      id: transaction.id,
      type: transaction.type,
      category: transaction.category,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      reference: transaction.reference,
      status: transaction.status,
      transactionDate: transaction.transaction_date,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    }));

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalTransactions,
          totalPages: Math.ceil(totalTransactions / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get financial transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transactionResult = await query(
      `SELECT id, type, category, amount, description, reference, status, transaction_date, created_at, updated_at
       FROM financial_transactions WHERE id = $1`,
      [id]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transaction: any = transactionResult.rows[0];

    res.json({
      success: true,
      data: {
        transaction: {
          id: transaction.id,
          type: transaction.type,
          category: transaction.category,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          reference: transaction.reference,
          status: transaction.status,
          transactionDate: transaction.transaction_date,
          createdAt: transaction.created_at,
          updatedAt: transaction.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, description, reference, status, transactionDate } = req.body;

    // Validation
    if (!type || !category || amount === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type, category, amount, and description are required'
      });
    }

    // Validate type
    const validTypes = ['income', 'expense'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Create transaction
    const transactionId = uuidv4();
    await query(
      `INSERT INTO financial_transactions (id, type, category, amount, description, reference, status, transaction_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [transactionId, type, category, amount, description, reference || null, status || 'pending', transactionDate || new Date().toISOString()]
    );

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transaction: {
          id: transactionId,
          type,
          category,
          amount,
          description,
          reference,
          status: status || 'pending',
          transactionDate: transactionDate || new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, description, reference, status, transactionDate } = req.body;

    // Check if transaction exists
    const existingTransaction = await query(
      'SELECT id FROM financial_transactions WHERE id = $1',
      [id]
    );

    if (existingTransaction.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Validation
    if (!type || !category || amount === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type, category, amount, and description are required'
      });
    }

    // Validate type
    const validTypes = ['income', 'expense'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Update transaction
    await query(
      `UPDATE financial_transactions 
       SET type = $1, category = $2, amount = $3, description = $4, reference = $5, status = $6, transaction_date = $7, updated_at = NOW()
       WHERE id = $8`,
      [type, category, amount, description, reference, status || 'pending', transactionDate, id]
    );

    res.json({
      success: true,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if transaction exists
    const existingTransaction = await query(
      'SELECT id FROM financial_transactions WHERE id = $1',
      [id]
    );

    if (existingTransaction.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Delete transaction
    await query('DELETE FROM financial_transactions WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get financial summary
router.get('/summary/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause = 'WHERE status = \'completed\'';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (startDate) {
      whereClause += ` AND transaction_date >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereClause += ` AND transaction_date <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    // Get income and expense totals
    const summaryResult = await query(
      `SELECT 
         type,
         SUM(amount) as total_amount,
         COUNT(*) as transaction_count
       FROM financial_transactions ${whereClause}
       GROUP BY type`,
      queryParams
    );

    const summary = {
      income: { total: 0, count: 0 },
      expense: { total: 0, count: 0 },
      balance: 0
    };

    summaryResult.rows.forEach((row: any) => {
      const amount = parseFloat(row.total_amount);
      const count = parseInt(row.transaction_count);
      
      if (row.type === 'income') {
        summary.income = { total: amount, count };
      } else if (row.type === 'expense') {
        summary.expense = { total: amount, count };
      }
    });

    summary.balance = summary.income.total - summary.expense.total;

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    console.error('Get financial summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;