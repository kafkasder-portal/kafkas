// =====================================================
// VERCEL SERVERLESS FUNCTION - ANALYTICS API
// =====================================================

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// In-memory storage for analytics data (in production, use Redis or database)
const analyticsData = {
  events: [],
  metrics: [],
  healthReports: []
};

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
        // Get analytics summary
        const { period = '24h' } = req.query;
        
        const now = new Date();
        let startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default 24h
        
        switch (period) {
          case '1h':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case '7d':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }

        // Filter data by time period
        const filteredEvents = analyticsData.events.filter(event => 
          new Date(event.properties.timestamp) >= startTime
        );

        const filteredMetrics = analyticsData.metrics.filter(metric => 
          new Date(metric.timestamp) >= startTime
        );

        const summary = {
          period,
          events: {
            total: filteredEvents.length,
            byType: filteredEvents.reduce((acc, event) => {
              acc[event.name] = (acc[event.name] || 0) + 1;
              return acc;
            }, {})
          },
          performance: {
            avgLCP: calculateAverage(filteredMetrics, 'performance.LCP'),
            avgFID: calculateAverage(filteredMetrics, 'performance.FID'),
            avgCLS: calculateAverage(filteredMetrics, 'performance.CLS')
          }
        };

        res.status(200).json(summary);
        break;

      case 'POST':
        // Handle analytics data
        const { events, performance, timestamp, sessionId } = req.body;

        if (events) {
          // Store events
          analyticsData.events.push(...events);
          
          // Limit storage size
          if (analyticsData.events.length > 10000) {
            analyticsData.events = analyticsData.events.slice(-5000);
          }

          // Save to Supabase (optional)
          if (events.length > 0) {
            try {
              await supabase
                .from('analytics_events')
                .insert(events.map(event => ({
                  name: event.name,
                  properties: event.properties,
                  session_id: event.properties.sessionId,
                  user_id: event.properties.userId,
                  timestamp: event.properties.timestamp
                })));
            } catch (error) {
              console.error('Error saving analytics events:', error);
            }
          }
        }

        if (performance) {
          // Store performance metrics
          analyticsData.metrics.push({ performance, timestamp, sessionId });
          
          // Limit storage size
          if (analyticsData.metrics.length > 1000) {
            analyticsData.metrics = analyticsData.metrics.slice(-500);
          }
        }

        res.status(200).json({ success: true });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Utility functions
function calculateAverage(data, path) {
  const values = data
    .map(item => getNestedValue(item, path))
    .filter(value => value !== null && value !== undefined && !isNaN(value));
  
  if (values.length === 0) return 0;
  
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}
