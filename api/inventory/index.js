// =====================================================
// VERCEL SERVERLESS FUNCTION - INVENTORY API
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
      case 'GET':
        // Get all inventory items
        const { data: inventory, error: getError } = await supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: false });

        if (getError) throw getError;

        res.status(200).json({
          success: true,
          data: inventory,
          count: inventory.length
        });
        break;

      case 'POST':
        // Create new inventory item
        const { name, description, category, quantity, unit, status, location, min_quantity } = req.body;

        if (!name) {
          return res.status(400).json({
            success: false,
            message: 'Name is required'
          });
        }

        const { data: newItem, error: createError } = await supabase
          .from('inventory')
          .insert([{
            name,
            description,
            category,
            quantity: quantity || 0,
            unit,
            status: status || 'available',
            location,
            min_quantity: min_quantity || 0
          }])
          .select()
          .single();

        if (createError) throw createError;

        res.status(201).json({
          success: true,
          data: newItem
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Inventory API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
