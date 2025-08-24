/* eslint-env node */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Analytics data storage
let analyticsData = {
  pageViews: {},
  userSessions: {},
  performance: {},
  errors: {},
  conversions: {}
};

// Routes
app.get('/api/analytics/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/analytics/track', (req, res) => {
  try {
    const { event, data, userId, sessionId } = req.body;
    
    switch (event) {
      case 'page_view': {
        const page = data.page || 'unknown';
        analyticsData.pageViews[page] = (analyticsData.pageViews[page] || 0) + 1;
        break;
      }
      
      case 'user_session': {
        const session = {
          userId,
          sessionId,
          startTime: new Date().toISOString(),
          data
        };
        analyticsData.userSessions[sessionId] = session;
        break;
      }
      
      case 'performance': {
        const metric = data.metric || 'unknown';
        if (!analyticsData.performance[metric]) {
          analyticsData.performance[metric] = [];
        }
        analyticsData.performance[metric].push({
          value: data.value,
          timestamp: new Date().toISOString()
        });
        break;
      }
      
      case 'error': {
        const errorType = data.type || 'unknown';
        if (!analyticsData.errors[errorType]) {
          analyticsData.errors[errorType] = [];
        }
        analyticsData.errors[errorType].push({
          message: data.message,
          stack: data.stack,
          timestamp: new Date().toISOString()
        });
        break;
      }
      
      case 'conversion': {
        const conversionType = data.type || 'unknown';
        analyticsData.conversions[conversionType] = (analyticsData.conversions[conversionType] || 0) + 1;
        break;
      }
      
      default:
        console.warn(`Unknown analytics event: ${event}`);
    }
    
    res.json({ success: true, message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    res.status(500).json({ success: false, message: 'Failed to track event' });
  }
});

app.get('/api/analytics/summary', (req, res) => {
  try {
    const summary = {
      totalPageViews: Object.values(analyticsData.pageViews).reduce((sum, count) => sum + count, 0),
      activeSessions: Object.keys(analyticsData.userSessions).length,
      totalErrors: Object.values(analyticsData.errors).reduce((sum, errors) => sum + errors.length, 0),
      totalConversions: Object.values(analyticsData.conversions).reduce((sum, count) => sum + count, 0),
      topPages: Object.entries(analyticsData.pageViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([page, count]) => ({ page, count })),
      errorTypes: Object.keys(analyticsData.errors),
      conversionTypes: Object.keys(analyticsData.conversions)
    };
    
    console.log('Analytics summary requested:', summary);
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error generating analytics summary:', error);
    res.status(500).json({ success: false, message: 'Failed to generate summary' });
  }
});

app.get('/api/analytics/performance', (req, res) => {
  try {
    const { metric } = req.query;
    const performanceData = analyticsData.performance[metric] || [];
    
    if (performanceData.length === 0) {
      return res.json({ success: true, data: [] });
    }
    
    const values = performanceData.map(item => item.value);
    const stats = {
      count: values.length,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      recent: performanceData.slice(-10)
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting performance data:', error);
    res.status(500).json({ success: false, message: 'Failed to get performance data' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Analytics API server running on port ${PORT}`);
  });
}

module.exports = app;
