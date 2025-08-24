import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Cpu,
  Eye,
  EyeOff,
  HardDrive,
  Network,
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { performanceMonitor, systemHealthMonitor } from '../utils/monitoring';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [healthData, setHealthData] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      updateData();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Initial data load
  useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    setIsRefreshing(true);

    // Get current metrics
    const currentMetrics = performanceMonitor.getMetrics();
    const currentHealth = systemHealthMonitor.getHealthData();

    setMetrics(currentMetrics);
    setHealthData(currentHealth);

    // Simulate analytics data (in real app, this would come from analyticsTracker)
    setAnalyticsData({
      pageViews: Math.floor(Math.random() * 100) + 50,
      uniqueUsers: Math.floor(Math.random() * 30) + 10,
      sessionDuration: Math.floor(Math.random() * 300) + 60,
      bounceRate: Math.random() * 0.3 + 0.1,
      topPages: [
        { path: '/dashboard', views: 45 },
        { path: '/donations', views: 32 },
        { path: '/beneficiaries', views: 28 },
        { path: '/meetings', views: 22 },
      ],
    });

    setIsRefreshing(false);
  };

  // Calculate performance scores
  const performanceScores = useMemo(() => {
    const scores = {};

    // LCP Score (Largest Contentful Paint)
    if (metrics.performance?.lcp) {
      const lcp = metrics.performance.lcp;
      scores.lcp = lcp < 2500 ? 100 : lcp < 4000 ? 75 : lcp < 6000 ? 50 : 25;
    }

    // FID Score (First Input Delay)
    if (metrics.performance?.fid) {
      const fid = metrics.performance.fid;
      scores.fid = fid < 100 ? 100 : fid < 300 ? 75 : fid < 500 ? 50 : 25;
    }

    // CLS Score (Cumulative Layout Shift)
    if (metrics.performance?.cls) {
      const cls = metrics.performance.cls;
      scores.cls = cls < 0.1 ? 100 : cls < 0.25 ? 75 : cls < 0.5 ? 50 : 25;
    }

    // Overall score
    const scoreValues = Object.values(scores);
    scores.overall =
      scoreValues.length > 0
        ? Math.round(
            scoreValues.reduce((sum, score) => sum + score, 0) /
              scoreValues.length
          )
        : 0;

    return scores;
  }, [metrics.performance]);

  // Get status color based on score
  const getStatusColor = score => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get status icon based on score
  const getStatusIcon = score => {
    if (score >= 90) return <CheckCircle className='w-5 h-5 text-green-500' />;
    if (score >= 70)
      return <AlertTriangle className='w-5 h-5 text-yellow-500' />;
    return <AlertTriangle className='w-5 h-5 text-red-500' />;
  };

  // Format memory usage
  const formatMemory = bytes => {
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb)} MB`;
  };

  // Format time
  const formatTime = ms => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Activity },
    { id: 'performance', label: 'Performans', icon: BarChart3 },
    { id: 'analytics', label: 'Analitik', icon: TrendingUp },
    { id: 'health', label: 'Sistem Sağlığı', icon: Cpu },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
              Monitoring & Analytics Dashboard
            </h1>
            <p className='text-slate-600 dark:text-slate-400 mt-2'>
              Real-time performance monitoring and analytics
            </p>
          </div>

          <div className='flex items-center space-x-4'>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className='flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all'
            >
              {showDetails ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
              <span>{showDetails ? 'Basit Görünüm' : 'Detaylı Görünüm'}</span>
            </button>

            <button
              onClick={updateData}
              disabled={isRefreshing}
              className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>Yenile</span>
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <Settings className='w-4 h-4' />
              <span>Otomatik</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm mb-6'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className='w-4 h-4' />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                metrics={metrics}
                healthData={healthData}
                analyticsData={analyticsData}
                performanceScores={performanceScores}
                showDetails={showDetails}
              />
            )}

            {activeTab === 'performance' && (
              <PerformanceTab
                metrics={metrics}
                performanceScores={performanceScores}
                showDetails={showDetails}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab
                analyticsData={analyticsData}
                showDetails={showDetails}
              />
            )}

            {activeTab === 'health' && (
              <HealthTab healthData={healthData} showDetails={showDetails} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({
  metrics,
  healthData,
  analyticsData,
  performanceScores,
  showDetails,
}) => {
  return (
    <div className='space-y-6'>
      {/* Performance Score Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <PerformanceScoreCard
          title='Genel Performans'
          score={performanceScores.overall}
          icon={Activity}
          description='Web Vitals ortalaması'
        />
        <PerformanceScoreCard
          title='LCP'
          score={performanceScores.lcp}
          icon={Clock}
          description='Largest Contentful Paint'
          value={
            metrics.performance?.lcp
              ? formatTime(metrics.performance.lcp)
              : 'N/A'
          }
        />
        <PerformanceScoreCard
          title='FID'
          score={performanceScores.fid}
          icon={Cpu}
          description='First Input Delay'
          value={
            metrics.performance?.fid
              ? formatTime(metrics.performance.fid)
              : 'N/A'
          }
        />
        <PerformanceScoreCard
          title='CLS'
          score={performanceScores.cls}
          icon={BarChart3}
          description='Cumulative Layout Shift'
          value={
            metrics.performance?.cls
              ? metrics.performance.cls.toFixed(3)
              : 'N/A'
          }
        />
      </div>

      {/* System Status */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <SystemStatusCard healthData={healthData} showDetails={showDetails} />
        <AnalyticsOverviewCard
          analyticsData={analyticsData}
          showDetails={showDetails}
        />
      </div>

      {/* Recent Activity */}
      {showDetails && <RecentActivityCard metrics={metrics} />}
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ metrics, performanceScores, showDetails }) => {
  return (
    <div className='space-y-6'>
      {/* Performance Metrics */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
            Web Vitals Detayları
          </h3>
          <div className='space-y-4'>
            {Object.entries(performanceScores).map(([key, score]) => (
              <div key={key} className='flex items-center justify-between'>
                <span className='text-slate-600 dark:text-slate-400 capitalize'>
                  {key === 'lcp'
                    ? 'Largest Contentful Paint'
                    : key === 'fid'
                      ? 'First Input Delay'
                      : key === 'cls'
                        ? 'Cumulative Layout Shift'
                        : key === 'overall'
                          ? 'Genel Skor'
                          : key}
                </span>
                <div className='flex items-center space-x-2'>
                  {getStatusIcon(score)}
                  <span className={`font-semibold ${getStatusColor(score)}`}>
                    {score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
            Bellek Kullanımı
          </h3>
          {metrics.performance?.memory ? (
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span>Kullanılan</span>
                <span className='font-semibold'>
                  {formatMemory(metrics.performance.memory.used * 1024 * 1024)}
                </span>
              </div>
              <div className='w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all'
                  style={{
                    width: `${(metrics.performance.memory.used / metrics.performance.memory.limit) * 100}%`,
                  }}
                />
              </div>
              <div className='flex justify-between text-sm text-slate-500'>
                <span>
                  Toplam:{' '}
                  {formatMemory(metrics.performance.memory.total * 1024 * 1024)}
                </span>
                <span>
                  Limit:{' '}
                  {formatMemory(metrics.performance.memory.limit * 1024 * 1024)}
                </span>
              </div>
            </div>
          ) : (
            <p className='text-slate-500'>Bellek bilgisi mevcut değil</p>
          )}
        </div>
      </div>

      {/* API Performance */}
      {showDetails && <APIPerformanceCard metrics={metrics} />}
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ analyticsData, showDetails }) => {
  return (
    <div className='space-y-6'>
      {/* Analytics Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard
          title='Sayfa Görüntülemeleri'
          value={analyticsData.pageViews}
          icon={Eye}
          trend='up'
          trendValue='+12%'
        />
        <MetricCard
          title='Benzersiz Kullanıcılar'
          value={analyticsData.uniqueUsers}
          icon={Users}
          trend='up'
          trendValue='+8%'
        />
        <MetricCard
          title='Ortalama Oturum'
          value={`${Math.floor(analyticsData.sessionDuration / 60)}m ${analyticsData.sessionDuration % 60}s`}
          icon={Clock}
          trend='down'
          trendValue='-3%'
        />
        <MetricCard
          title='Hemen Çıkma Oranı'
          value={`${(analyticsData.bounceRate * 100).toFixed(1)}%`}
          icon={TrendingDown}
          trend='down'
          trendValue='-5%'
        />
      </div>

      {/* Top Pages */}
      <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
          En Popüler Sayfalar
        </h3>
        <div className='space-y-3'>
          {analyticsData.topPages?.map((page, index) => (
            <div key={page.path} className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <span className='text-slate-500 w-6'>{index + 1}</span>
                <span className='text-slate-900 dark:text-white'>
                  {page.path}
                </span>
              </div>
              <span className='font-semibold text-slate-900 dark:text-white'>
                {page.views} görüntüleme
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Health Tab Component
const HealthTab = ({ healthData, showDetails }) => {
  return (
    <div className='space-y-6'>
      {/* System Health */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center'>
            <Cpu className='w-5 h-5 mr-2' />
            Sistem Durumu
          </h3>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span>CPU Kullanımı</span>
              <span className='font-semibold'>
                {healthData.system?.cpu?.load || 0}%
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Çalışma Süresi</span>
              <span className='font-semibold'>
                {healthData.system?.uptime
                  ? Math.floor(healthData.system.uptime / 60)
                  : 0}{' '}
                dakika
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Bellek Kullanımı</span>
              <span className='font-semibold'>
                {healthData.system?.memory
                  ? `${healthData.system.memory.percentage}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center'>
            <Network className='w-5 h-5 mr-2' />
            Ağ Durumu
          </h3>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span>API Durumu</span>
              <span
                className={`font-semibold ${
                  healthData.network?.status === 200
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {healthData.network?.status || 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Yanıt Süresi</span>
              <span className='font-semibold'>
                {healthData.network?.responseTime
                  ? `${healthData.network.responseTime}ms`
                  : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Son Kontrol</span>
              <span className='font-semibold'>
                {healthData.network?.timestamp
                  ? new Date(healthData.network.timestamp).toLocaleTimeString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Health */}
      {showDetails && (
        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
            Uygulama Özellikleri
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {Object.entries(healthData.application?.features || {}).map(
              ([feature, status]) => (
                <div key={feature} className='flex items-center space-x-2'>
                  {status ? (
                    <CheckCircle className='w-4 h-4 text-green-500' />
                  ) : (
                    <AlertTriangle className='w-4 h-4 text-red-500' />
                  )}
                  <span className='text-sm capitalize'>{feature}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Performance Score Card Component
const PerformanceScoreCard = ({
  title,
  score,
  icon: Icon,
  description,
  value,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700'
    >
      <div className='flex items-center justify-between mb-4'>
        <Icon className='w-6 h-6 text-blue-600' />
        {getStatusIcon(score)}
      </div>

      <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-1'>
        {title}
      </h3>

      <div className='flex items-baseline space-x-2'>
        <span className={`text-2xl font-bold ${getStatusColor(score)}`}>
          {score}/100
        </span>
        {value && <span className='text-sm text-slate-500'>({value})</span>}
      </div>

      <p className='text-sm text-slate-500 mt-2'>{description}</p>
    </motion.div>
  );
};

// System Status Card Component
const SystemStatusCard = ({ healthData, showDetails }) => {
  const isHealthy = healthData.network?.status === 200;

  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center'>
        <HardDrive className='w-5 h-5 mr-2' />
        Sistem Durumu
      </h3>

      <div className='flex items-center space-x-3 mb-4'>
        {isHealthy ? (
          <CheckCircle className='w-6 h-6 text-green-500' />
        ) : (
          <AlertTriangle className='w-6 h-6 text-red-500' />
        )}
        <span
          className={`font-semibold ${isHealthy ? 'text-green-500' : 'text-red-500'}`}
        >
          {isHealthy ? 'Sistem Sağlıklı' : 'Sistem Sorunu'}
        </span>
      </div>

      {showDetails && (
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Versiyon:</span>
            <span>{healthData.application?.version || 'N/A'}</span>
          </div>
          <div className='flex justify-between'>
            <span>Ortam:</span>
            <span className='capitalize'>
              {healthData.application?.environment || 'N/A'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Son Güncelleme:</span>
            <span>
              {healthData.application?.timestamp
                ? new Date(
                    healthData.application.timestamp
                  ).toLocaleTimeString()
                : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Overview Card Component
const AnalyticsOverviewCard = ({ analyticsData, showDetails }) => {
  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center'>
        <TrendingUp className='w-5 h-5 mr-2' />
        Analitik Özeti
      </h3>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <div className='text-2xl font-bold text-slate-900 dark:text-white'>
            {analyticsData.pageViews}
          </div>
          <div className='text-sm text-slate-500'>Sayfa Görüntülemesi</div>
        </div>
        <div>
          <div className='text-2xl font-bold text-slate-900 dark:text-white'>
            {analyticsData.uniqueUsers}
          </div>
          <div className='text-sm text-slate-500'>Benzersiz Kullanıcı</div>
        </div>
      </div>

      {showDetails && (
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Ortalama Oturum:</span>
            <span>
              {Math.floor(analyticsData.sessionDuration / 60)}m{' '}
              {analyticsData.sessionDuration % 60}s
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Hemen Çıkma Oranı:</span>
            <span>{(analyticsData.bounceRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Recent Activity Card Component
const RecentActivityCard = ({ metrics }) => {
  const recentErrors = metrics.errors?.slice(-5) || [];
  const recentAPICalls = Object.values(metrics.apiCalls || {})
    .flat()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
          Son Hatalar
        </h3>
        <div className='space-y-3'>
          {recentErrors.length > 0 ? (
            recentErrors.map((error, index) => (
              <div
                key={index}
                className='text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'
              >
                <div className='font-semibold text-red-700 dark:text-red-400'>
                  {error.type}
                </div>
                <div className='text-red-600 dark:text-red-300'>
                  {error.message}
                </div>
              </div>
            ))
          ) : (
            <p className='text-slate-500'>Son hata yok</p>
          )}
        </div>
      </div>

      <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
          Son API Çağrıları
        </h3>
        <div className='space-y-3'>
          {recentAPICalls.length > 0 ? (
            recentAPICalls.map((call, index) => (
              <div
                key={index}
                className='text-sm p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'
              >
                <div className='font-semibold text-blue-700 dark:text-blue-400'>
                  {call.method} {call.url}
                </div>
                <div className='text-blue-600 dark:text-blue-300'>
                  {call.status} - {formatTime(call.duration)}
                </div>
              </div>
            ))
          ) : (
            <p className='text-slate-500'>API çağrısı yok</p>
          )}
        </div>
      </div>
    </div>
  );
};

// API Performance Card Component
const APIPerformanceCard = ({ metrics }) => {
  const apiCalls = Object.entries(metrics.apiCalls || {})
    .map(([url, calls]) => ({
      url,
      totalCalls: calls.length,
      avgDuration:
        calls.reduce((sum, call) => sum + call.duration, 0) / calls.length,
      successRate:
        (calls.filter(call => call.success).length / calls.length) * 100,
    }))
    .sort((a, b) => b.totalCalls - a.totalCalls)
    .slice(0, 10);

  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6'>
      <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>
        API Performansı
      </h3>
      <div className='space-y-4'>
        {apiCalls.map((api, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg'
          >
            <div className='flex-1'>
              <div className='font-semibold text-slate-900 dark:text-white truncate'>
                {api.url}
              </div>
              <div className='text-sm text-slate-500'>
                {api.totalCalls} çağrı
              </div>
            </div>
            <div className='text-right'>
              <div className='font-semibold text-slate-900 dark:text-white'>
                {formatTime(api.avgDuration)}
              </div>
              <div className='text-sm text-slate-500'>
                {api.successRate.toFixed(1)}% başarı
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className='bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700'
    >
      <div className='flex items-center justify-between mb-4'>
        <Icon className='w-6 h-6 text-blue-600' />
        <div
          className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {trend === 'up' ? (
            <TrendingUp className='w-4 h-4' />
          ) : (
            <TrendingDown className='w-4 h-4' />
          )}
          <span>{trendValue}</span>
        </div>
      </div>

      <div className='text-2xl font-bold text-slate-900 dark:text-white mb-1'>
        {value}
      </div>

      <p className='text-sm text-slate-500'>{title}</p>
    </motion.div>
  );
};

// Utility functions
const formatTime = ms => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const formatMemory = bytes => {
  if (bytes < 1024) return `${bytes.toFixed(0)}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};

const getStatusIcon = score => {
  if (score >= 90) return <CheckCircle className='w-4 h-4 text-green-500' />;
  if (score >= 70) return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
  return <AlertTriangle className='w-4 h-4 text-red-500' />;
};

const getStatusColor = score => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export default MonitoringDashboard;
