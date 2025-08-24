import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Supabase client
const supabaseUrl =
  process.env.SUPABASE_URL || 'https://fagblbogumttcrsbletc.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Build Supabase query
    let supabaseQuery = supabase
      .from('inventory')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    // Apply pagination and ordering
    const {
      data: items,
      error,
      count,
    } = await supabaseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const totalItems = count || 0;

    const formattedItems =
      items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        status: item.status,
        location: item.location,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) || [];

    res.json({
      success: true,
      data: {
        items: formattedItems,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalItems,
          totalPages: Math.ceil(totalItems / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get inventory items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    res.json({
      success: true,
      data: {
        item: {
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          status: item.status,
          location: item.location,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create new inventory item
router.post('/', async (req, res) => {
  try {
    const { name, description, category, quantity, unit, status, location } =
      req.body;

    // Validate required fields
    if (!name || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and quantity are required',
      });
    }

    const newItem = {
      id: uuidv4(),
      name,
      description: description || '',
      category,
      quantity: Number(quantity),
      unit: unit || 'piece',
      status: status || 'active',
      location: location || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('inventory').insert([newItem]);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create inventory item',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        item: {
          id: newItem.id,
          name: newItem.name,
          description: newItem.description,
          category: newItem.category,
          quantity: newItem.quantity,
          unit: newItem.unit,
          status: newItem.status,
          location: newItem.location,
          createdAt: newItem.created_at,
          updatedAt: newItem.updated_at,
        },
      },
      message: 'Inventory item created successfully',
    });
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, quantity, unit, status, location } =
      req.body;

    // Check if item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    const updateData = {
      name: name || existingItem.name,
      description:
        description !== undefined ? description : existingItem.description,
      category: category || existingItem.category,
      quantity:
        quantity !== undefined ? Number(quantity) : existingItem.quantity,
      unit: unit || existingItem.unit,
      status: status || existingItem.status,
      location: location !== undefined ? location : existingItem.location,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Database error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update inventory item',
      });
    }

    res.json({
      success: true,
      data: {
        item: {
          id,
          ...updateData,
        },
      },
      message: 'Inventory item updated successfully',
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error: deleteError } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete inventory item',
      });
    }

    res.json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
