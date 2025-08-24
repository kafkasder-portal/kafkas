// =====================================================
// SIMPLE TEST API
// =====================================================

module.exports = function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple response
  res.status(200).json({
    success: true,
    message: 'Test API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: process.env.VERCEL_ENV || 'development'
  });
};
