/* eslint-env node */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3004;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Test data
const testData = {
  message: 'Test API is working!',
  timestamp: new Date().toISOString(),
  environment: NODE_ENV,
  version: '1.0.0'
};

// Test endpoint
app.get('/api/test', (req, res) => {
  try {
    res.json({
      success: true,
      data: testData
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ success: false, message: 'Test API error' });
  }
});

// Echo endpoint
app.post('/api/test/echo', (req, res) => {
  try {
    const { data } = req.body;
    res.json({
      success: true,
      data: {
        echo: data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Echo API error:', error);
    res.status(500).json({ success: false, message: 'Echo API error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Test API error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Test API server running on port ${PORT}`);
  });
}

module.exports = app;
