"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
// Auth middleware removed - using Supabase auth instead
const uuid_1 = require("uuid");
const router = express_1.default.Router();
// Get all users (admin and manager only)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = 'WHERE 1=1';
        const queryParams = [];
        let paramIndex = 1;
        // Search filter
        if (search) {
            whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }
        // Role filter
        if (role) {
            whereClause += ` AND role = $${paramIndex}`;
            queryParams.push(role);
            paramIndex++;
        }
        // Status filter
        if (status) {
            const isActive = status === 'active';
            whereClause += ` AND is_active = $${paramIndex}`;
            queryParams.push(isActive);
            paramIndex++;
        }
        // Get total count
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM users ${whereClause}`, queryParams);
        const totalUsers = parseInt(countResult.rows[0].count);
        // Get users with pagination
        const usersResult = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, is_active, created_at, last_login
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...queryParams, Number(limit), offset]);
        const users = usersResult.rows.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            isActive: user.is_active,
            createdAt: user.created_at,
            lastLogin: user.last_login
        }));
        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalUsers,
                    totalPages: Math.ceil(totalUsers / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userResult = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, is_active, created_at, last_login, updated_at
       FROM users WHERE id = $1`, [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const user = userResult.rows[0];
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                    isActive: user.is_active,
                    createdAt: user.created_at,
                    lastLogin: user.last_login,
                    updatedAt: user.updated_at
                }
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Create new user (admin only)
router.post('/', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        // Validation
        if (!email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Validate role
        const validRoles = ['admin', 'manager', 'coordinator', 'volunteer', 'viewer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }
        // Check if user already exists
        const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user
        const userId = (0, uuid_1.v4)();
        await (0, database_1.query)(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), true)`, [userId, email.toLowerCase(), passwordHash, firstName, lastName, role]);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: {
                    id: userId,
                    email: email.toLowerCase(),
                    firstName,
                    lastName,
                    role
                }
            }
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Update user (admin and manager)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, role, isActive } = req.body;
        // Check if user exists
        const existingUser = await (0, database_1.query)('SELECT id, role FROM users WHERE id = $1', [id]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Prevent updating admin users (simplified check)
        if (existingUser.rows[0].role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot update admin user'
            });
        }
        // Build update query
        const updateFields = [];
        const updateValues = [];
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
        if (role !== undefined) {
            const validRoles = ['admin', 'manager', 'coordinator', 'volunteer', 'viewer'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role'
                });
            }
            updateFields.push(`role = $${paramIndex}`);
            updateValues.push(role);
            paramIndex++;
        }
        if (isActive !== undefined) {
            updateFields.push(`is_active = $${paramIndex}`);
            updateValues.push(isActive);
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
        await (0, database_1.query)(`UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`, updateValues);
        // Get updated user
        const updatedUser = await (0, database_1.query)(`SELECT id, email, first_name, last_name, role, is_active, updated_at
       FROM users WHERE id = $1`, [id]);
        const user = updatedUser.rows[0];
        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                    isActive: user.is_active,
                    updatedAt: user.updated_at
                }
            }
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Delete user (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if user exists
        const existingUser = await (0, database_1.query)('SELECT id, role FROM users WHERE id = $1', [id]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Prevent deleting admin users
        if (existingUser.rows[0].role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin user'
            });
        }
        // Self-deletion check removed for Supabase integration
        // Soft delete (deactivate) instead of hard delete
        await (0, database_1.query)('UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1', [id]);
        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Get user statistics (admin and manager)
router.get('/stats/overview', async (req, res) => {
    try {
        const statsResult = await (0, database_1.query)(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
        COUNT(CASE WHEN role = 'manager' THEN 1 END) as manager_count,
        COUNT(CASE WHEN role = 'coordinator' THEN 1 END) as coordinator_count,
        COUNT(CASE WHEN role = 'volunteer' THEN 1 END) as volunteer_count,
        COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewer_count,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_last_month
      FROM users
    `);
        const stats = statsResult.rows[0];
        res.json({
            success: true,
            data: {
                totalUsers: parseInt(stats.total_users),
                activeUsers: parseInt(stats.active_users),
                inactiveUsers: parseInt(stats.total_users) - parseInt(stats.active_users),
                roleDistribution: {
                    admin: parseInt(stats.admin_count),
                    manager: parseInt(stats.manager_count),
                    coordinator: parseInt(stats.coordinator_count),
                    volunteer: parseInt(stats.volunteer_count),
                    viewer: parseInt(stats.viewer_count)
                },
                newUsersLastMonth: parseInt(stats.new_users_last_month)
            }
        });
    }
    catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map