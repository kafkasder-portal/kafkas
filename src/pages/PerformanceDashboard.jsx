import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import usePerformance from '../hooks/usePerformance.js';
import useApiCache from '../hooks/useApiCache.js';

/**
 * PerformanceDashboard Component
 * @description Real-time performance monitoring dashboard
 * @param {Object} props - Component props
 * @param {boolean} props.showDetails - Show detailed metrics
 * @param {boolean} props.autoRefresh - Auto refresh metrics
 * @param {number} props.refreshInterval - Refresh interval in milliseconds
 * @returns {JSX.Element} Performance dashboard
 */
const PerformanceDashboard = ({
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 5000,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  const {
    metrics,
    isMonitoring,
    getPerformanceScore,
    getRecommendations,
  } = usePerformance();

  // Cache performance data
  // const { data: cacheInfo } = useApiCache(
  //   'performance-metrics',
  //   () => Promise.resolve(metrics),
  //   30000, // 30 seconds TTL
  //   true
  // );

  const performanceScore = getPerformanceScore();
  const recommendations = getRecommendations();

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Force re-render to update metrics
      window.dispatchEvent(new Event('resize'));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Get metric status
  const getMetricStatus = (value, thresholds) => {
    if (value === null || value === undefined) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'poor';
  };

  // Get metric color
  const getMetricColor = (status) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Format metric value
  const formatMetric = (value, type) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'time':
        return `${value.toFixed(0)}ms`;
      case 'size':
        return `${value.toFixed(1)}KB`;
      case 'score':
        return `${value.toFixed(1)}%`;
      case 'ratio':
        return value.toFixed(3);
      default:
        return value.toString();
    }
  };

  const coreWebVitals = [
    {
      name: 'LCP',
      value: metrics.lcp,
      type: 'time',
      description: 'Largest Contentful Paint',
      thresholds: { good: 2500, warning: 4000 },
      target: '< 2.5s',
    },
    {
      name: 'FID',
      value: metrics.fid,
      type: 'time',
      description: 'First Input Delay',
      thresholds: { good: 100, warning: 300 },
      target: '< 100ms',
    },
    {
      name: 'CLS',
      value: metrics.cls,
      type: 'ratio',
      description: 'Cumulative Layout Shift',
      thresholds: { good: 0.1, warning: 0.25 },
      target: '< 0.1',
    },
    {
      name: 'FCP',
      value: metrics.fcp,
      type: 'time',
      description: 'First Contentful Paint',
      thresholds: { good: 2000, warning: 4000 },
      target: '< 2s',
    },
    {
      name: 'TTFB',
      value: metrics.ttfb,
      type: 'time',
      description: 'Time to First Byte',
      thresholds: { good: 800, warning: 1800 },
      target: '< 800ms',
    },
  ];

  const performanceMetrics = [
    {
      name: 'Bundle Size',
      value: metrics.bundleSize,
      type: 'size',
      description: 'JavaScript bundle size',
      thresholds: { good: 500, warning: 1000 },
      target: '< 500KB',
    },
    {
      name: 'Load Time',
      value: metrics.loadTime,
      type: 'time',
      description: 'Page load time',
      thresholds: { good: 3000, warning: 5000 },
      target: '< 3s',
    },
  ];

  return (
    <div className="performance-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>🚀 Performance Dashboard</h2>
        <div className="header-controls">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-button"
          >
            {isExpanded ? '📉' : '📈'}
          </button>
          <span className={`monitoring-status ${isMonitoring ? 'active' : 'inactive'}`}>
            {isMonitoring ? '🟢 Monitoring' : '🔴 Stopped'}
          </span>
        </div>
      </div>

      {/* Performance Score */}
      <div className="performance-score">
        <div className="score-circle">
          <div
            className="score-progress"
            style={{
              background: `conic-gradient(${getMetricColor(getMetricStatus(performanceScore, { good: 80, warning: 60 }))} ${performanceScore * 3.6}deg, #e5e7eb 0deg)`,
            }}
          />
          <div className="score-value">
            {formatMetric(performanceScore, 'score')}
          </div>
        </div>
        <div className="score-info">
          <h3>Performance Score</h3>
          <p>Overall application performance rating</p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="metrics-section">
        <h3>📊 Core Web Vitals</h3>
        <div className="metrics-grid">
          {coreWebVitals.map((metric) => {
            const status = getMetricStatus(metric.value, metric.thresholds);
            return (
              <div
                key={metric.name}
                className={`metric-card ${status}`}
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="metric-header">
                  <span className="metric-name">{metric.name}</span>
                  <span className="metric-status">{status}</span>
                </div>
                <div className="metric-value">
                  {formatMetric(metric.value, metric.type)}
                </div>
                <div className="metric-target">
                  Target: {metric.target}
                </div>
                <div className="metric-description">
                  {metric.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="metrics-section">
        <h3>⚡ Performance Metrics</h3>
        <div className="metrics-grid">
          {performanceMetrics.map((metric) => {
            const status = getMetricStatus(metric.value, metric.thresholds);
            return (
              <div
                key={metric.name}
                className={`metric-card ${status}`}
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="metric-header">
                  <span className="metric-name">{metric.name}</span>
                  <span className="metric-status">{status}</span>
                </div>
                <div className="metric-value">
                  {formatMetric(metric.value, metric.type)}
                </div>
                <div className="metric-target">
                  Target: {metric.target}
                </div>
                <div className="metric-description">
                  {metric.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>💡 Recommendations</h3>
          <div className="recommendations-list">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <span className="recommendation-icon">💡</span>
                <span className="recommendation-text">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {showDetails && isExpanded && (
        <div className="detailed-metrics">
          <h3>🔍 Detailed Metrics</h3>
          <pre className="metrics-json">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      )}

      {/* Metric Details Modal */}
      {selectedMetric && (
        <div className="metric-modal" onClick={() => setSelectedMetric(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedMetric.name}</h3>
            <p>{selectedMetric.description}</p>
            <div className="metric-details">
              <div className="detail-item">
                <strong>Current Value:</strong> {formatMetric(selectedMetric.value, selectedMetric.type)}
              </div>
              <div className="detail-item">
                <strong>Target:</strong> {selectedMetric.target}
              </div>
              <div className="detail-item">
                <strong>Status:</strong> {getMetricStatus(selectedMetric.value, selectedMetric.thresholds)}
              </div>
            </div>
            <button onClick={() => setSelectedMetric(null)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .performance-dashboard {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .expand-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .expand-button:hover {
          background-color: #f3f4f6;
        }

        .monitoring-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .monitoring-status.active {
          background-color: #d1fae5;
          color: #065f46;
        }

        .monitoring-status.inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .performance-score {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .score-circle {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: rotate(-90deg);
        }

        .score-value {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          z-index: 1;
        }

        .score-info h3 {
          margin: 0 0 4px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        .score-info p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .metrics-section {
          margin-bottom: 32px;
        }

        .metrics-section h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .metric-card {
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .metric-card.good {
          border-color: #10b981;
          background-color: #f0fdf4;
        }

        .metric-card.warning {
          border-color: #f59e0b;
          background-color: #fffbeb;
        }

        .metric-card.poor {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .metric-name {
          font-weight: 600;
          color: #1f2937;
        }

        .metric-status {
          font-size: 12px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .metric-card.good .metric-status {
          background-color: #10b981;
          color: white;
        }

        .metric-card.warning .metric-status {
          background-color: #f59e0b;
          color: white;
        }

        .metric-card.poor .metric-status {
          background-color: #ef4444;
          color: white;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .metric-target {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .metric-description {
          font-size: 14px;
          color: #4b5563;
        }

        .recommendations-section {
          margin-bottom: 32px;
        }

        .recommendations-section h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recommendation-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #fef3c7;
          border-radius: 6px;
          border-left: 4px solid #f59e0b;
        }

        .recommendation-icon {
          font-size: 16px;
        }

        .recommendation-text {
          color: #92400e;
          font-size: 14px;
        }

        .detailed-metrics {
          margin-top: 32px;
        }

        .detailed-metrics h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        .metrics-json {
          background-color: #f9fafb;
          padding: 16px;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre-wrap;
        }

        .metric-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 24px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        }

        .modal-content h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
        }

        .modal-content p {
          margin: 0 0 16px 0;
          color: #6b7280;
        }

        .metric-details {
          margin-bottom: 16px;
        }

        .detail-item {
          margin-bottom: 8px;
          color: #4b5563;
        }

        .modal-content button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .modal-content button:hover {
          background-color: #2563eb;
        }

        @media (max-width: 768px) {
          .performance-dashboard {
            padding: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .performance-score {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

PerformanceDashboard.propTypes = {
  showDetails: PropTypes.bool,
  autoRefresh: PropTypes.bool,
  refreshInterval: PropTypes.number,
};

export default PerformanceDashboard;
