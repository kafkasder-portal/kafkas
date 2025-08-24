'use strict';
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const supabase_js_1 = require('@supabase/supabase-js');
const uuid_1 = require('uuid');
const router = express_1.default.Router();
// Supabase client
const supabaseUrl =
  process.env.SUPABASE_URL || 'https://fagblbogumttcrsbletc.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Get all financial transactions
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      category = '',
      status = '',
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let supabaseQuery = supabase
      .from('financial_transactions')
      .select('*', { count: 'exact' });
    // Apply filters
    if (search) {
      supabaseQuery = supabaseQuery.or(
        `description.ilike.%${search}%,reference.ilike.%${search}%`
      );
    }
    if (type) {
      supabaseQuery = supabaseQuery.eq('type', type);
    }
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }
    const {
      data: transactions,
      error,
      count,
    } = await supabaseQuery
      .order('transaction_date', { ascending: false })
      .range(offset, offset + Number(limit) - 1);
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const totalTransactions = count || 0;
    const formattedTransactions =
      transactions?.map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        category: transaction.category,
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        reference: transaction.reference,
        status: transaction.status,
        transactionDate: transaction.transaction_date,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      })) || [];
    res.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalTransactions,
          totalPages: Math.ceil(totalTransactions / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get financial transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: transaction, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    res.json({
      success: true,
      data: {
        id: transaction.id,
        type: transaction.type,
        category: transaction.category,
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        reference: transaction.reference,
        status: transaction.status,
        transactionDate: transaction.transaction_date,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      },
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Create new transaction
router.post('/', async (req, res) => {
  try {
    const {
      type,
      category,
      amount,
      description,
      reference,
      status = 'pending',
      transactionDate,
    } = req.body;
    // Validate required fields
    if (!type || !category || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type, category, amount, and description are required',
      });
    }
    const newTransaction = {
      id: (0, uuid_1.v4)(),
      type,
      category,
      amount: amount.toString(),
      description,
      reference: reference || null,
      status,
      transaction_date: transactionDate || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([newTransaction])
      .select()
      .single();
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({
      success: true,
      data: {
        id: data.id,
        type: data.type,
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description,
        reference: data.reference,
        status: data.status,
        transactionDate: data.transaction_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      category,
      amount,
      description,
      reference,
      status,
      transactionDate,
    } = req.body;
    // Check if transaction exists
    const { data: existingTransaction, error: checkError } = await supabase
      .from('financial_transactions')
      .select('id')
      .eq('id', id)
      .single();
    if (checkError || !existingTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    const updateData = {
      updated_at: new Date().toISOString(),
    };
    if (type) updateData.type = type;
    if (category) updateData.category = category;
    if (amount) updateData.amount = amount.toString();
    if (description) updateData.description = description;
    if (reference !== undefined) updateData.reference = reference;
    if (status) updateData.status = status;
    if (transactionDate) updateData.transaction_date = transactionDate;
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({
      success: true,
      data: {
        id: data.id,
        type: data.type,
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description,
        reference: data.reference,
        status: data.status,
        transactionDate: data.transaction_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if transaction exists
    const { data: existingTransaction, error: checkError } = await supabase
      .from('financial_transactions')
      .select('id')
      .eq('id', id)
      .single();
    if (checkError || !existingTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Get financial summary
router.get('/summary/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let supabaseQuery = supabase
      .from('financial_transactions')
      .select('type, amount, status');
    if (startDate) {
      supabaseQuery = supabaseQuery.gte('transaction_date', startDate);
    }
    if (endDate) {
      supabaseQuery = supabaseQuery.lte('transaction_date', endDate);
    }
    const { data: transactions, error } = await supabaseQuery;
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      pendingTransactions: 0,
      completedTransactions: 0,
      cancelledTransactions: 0,
    };
    transactions?.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        summary.totalIncome += amount;
      } else if (transaction.type === 'expense') {
        summary.totalExpense += amount;
      }
      if (transaction.status === 'pending') {
        summary.pendingTransactions++;
      } else if (transaction.status === 'completed') {
        summary.completedTransactions++;
      } else if (transaction.status === 'cancelled') {
        summary.cancelledTransactions++;
      }
    });
    const netBalance = summary.totalIncome - summary.totalExpense;
    res.json({
      success: true,
      data: {
        ...summary,
        netBalance,
        totalTransactions: transactions?.length || 0,
      },
    });
  } catch (error) {
    console.error('Get financial summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
exports.default = router;
//# sourceMappingURL=finance.js.map
