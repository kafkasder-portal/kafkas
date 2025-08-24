// =====================================================
// VERCEL SERVERLESS FUNCTION - USERS API
// =====================================================

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        // Get all users
        const { data: users, error: getError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (getError) throw getError;

        res.status(200).json({
          success: true,
          data: users,
          count: users.length
        });
        break;
      }

      case 'POST': {
        // Create new user
        const { email, password_hash, first_name, last_name, role, status } = req.body;

        if (!email || !password_hash || !first_name || !last_name) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields'
          });
        }

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{
            email,
            password_hash,
            first_name,
            last_name,
            role: role || 'user',
            status: status || 'active'
          }])
          .select()
          .single();

        if (createError) throw createError;

        res.status(201).json({
          success: true,
          data: newUser
        });
        break;
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Users API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
