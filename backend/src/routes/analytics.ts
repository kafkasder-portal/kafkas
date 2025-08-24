import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Analytics verilerini saklamak için geçici storage (production'da Redis kullanılabilir)
const analyticsData: any = {
  events: [],
  metrics: [],
  healthReports: [],
};

// =====================================================
// ANALYTICS ENDPOINTS
// =====================================================

// Analytics events endpoint
router.post('/events', async (req, res) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Events must be an array' });
    }

    // Events'i geçici storage'a ekle
    analyticsData.events.push(...events);

    // Supabase'e kaydet (opsiyonel)
    if (events.length > 0) {
      try {
        const { error } = await supabase.from('analytics_events').insert(
          events.map(event => ({
            name: event.name,
            properties: event.properties,
            session_id: event.properties.sessionId,
            user_id: event.properties.userId,
            timestamp: event.properties.timestamp,
          }))
        );

        if (error) {
          console.error('Error saving analytics events to Supabase:', error);
        }
      } catch (error) {
        console.error('Error inserting analytics events:', error);
      }
    }

    // Storage boyutunu kontrol et (max 10000 event)
    if (analyticsData.events.length > 10000) {
      analyticsData.events = analyticsData.events.slice(-5000);
    }

    res.json({ success: true, saved: events.length });
  } catch (error) {
    console.error('Error processing analytics events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Performance metrics endpoint
router.post('/metrics', async (req, res) => {
  try {
    const { performance, timestamp, sessionId } = req.body;

    if (!performance) {
      return res.status(400).json({ error: 'Performance data is required' });
    }

    const metricData = {
      performance,
      timestamp,
      sessionId,
    };

    // Metrics'i geçici storage'a ekle
    analyticsData.metrics.push(metricData);

    // Supabase'e kaydet (opsiyonel)
    try {
      const { error } = await supabase.from('performance_metrics').insert({
        session_id: sessionId,
        lcp: performance.LCP,
        fid: performance.FID,
        cls: performance.CLS,
        memory: performance.memory,
        api_calls: performance.apiCalls,
        timestamp,
      });

      if (error) {
        console.error('Error saving performance metrics to Supabase:', error);
      }
    } catch (error) {
      console.error('Error inserting performance metrics:', error);
    }

    // Storage boyutunu kontrol et (max 1000 metric)
    if (analyticsData.metrics.length > 1000) {
      analyticsData.metrics = analyticsData.metrics.slice(-500);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing performance metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health report endpoint
router.post('/health/report', async (req, res) => {
  try {
    const healthData = req.body;

    if (!healthData) {
      return res.status(400).json({ error: 'Health data is required' });
    }

    // Health data'yı geçici storage'a ekle
    analyticsData.healthReports.push(healthData);

    // Supabase'e kaydet (opsiyonel)
    try {
      const { error } = await supabase.from('health_reports').insert({
        system_info: healthData.system,
        network_info: healthData.network,
        application_info: healthData.application,
        timestamp: healthData.timestamp,
      });

      if (error) {
        console.error('Error saving health report to Supabase:', error);
      }
    } catch (error) {
      console.error('Error inserting health report:', error);
    }

    // Storage boyutunu kontrol et (max 1000 report)
    if (analyticsData.healthReports.length > 1000) {
      analyticsData.healthReports = analyticsData.healthReports.slice(-500);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing health report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// ANALYTICS DATA RETRIEVAL ENDPOINTS
// =====================================================

// Get analytics summary
router.get('/summary', async (req, res) => {
  try {
    const { period = '24h' } = req.query;

    const now = new Date();
    let startTime: Date;

    switch (period) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Filter data by time period
    const filteredEvents = analyticsData.events.filter(
      (event: any) => new Date(event.properties.timestamp) >= startTime
    );

    const filteredMetrics = analyticsData.metrics.filter(
      (metric: any) => new Date(metric.timestamp) >= startTime
    );

    const filteredHealthReports = analyticsData.healthReports.filter(
      (report: any) => new Date(report.timestamp) >= startTime
    );

    // Calculate summary statistics
    const summary = {
      period,
      events: {
        total: filteredEvents.length,
        byType: filteredEvents.reduce((acc: any, event: any) => {
          acc[event.name] = (acc[event.name] || 0) + 1;
          return acc;
        }, {}),
      },
      performance: {
        avgLCP: calculateAverage(filteredMetrics, 'performance.LCP'),
        avgFID: calculateAverage(filteredMetrics, 'performance.FID'),
        avgCLS: calculateAverage(filteredMetrics, 'performance.CLS'),
        avgMemoryUsage: calculateAverage(
          filteredMetrics,
          'performance.memory.used'
        ),
      },
      health: {
        totalReports: filteredHealthReports.length,
        avgResponseTime: calculateAverage(
          filteredHealthReports,
          'network.responseTime'
        ),
        successRate: calculateSuccessRate(filteredHealthReports),
      },
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating analytics summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get events by type
router.get('/events/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const filteredEvents = analyticsData.events
      .filter((event: any) => event.name === type)
      .slice(
        parseInt(offset as string),
        parseInt(offset as string) + parseInt(limit as string)
      );

    res.json({
      events: filteredEvents,
      total: analyticsData.events.filter((event: any) => event.name === type)
        .length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get performance metrics
router.get('/metrics', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const metrics = analyticsData.metrics.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );

    res.json({
      metrics,
      total: analyticsData.metrics.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get health reports
router.get('/health', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const reports = analyticsData.healthReports.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );

    res.json({
      reports,
      total: analyticsData.healthReports.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Error retrieving health reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function calculateAverage(data: any[], path: string): number {
  const values = data
    .map(item => getNestedValue(item, path))
    .filter(value => value !== null && value !== undefined && !isNaN(value));

  if (values.length === 0) return 0;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateSuccessRate(healthReports: any[]): number {
  if (healthReports.length === 0) return 0;

  const successfulReports = healthReports.filter(
    report => report.network && report.network.status === 200
  );

  return (successfulReports.length / healthReports.length) * 100;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

// =====================================================
// ANALYTICS TABLES CREATION (Supabase)
// =====================================================

// Bu fonksiyon Supabase'de analytics tablolarını oluşturmak için kullanılabilir
async function createAnalyticsTables() {
  try {
    // Analytics events tablosu
    const { error: eventsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS analytics_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          properties JSONB,
          session_id VARCHAR(255),
          user_id VARCHAR(255),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(name);
        CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
        CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
      `,
    });

    if (eventsError) {
      console.error('Error creating analytics_events table:', eventsError);
    }

    // Performance metrics tablosu
    const { error: metricsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS performance_metrics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255),
          lcp DECIMAL(10,2),
          fid DECIMAL(10,2),
          cls DECIMAL(10,4),
          memory JSONB,
          api_calls JSONB,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);
        CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
      `,
    });

    if (metricsError) {
      console.error('Error creating performance_metrics table:', metricsError);
    }

    // Health reports tablosu
    const { error: healthError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS health_reports (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          system_info JSONB,
          network_info JSONB,
          application_info JSONB,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_health_reports_timestamp ON health_reports(timestamp);
      `,
    });

    if (healthError) {
      console.error('Error creating health_reports table:', healthError);
    }

    console.log('Analytics tables created successfully');
  } catch (error) {
    console.error('Error creating analytics tables:', error);
  }
}

// Tabloları oluştur (sadece bir kez çalıştırılmalı)
// createAnalyticsTables();

export default router;
