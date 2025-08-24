// import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
// import { useRef } from 'react';

// Simple Chart Components (without external dependencies)

// Line Chart Component
export const LineChart = ({
  data,
  width = 400,
  height = 300,
  color = '#667eea',
}) => {
  // const svgRef = useRef(null) // Unused variable removed

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getX = index => padding + (index / (data.length - 1)) * chartWidth;
  const getY = value =>
    padding + (1 - (value - minValue) / (maxValue - minValue)) * chartHeight;

  const pathD = data.reduce((path, point, index) => {
    const x = getX(index);
    const y = getY(point.value);
    return path + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }, '');

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset='100%' style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
          <line
            key={ratio}
            x1={padding}
            y1={padding + ratio * chartHeight}
            x2={width - padding}
            y2={padding + ratio * chartHeight}
            stroke='#e2e8f0'
            strokeWidth='1'
            opacity='0.5'
          />
        ))}

        {/* Area fill */}
        <path
          d={`${pathD} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`}
          fill={`url(#${gradientId})`}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill='none'
          stroke={color}
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Data points */}
        {data.map((point, index) => (
          <motion.circle
            key={index}
            cx={getX(index)}
            cy={getY(point.value)}
            r='4'
            fill={color}
            stroke='white'
            strokeWidth='2'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({
  data,
  width = 400,
  height = 300,
  color = '#667eea',
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = (chartWidth / data.length) * 0.8;

  return (
    <svg width={width} height={height}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x =
          padding +
          index * (chartWidth / data.length) +
          (chartWidth / data.length - barWidth) / 2;
        const y = height - padding - barHeight;

        return (
          <motion.rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={color}
            rx='4'
            initial={{ height: 0, y: height - padding }}
            animate={{ height: barHeight, y }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            style={{ cursor: 'pointer' }}
          />
        );
      })}

      {/* Labels */}
      {data.map((item, index) => (
        <text
          key={`label-${index}`}
          x={
            padding +
            index * (chartWidth / data.length) +
            chartWidth / data.length / 2
          }
          y={height - padding + 20}
          textAnchor='middle'
          fontSize='12'
          fill='#6b7280'
        >
          {item.label}
        </text>
      ))}
    </svg>
  );
};

// Donut Chart Component
export const DonutChart = ({ data, size = 200, thickness = 40 }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = center - thickness / 2;
  let cumulativePercentage = 0;

  const colors = [
    '#667eea',
    '#f093fb',
    '#4facfe',
    '#43e97b',
    '#fa709a',
    '#fee140',
  ];

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = (cumulativePercentage / 100) * 360 - 90;
          const endAngle = startAngle + angle;

          const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

          const largeArc = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');

          cumulativePercentage += percentage;

          return (
            <motion.path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Center hole */}
        <circle cx={center} cy={center} r={radius - thickness} fill='white' />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}
        >
          {total.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Toplam</div>
      </div>
    </div>
  );
};

// Analytics Card Component
export const AnalyticsCard = ({
  title,
  value,
  change,
  icon: IconComponent,
  color = '#667eea',
  trend = 'up',
  subtitle,
  className = '',
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? '#10b981' : '#ef4444';

  return (
    <motion.div
      className={`analytics-card ${className}`}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100px',
          height: '100px',
          backgroundColor: `${color}10`,
          borderRadius: '50%',
          opacity: 0.6,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                margin: '0 0 0.5rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
              }}
            >
              {title}
            </h4>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1a202c',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: `${color}15`,
            }}
          >
            <IconComponent size={24} color={color} />
          </div>
        </div>

        {change !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '20px',
                backgroundColor: `${trendColor}15`,
                color: trendColor,
              }}
            >
              <TrendIcon size={14} />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {Math.abs(change)}%
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              önceki aya göre
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Dashboard Analytics Grid
export const AnalyticsDashboard = ({ data }) => {
  // Varsayılan veriler
  const defaultData = {
    totalDonations: { value: 0, change: 0, trend: 'up' },
    activeDonors: { value: 0, change: 0, trend: 'up' },
    pendingTasks: { value: 0, change: 0, trend: 'up' },
    completedProjects: { value: 0, change: 0, trend: 'up' },
  };

  const analyticsData = data || defaultData;

  const formatValue = (value, type = 'number') => {
    if (type === 'currency') {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const formatChange = change => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className='analytics-dashboard'>
      <div className='analytics-grid'>
        <AnalyticsCard
          title='Toplam Bağış'
          value={formatValue(analyticsData.totalDonations.value, 'currency')}
          change={formatChange(analyticsData.totalDonations.change)}
          trend={analyticsData.totalDonations.trend}
          icon={TrendingUp}
          color='#10b981'
        />
        <AnalyticsCard
          title='Aktif Bağışçı'
          value={formatValue(analyticsData.activeDonors.value)}
          change={formatChange(analyticsData.activeDonors.change)}
          trend={analyticsData.activeDonors.trend}
          icon={Users}
          color='#3b82f6'
        />
        <AnalyticsCard
          title='Bekleyen Görev'
          value={formatValue(analyticsData.pendingTasks.value)}
          change={formatChange(analyticsData.pendingTasks.change)}
          trend={analyticsData.pendingTasks.trend}
          icon={Clock}
          color='#f59e0b'
        />
        <AnalyticsCard
          title='Tamamlanan Proje'
          value={formatValue(analyticsData.completedProjects.value)}
          change={formatChange(analyticsData.completedProjects.change)}
          trend={analyticsData.completedProjects.trend}
          icon={CheckCircle}
          color='#8b5cf6'
        />
      </div>
    </div>
  );
};

// Chart Container with loading state
export const ChartContainer = ({
  title,
  children,
  loading = false,
  actions,
  className = '',
}) => {
  return (
    <motion.div
      className={`chart-container ${className}`}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1a202c',
            margin: 0,
          }}
        >
          {title}
        </h3>
        {actions && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>
        )}
      </div>

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            color: '#6b7280',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Activity size={32} />
          </motion.div>
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default {
  LineChart,
  BarChart,
  DonutChart,
  AnalyticsCard,
  AnalyticsDashboard,
  ChartContainer,
};
