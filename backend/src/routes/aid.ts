import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://fagblbogumttcrsbletc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Get all aid records
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type = '', beneficiaryId = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let supabaseQuery = supabase
      .from('aid_records')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      supabaseQuery = supabaseQuery.or(`description.ilike.%${search}%`);
    }
    if (type) {
      supabaseQuery = supabaseQuery.eq('aid_type', type);
    }
    if (beneficiaryId) {
      supabaseQuery = supabaseQuery.eq('beneficiary_id', beneficiaryId);
    }

    const { data: aidRecords, error, count } = await supabaseQuery
      .order('aid_date', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const totalRecords = count || 0;

    const formattedRecords = aidRecords?.map((record: any) => ({
      id: record.id,
      beneficiaryId: record.beneficiary_id,
      aidType: record.aid_type,
      amount: record.amount ? parseFloat(record.amount) : null,
      description: record.description,
      aidDate: record.aid_date,
      createdAt: record.created_at,
      createdBy: record.created_by
    })) || [];

    res.json({
      success: true,
      data: {
        aidRecords: formattedRecords,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalRecords,
          totalPages: Math.ceil(totalRecords / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get aid records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get aid record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: record, error } = await supabase
      .from('aid_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !record) {
      return res.status(404).json({
        success: false,
        message: 'Aid record not found'
      });
    }

    res.json({
      success: true,
      data: {
        record: {
          id: record.id,
          beneficiaryId: record.beneficiary_id,
          aidType: record.aid_type,
          amount: record.amount ? parseFloat(record.amount) : null,
          description: record.description,
          aidDate: record.aid_date,
          createdAt: record.created_at,
          createdBy: record.created_by
        }
      }
    });
  } catch (error) {
    console.error('Get aid record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new aid record
router.post('/', async (req, res) => {
  try {
    const { beneficiaryId, aidType, amount, description, aidDate } = req.body;

    if (!beneficiaryId || !aidType) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary ID and aid type are required'
      });
    }

    const newRecord = {
      id: uuidv4(),
      beneficiary_id: beneficiaryId,
      aid_type: aidType,
      amount: amount ? parseFloat(amount) : null,
      description: description || '',
      aid_date: aidDate || new Date().toISOString(),
      created_at: new Date().toISOString(),
      created_by: (req as any).user?.id || 'system'
    };

    const { error } = await supabase
      .from('aid_records')
      .insert([newRecord]);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create aid record'
      });
    }

    res.status(201).json({
      success: true,
      data: {
        record: {
          id: newRecord.id,
          beneficiaryId: newRecord.beneficiary_id,
          aidType: newRecord.aid_type,
          amount: newRecord.amount,
          description: newRecord.description,
          aidDate: newRecord.aid_date,
          createdAt: newRecord.created_at,
          createdBy: newRecord.created_by
        }
      },
      message: 'Aid record created successfully'
    });
  } catch (error) {
    console.error('Create aid record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update aid record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { beneficiaryId, aidType, amount, description, aidDate } = req.body;

    const { data: existingRecord, error: checkError } = await supabase
      .from('aid_records')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Aid record not found'
      });
    }

    const updateData = {
      beneficiary_id: beneficiaryId || existingRecord.beneficiary_id,
      aid_type: aidType || existingRecord.aid_type,
      amount: amount !== undefined ? parseFloat(amount) : existingRecord.amount,
      description: description !== undefined ? description : existingRecord.description,
      aid_date: aidDate || existingRecord.aid_date
    };

    const { error: updateError } = await supabase
      .from('aid_records')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Database error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update aid record'
      });
    }

    res.json({
      success: true,
      data: {
        record: {
          id,
          beneficiaryId: updateData.beneficiary_id,
          aidType: updateData.aid_type,
          amount: updateData.amount,
          description: updateData.description,
          aidDate: updateData.aid_date,
          createdAt: existingRecord.created_at,
          createdBy: existingRecord.created_by
        }
      },
      message: 'Aid record updated successfully'
    });
  } catch (error) {
    console.error('Update aid record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete aid record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error: deleteError } = await supabase
      .from('aid_records')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete aid record'
      });
    }

    res.json({
      success: true,
      message: 'Aid record deleted successfully'
    });
  } catch (error) {
    console.error('Delete aid record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;