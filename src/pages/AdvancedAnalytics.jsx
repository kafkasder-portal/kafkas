import { motion } from 'framer-motion'
import {
  Award,
  Calendar,
  Coins,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Package,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'

const AdvancedAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [selectedMetrics, setSelectedMetrics] = useState(['donations', 'volunteers', 'tasks'])
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)

  const timeRanges = [
    { id: '24h', label: 'Son 24 Saat' },
    { id: '7d', label: 'Son 7 Gün' },
    { id: '30d', label: 'Son 30 Gün' },
    { id: '90d', label: 'Son 3 Ay' },
    { id: '1y', label: 'Son 1 Yıl' }
  ]

  const metrics = [
    { id: 'donations', label: 'Bağışlar', icon: Coins, color: '#10b981' },
    { id: 'volunteers', label: 'Gönüllüler', icon: Users, color: '#3b82f6' },
    { id: 'tasks', label: 'Görevler', icon: Target, color: '#f59e0b' },
    { id: 'inventory', label: 'Envanter', icon: Package, color: '#8b5cf6' },
    { id: 'events', label: 'Etkinlikler', icon: Calendar, color: '#ef4444' },
    { id: 'performance', label: 'Performans', icon: Award, color: '#06b6d4' }
  ]

  // Mock analytics data
  const generateMockData = (timeRange) => {
    const periods = {
      '24h': 24,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 12
    }

    const period = periods[timeRange] || 7
    const data = []

    for (let i = period - 1; i >= 0; i--) {
      const date = new Date()
      if (timeRange === '24h') {
        date.setHours(date.getHours() - i)
      } else if (timeRange === '1y') {
        date.setMonth(date.getMonth() - i)
      } else {
        date.setDate(date.getDate() - i)
      }

      data.push({
        date: date.toISOString().split('T')[0],
        donations: Math.floor(Math.random() * 50000) + 10000,
        volunteers: Math.floor(Math.random() * 100) + 20,
        tasks: Math.floor(Math.random() * 50) + 10,
        inventory: Math.floor(Math.random() * 1000) + 200,
        events: Math.floor(Math.random() * 10) + 1,
        performance: Math.floor(Math.random() * 100) + 60
      })
    }

    return data
  }

  const loadData = async (timeRange) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newData = generateMockData(timeRange)
    setData(newData)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(selectedTimeRange)
  }, [selectedTimeRange])

  const calculateTrend = (data, metric) => {
    if (!data || data.length < 2) return { value: 0, trend: 'neutral' }
    
    const current = data[data.length - 1][metric]
    const previous = data[data.length - 2][metric]
    const change = ((current - previous) / previous) * 100
    
    return {
      value: Math.abs(change).toFixed(1),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    }
  }

  const MetricCard = ({ metric, data }) => {
    const Icon = metric.icon
    const trend = calculateTrend(data, metric.id)
    const currentValue = data?.[data.length - 1]?.[metric.id] || 0
    const TrendIcon = trend.trend === 'up' ? TrendingUp : TrendingDown

    return (
      <motion.div
        className="card"
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
        whileHover={{ 
          y: -4,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            backgroundColor: `${metric.color}10`,
            borderRadius: '50%'
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: `${metric.color}15`,
                borderRadius: '12px'
              }}
            >
              <Icon size={20} color={metric.color} />
            </div>
            <motion.button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px'
              }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
            >
              <MoreVertical size={16} color="#6b7280" />
            </motion.button>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
              }}
            >
              {metric.label}
            </h3>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1a202c',
                margin: '0.25rem 0'
              }}
            >
              {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: trend.trend === 'up' ? '#10b98115' : '#ef444415',
                borderRadius: '12px',
                color: trend.trend === 'up' ? '#10b981' : '#ef4444'
              }}
            >
              <TrendIcon size={12} />
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                {trend.value}%
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              önceki periyoda göre
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  const SimpleLineChart = ({ data, metric, color }) => {
    if (!data || data.length === 0) return null

    const values = data.map(d => d[metric])
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    
    const width = 400
    const height = 200
    const padding = 40

    const getX = (index) => padding + (index / (data.length - 1)) * (width - padding * 2)
    const getY = (value) => padding + (1 - (value - minValue) / (maxValue - minValue)) * (height - padding * 2)

    const pathD = data.reduce((path, point, index) => {
      const x = getX(index)
      const y = getY(point[metric])
      return path + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`)
    }, '')

    return (
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * (height - padding * 2)}
              x2={width - padding}
              y2={padding + ratio * (height - padding * 2)}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path
            d={`${pathD} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`}
            fill={`url(#gradient-${metric})`}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Data points */}
          {data.map((point, index) => (
            <motion.circle
              key={index}
              cx={getX(index)}
              cy={getY(point[metric])}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>

        {/* Y-axis labels */}
        <div style={{ position: 'absolute', left: 0, top: padding, height: height - padding * 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{maxValue.toLocaleString()}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{((maxValue + minValue) / 2).toLocaleString()}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{minValue.toLocaleString()}</span>
        </div>
      </div>
    )
  }

  const HeatmapCalendar = ({ data }) => {
    const today = new Date()
    const days = []
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayData = data?.find(d => d.date === date.toISOString().split('T')[0])
      const intensity = dayData ? Math.min(dayData.donations / 50000, 1) : 0
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.getDay(),
        week: Math.floor(i / 7),
        intensity
      })
    }

    return (
      <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
          Yıllık Aktivite Haritası
        </h4>
        <svg width="800" height="120" style={{ overflow: 'visible' }}>
          {days.map((day, index) => {
            const x = Math.floor(index / 7) * 12
            const y = (index % 7) * 12
            const opacity = Math.max(day.intensity * 0.8 + 0.1, 0.1)
            
            return (
              <motion.rect
                key={day.date}
                x={x}
                y={y}
                width="10"
                height="10"
                rx="2"
                fill="#10b981"
                fillOpacity={opacity}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.001 }}
                style={{ cursor: 'pointer' }}
              />
            )
          })}
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Az</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(opacity => (
              <div
                key={opacity}
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#10b981',
                  opacity,
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Çok</span>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">İleri Seviye Analytics</h1>
          <p className="page-subtitle">Detaylı veri analizi ve performans metrikleri</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={() => loadData(selectedTimeRange)}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: isLoading ? '#e2e8f0' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <RefreshCw size={16} />
            </motion.div>
            {isLoading ? 'Yükleniyor...' : 'Yenile'}
          </motion.button>
          
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div 
        className="card"
        style={{ marginBottom: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={18} color="#6b7280" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Zaman Aralığı</h3>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {timeRanges.map((range) => (
            <motion.button
              key={range.id}
              onClick={() => setSelectedTimeRange(range.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedTimeRange === range.id ? '#667eea' : 'transparent',
                color: selectedTimeRange === range.id ? 'white' : '#6b7280',
                border: `1px solid ${selectedTimeRange === range.id ? '#667eea' : '#d1d5db'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {metrics.filter(metric => selectedMetrics.includes(metric.id)).map((metric) => (
          <MetricCard key={metric.id} metric={metric} data={data} />
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
              Trend Analizi
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                style={{
                  padding: '0.25rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                whileHover={{ backgroundColor: '#e5e7eb' }}
              >
                <Eye size={14} />
              </motion.button>
            </div>
          </div>
          
          {data && (
            <SimpleLineChart 
              data={data} 
              metric="donations" 
              color="#10b981"
            />
          )}
        </motion.div>

        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Performans Skoru
          </h3>
          
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <motion.div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #10b981 0deg 252deg, #e5e7eb 252deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                position: 'relative'
              }}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#10b981'
                }}
              >
                87%
              </div>
            </motion.div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Genel performans skoru
            </p>
          </div>
        </motion.div>
      </div>

      {/* Heatmap Calendar */}
      {data && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <HeatmapCalendar data={data} />
        </motion.div>
      )}
    </div>
  )
}

export default AdvancedAnalytics
