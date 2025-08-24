/* eslint-env node */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Health check data
let healthStatus = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: NODE_ENV,
  version: process.env.npm_package_version || '1.0.0',
  checks: {
    database: 'healthy',
    redis: 'healthy',
    external_apis: 'healthy'
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    // Update uptime
    healthStatus.uptime = process.uptime();
    healthStatus.timestamp = new Date().toISOString();
    
    // Perform health checks
    const checks = {
      database: checkDatabase(),
      redis: checkRedis(),
      external_apis: checkExternalAPIs()
    };
    
    healthStatus.checks = checks;
    
    // Determine overall status
    const allHealthy = Object.values(checks).every(check => check === 'healthy');
    healthStatus.status = allHealthy ? 'healthy' : 'degraded';
    
    const statusCode = allHealthy ? 200 : 503;
    
    console.log('Health check requested:', healthStatus);
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    healthStatus.status = 'unhealthy';
    healthStatus.error = error.message;
    res.status(503).json(healthStatus);
  }
});

// Detailed health check
app.get('/api/health/detailed', (req, res) => {
  try {
    const detailedHealth = {
      ...healthStatus,
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'not configured',
        REDIS_URL: process.env.REDIS_URL ? 'configured' : 'not configured'
      }
    };
    
    console.log('Detailed health check requested');
    res.json(detailedHealth);
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(500).json({ error: 'Failed to get detailed health status' });
  }
});

// Health check functions
function checkDatabase() {
  // Simulate database check
  return Math.random() > 0.1 ? 'healthy' : 'unhealthy';
}

function checkRedis() {
  // Simulate Redis check
  return Math.random() > 0.05 ? 'healthy' : 'unhealthy';
}

function checkExternalAPIs() {
  // Simulate external API checks
  return Math.random() > 0.02 ? 'healthy' : 'unhealthy';
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Health API error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Health API server running on port ${PORT}`);
  });
}

module.exports = app;
