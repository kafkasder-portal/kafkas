'use strict';
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const database_1 = require('../config/database');
const uuid_1 = require('uuid');
const router = express_1.default.Router();
// Get all users
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let supabaseQuery = database_1.supabase
      .from('users')
      .select('*', { count: 'exact' });
    // Apply filters
    if (search) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }
    if (role) {
      supabaseQuery = supabaseQuery.eq('role', role);
    }
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }
    const {
      data: users,
      error,
      count,
    } = await supabaseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const totalUsers = count || 0;
    const formattedUsers =
      users?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        address: user.address,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })) || [];
    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: user, error } = await database_1.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          address: user.address,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = {
      id: (0, uuid_1.v4)(),
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: 'active',
      phone: phone || null,
      address: address || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await database_1.supabase.from('users').insert([newUser]);
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
      });
    }
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          phone: newUser.phone,
          address: newUser.address,
          createdAt: newUser.created_at,
          updatedAt: newUser.updated_at,
        },
      },
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, phone, address } = req.body;
    const { data: existingUser, error: checkError } = await database_1.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (checkError || !existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    const updateData = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      role: role || existingUser.role,
      status: status || existingUser.status,
      phone: phone !== undefined ? phone : existingUser.phone,
      address: address !== undefined ? address : existingUser.address,
      updated_at: new Date().toISOString(),
    };
    const { error: updateError } = await database_1.supabase
      .from('users')
      .update(updateData)
      .eq('id', id);
    if (updateError) {
      console.error('Database error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
      });
    }
    res.json({
      success: true,
      data: {
        user: {
          id,
          ...updateData,
        },
      },
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error: deleteError } = await database_1.supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.error('Database error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
      });
    }
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Kafkas Derneği Portal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});
exports.default = router;
//# sourceMappingURL=users.js.map
