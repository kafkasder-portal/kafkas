// =====================================================
// EXPRESS SERVER - HEALTH CHECK
// =====================================================

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Kafkas Derneği Portal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health report endpoint
app.post('/api/health/report', (req, res) => {
  console.log('Health report received:', req.body);
  res.status(200).json({
    status: 'OK',
    message: 'Health report received successfully',
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint
app.post('/api/metrics', (req, res) => {
  console.log('Metrics received:', req.body);
  res.status(200).json({
    status: 'OK',
    message: 'Metrics received successfully',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Health API server running on port ${PORT}`);
  console.log(`📊 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📈 Metrics endpoint: http://localhost:${PORT}/api/metrics`);
});

export default app;
