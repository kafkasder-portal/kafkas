import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
  Clock,
  Gauge,
} from 'lucide-react';
import { toast } from 'sonner';
import usePerformance, {
  useBundleAnalyzer,
  useNetworkPerformance,
  useResourcePerformance,
} from '../hooks/usePerformance';
import OptimizedImage from '../components/OptimizedImage';
import VirtualList from '../components/VirtualList';

const PerformanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRealTime, setIsRealTime] = useState(true);

  // Performance hooks
  const performance = usePerformance('PerformanceDashboard');
  const { bundleInfo, analyzeBundle } = useBundleAnalyzer();
  const { networkMetrics, measureNetworkPerformance } = useNetworkPerformance();
  const { resourceMetrics, measureResourcePerformance } =
    useResourcePerformance();

  // Mock data for demonstration
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [largeListData] = useState(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`,
      status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'completed',
    }))
  );

  // Update performance history
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setPerformanceHistory(prev => [
          ...prev.slice(-29), // Keep last 30 entries
          {
            timestamp: Date.now(),
            renderTime: performance.metrics.renderTime,
            memoryUsage: performance.metrics.memoryUsage,
            fps: performance.metrics.fps,
          },
        ]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRealTime, performance.metrics]);

  // Performance status indicators
  const getPerformanceStatus = (metric, threshold, type = 'lower') => {
    const isGood = type === 'lower' ? metric <= threshold : metric >= threshold;
    return {
      status: isGood ? 'good' : 'warning',
      icon: isGood ? CheckCircle : AlertTriangle,
      color: isGood ? 'text-green-600' : 'text-yellow-600',
    };
  };

  const renderTimeStatus = getPerformanceStatus(
    performance.metrics.renderTime,
    16,
    'lower'
  );
  const memoryStatus = getPerformanceStatus(
    performance.metrics.memoryUsage,
    80,
    'lower'
  );
  const fpsStatus = getPerformanceStatus(performance.metrics.fps, 30, 'higher');

  // Render virtual list item
  const renderListItem = (item, index) => (
    <div className='flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50'>
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-sm font-medium text-blue-600'>{item.id}</span>
        </div>
        <div>
          <h4 className='font-medium text-gray-900'>{item.name}</h4>
          <p className='text-sm text-gray-500'>{item.description}</p>
        </div>
      </div>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'active'
            ? 'bg-green-100 text-green-800'
            : item.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
        }`}
      >
        {item.status}
      </span>
    </div>
  );

  return (
    <div className='p-6 space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white rounded-lg shadow-sm border p-6'
      >
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <Activity className='h-8 w-8 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-900'>
              Performance Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isRealTime
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span>{isRealTime ? 'Real-time' : 'Static'}</span>
            </button>
            <button
              onClick={performance.logPerformance}
              className='flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <RefreshCw className='h-4 w-4' />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 mb-6'>
          {['overview', 'metrics', 'optimization', 'testing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Render Time */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-white border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Render Time
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {performance.metrics.renderTime.toFixed(2)}ms
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${renderTimeStatus.color.replace('text-', 'bg-')} bg-opacity-10`}
                >
                  <renderTimeStatus.icon className='h-6 w-6' />
                </div>
              </div>
              <div className='mt-2'>
                <span
                  className={`text-xs font-medium ${
                    performance.metrics.renderTime <= 16
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {performance.metrics.renderTime <= 16
                    ? 'Optimal'
                    : 'Needs optimization'}
                </span>
              </div>
            </motion.div>

            {/* Memory Usage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className='bg-white border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Memory Usage
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {performance.metrics.memoryUsage.toFixed(1)}%
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${memoryStatus.color.replace('text-', 'bg-')} bg-opacity-10`}
                >
                  <memoryStatus.icon className='h-6 w-6' />
                </div>
              </div>
              <div className='mt-2'>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      performance.metrics.memoryUsage > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(performance.metrics.memoryUsage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* FPS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className='bg-white border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>FPS</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {performance.metrics.fps}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${fpsStatus.color.replace('text-', 'bg-')} bg-opacity-10`}
                >
                  <fpsStatus.icon className='h-6 w-6' />
                </div>
              </div>
              <div className='mt-2'>
                <span
                  className={`text-xs font-medium ${
                    performance.metrics.fps >= 30
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {performance.metrics.fps >= 30 ? 'Smooth' : 'Low performance'}
                </span>
              </div>
            </motion.div>

            {/* Network Latency */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className='bg-white border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Network Latency
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {networkMetrics.latency.toFixed(0)}ms
                  </p>
                </div>
                <Wifi className='h-6 w-6 text-blue-600' />
              </div>
              <div className='mt-2'>
                <span className='text-xs text-gray-500'>
                  {networkMetrics.connectionType}
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className='space-y-6'>
            {/* Performance History Chart */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Performance History
              </h3>
              <div className='h-64 flex items-end space-x-1'>
                {performanceHistory.slice(-30).map((entry, index) => (
                  <div
                    key={index}
                    className='flex-1 bg-blue-500 rounded-t'
                    style={{
                      height: `${(entry.renderTime / 50) * 100}%`,
                      minHeight: '2px',
                    }}
                    title={`Render: ${entry.renderTime.toFixed(2)}ms, FPS: ${entry.fps}`}
                  />
                ))}
              </div>
              <div className='mt-2 text-xs text-gray-500'>
                Last 30 seconds - Render time (ms)
              </div>
            </div>

            {/* Resource Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Resource Loading
                </h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>
                      Total Resources:
                    </span>
                    <span className='font-medium'>
                      {resourceMetrics.totalResources}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Loaded:</span>
                    <span className='font-medium text-green-600'>
                      {resourceMetrics.loadedResources}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Failed:</span>
                    <span className='font-medium text-red-600'>
                      {resourceMetrics.failedResources}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Total Size:</span>
                    <span className='font-medium'>
                      {(resourceMetrics.totalSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Network Performance
                </h3>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Latency:</span>
                    <span className='font-medium'>
                      {networkMetrics.latency.toFixed(0)}ms
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Bandwidth:</span>
                    <span className='font-medium'>
                      {networkMetrics.bandwidth.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Connection:</span>
                    <span className='font-medium capitalize'>
                      {networkMetrics.connectionType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className='space-y-6'>
            {/* Optimization Suggestions */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Optimization Suggestions
              </h3>
              <div className='space-y-3'>
                {performance
                  .getOptimizationSuggestions()
                  .map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        suggestion.priority === 'high'
                          ? 'border-red-500 bg-red-50'
                          : 'border-yellow-500 bg-yellow-50'
                      }`}
                    >
                      <div className='flex items-start space-x-3'>
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            suggestion.priority === 'high'
                              ? 'text-red-500'
                              : 'text-yellow-500'
                          }`}
                        />
                        <div>
                          <h4 className='font-medium text-gray-900'>
                            {suggestion.action}
                          </h4>
                          <p className='text-sm text-gray-600 mt-1'>
                            {suggestion.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Performance Warnings */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Performance Warnings
              </h3>
              <div className='space-y-2'>
                {performance.getPerformanceWarnings().map((warning, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-2 text-sm text-yellow-700'
                  >
                    <AlertTriangle className='h-4 w-4' />
                    <span>{warning}</span>
                  </div>
                ))}
                {performance.getPerformanceWarnings().length === 0 && (
                  <div className='flex items-center space-x-2 text-sm text-green-700'>
                    <CheckCircle className='h-4 w-4' />
                    <span>No performance warnings</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className='space-y-6'>
            {/* Virtual Scrolling Test */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Virtual Scrolling Test (10,000 items)
              </h3>
              <VirtualList
                items={largeListData}
                itemHeight={80}
                containerHeight={400}
                renderItem={renderListItem}
                className='border border-gray-200 rounded-lg'
              />
            </div>

            {/* Image Optimization Test */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Image Optimization Test
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Original
                  </h4>
                  <OptimizedImage
                    src='https://picsum.photos/300/200'
                    alt='Original image'
                    width={300}
                    height={200}
                    lazy={false}
                    className='rounded-lg'
                  />
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Optimized
                  </h4>
                  <OptimizedImage
                    src='https://picsum.photos/300/200'
                    alt='Optimized image'
                    width={300}
                    height={200}
                    quality={75}
                    format='webp'
                    className='rounded-lg'
                  />
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Lazy Loaded
                  </h4>
                  <OptimizedImage
                    src='https://picsum.photos/300/200'
                    alt='Lazy loaded image'
                    width={300}
                    height={200}
                    lazy={true}
                    className='rounded-lg'
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PerformanceDashboard;
