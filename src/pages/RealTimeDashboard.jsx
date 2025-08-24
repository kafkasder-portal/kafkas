import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Circle,
  Heart,
  Maximize2,
  MessageSquare,
  Minimize2,
  Pause,
  Play,
  Target,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const RealTimeDashboard = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  // Simulated WebSocket connection
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        updateLiveData();
        checkForNotifications();
        setLastUpdate(new Date());
      }, 2000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const updateLiveData = () => {
    setLiveData(prev => ({
      activeUsers: Math.max(
        1,
        (prev.activeUsers || 50) + Math.floor(Math.random() * 10 - 5)
      ),
      donations: (prev.donations || 125000) + Math.floor(Math.random() * 5000),
      volunteers: Math.max(
        0,
        (prev.volunteers || 25) + Math.floor(Math.random() * 3 - 1)
      ),
      tasks: Math.max(
        0,
        (prev.tasks || 15) + Math.floor(Math.random() * 2 - 1)
      ),
      events: Math.max(0, (prev.events || 3) + Math.floor(Math.random() * 1)),
      serverLoad: Math.min(
        100,
        Math.max(
          0,
          (prev.serverLoad || 35) + Math.floor(Math.random() * 10 - 5)
        )
      ),
      responseTime: Math.max(
        10,
        (prev.responseTime || 150) + Math.floor(Math.random() * 50 - 25)
      ),
    }));
  };

  const checkForNotifications = () => {
    const chance = Math.random();
    if (chance < 0.3) {
      const notificationTypes = [
        {
          type: 'success',
          icon: CheckCircle,
          message: 'Yeni bağış alındı',
          color: '#10b981',
        },
        {
          type: 'warning',
          icon: AlertCircle,
          message: 'Sistem yükü artıyor',
          color: '#f59e0b',
        },
        {
          type: 'info',
          icon: Bell,
          message: 'Yeni gönüllü kaydı',
          color: '#3b82f6',
        },
        {
          type: 'error',
          icon: AlertCircle,
          message: 'Bağlantı sorunu tespit edildi',
          color: '#ef4444',
        },
      ];

      const notification =
        notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const newNotification = {
        id: Date.now(),
        ...notification,
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  };

  const StatusIndicator = ({ status, label }) => {
    const colors = {
      online: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <motion.div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors[status] || '#6b7280',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{label}</span>
      </div>
    );
  };

  const LiveMetricCard = ({
    title,
    value,
    unit,
    trend,
    color,
    icon: Icon,
    status,
  }) => {
    const getTrendColor = () => {
      if (trend > 0) return '#10b981';
      if (trend < 0) return '#ef4444';
      return '#6b7280';
    };

    return (
      <motion.div
        className='card'
        style={{
          background: 'white',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderLeft: `4px solid ${color}`,
        }}
        whileHover={{ y: -2 }}
        layout
      >
        {/* Animated background */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${color}20, ${color}05)`,
            borderRadius: '50%',
            transform: 'translate(20px, -20px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {title}
              </h3>
              <StatusIndicator
                status={status}
                label={status === 'online' ? 'Aktif' : 'Uyarı'}
              />
            </div>
            <Icon size={20} color={color} />
          </div>

          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1a202c',
              marginBottom: '0.5rem',
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
            <span
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginLeft: '0.25rem',
              }}
            >
              {unit}
            </span>
          </motion.div>

          {trend !== 0 && (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <TrendingUp
                size={14}
                color={getTrendColor()}
                style={{
                  transform: trend < 0 ? 'rotate(180deg)' : 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: getTrendColor() }}>
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const NotificationItem = ({ notification }) => {
    const Icon = notification.icon;

    return (
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 0.8 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          backgroundColor: `${notification.color}10`,
          borderLeft: `3px solid ${notification.color}`,
          borderRadius: '8px',
          marginBottom: '0.5rem',
        }}
      >
        <Icon size={16} color={notification.color} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
            {notification.message}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {notification.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </motion.div>
    );
  };

  const ActivityFeed = () => {
    const activities = [
      {
        id: 1,
        user: 'Ahmet Y.',
        action: 'yeni bağış ekledi',
        time: '2 dk önce',
        type: 'donation',
      },
      {
        id: 2,
        user: 'Fatma K.',
        action: 'görevi tamamladı',
        time: '5 dk önce',
        type: 'task',
      },
      {
        id: 3,
        user: 'Mehmet S.',
        action: 'etkinliğe katıldı',
        time: '8 dk önce',
        type: 'event',
      },
      {
        id: 4,
        user: 'Ayşe D.',
        action: 'yorum ekledi',
        time: '12 dk önce',
        type: 'comment',
      },
    ];

    const getActivityIcon = type => {
      const icons = {
        donation: Heart,
        task: Target,
        event: Calendar,
        comment: MessageSquare,
      };
      return icons[type] || Activity;
    };

    const getActivityColor = type => {
      const colors = {
        donation: '#10b981',
        task: '#f59e0b',
        event: '#3b82f6',
        comment: '#8b5cf6',
      };
      return colors[type] || '#6b7280';
    };

    return (
      <div className='card' style={{ height: '400px', overflowY: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1,
          }}
        >
          <Activity size={18} color='#667eea' />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
            Canlı Aktivite
          </h3>
        </div>

        <AnimatePresence>
          {activities.map(activity => {
            const Icon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  position: 'relative',
                }}
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <div
                  style={{
                    padding: '0.5rem',
                    backgroundColor: `${getActivityColor(activity.type)}15`,
                    borderRadius: '8px',
                  }}
                >
                  <Icon size={14} color={getActivityColor(activity.type)} />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#374151',
                    }}
                  >
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {activity.time}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  const SystemHealth = () => {
    const healthMetrics = [
      {
        name: 'CPU Kullanımı',
        value: liveData.serverLoad || 35,
        max: 100,
        color: '#3b82f6',
      },
      { name: 'Bellek', value: 68, max: 100, color: '#10b981' },
      { name: 'Disk', value: 45, max: 100, color: '#f59e0b' },
      { name: 'Network', value: 23, max: 100, color: '#8b5cf6' },
    ];

    return (
      <div className='card'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <Zap size={18} color='#667eea' />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
            Sistem Sağlığı
          </h3>
        </div>

        {healthMetrics.map((metric, index) => (
          <div key={metric.name} style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                {metric.name}
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: metric.color,
                }}
              >
                {metric.value}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: metric.color,
                  borderRadius: '3px',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#10b98115',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={16} color='#10b981' />
          <span style={{ fontSize: '0.875rem', color: '#059669' }}>
            Tüm sistemler normal çalışıyor
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className='page-container' style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        className='page-header'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isConnected ? (
              <Wifi size={20} color='#10b981' />
            ) : (
              <WifiOff size={20} color='#ef4444' />
            )}
            <div>
              <h1 className='page-title'>Canlı Dashboard</h1>
              <p className='page-subtitle'>
                Son güncelleme: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: isPaused ? '#10b981' : '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Başlat' : 'Durdur'}
          </motion.button>

          <motion.button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              padding: '0.75rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Live Notifications */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              zIndex: 1000,
              width: '300px',
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <LiveMetricCard
          title='Aktif Kullanıcılar'
          value={liveData.activeUsers || 0}
          unit=''
          trend={2.5}
          color='#3b82f6'
          icon={Users}
          status='online'
        />
        <LiveMetricCard
          title='Toplam Bağışlar'
          value={liveData.donations || 0}
          unit='₺'
          trend={5.2}
          color='#10b981'
          icon={Heart}
          status='online'
        />
        <LiveMetricCard
          title='Aktif Gönüllüler'
          value={liveData.volunteers || 0}
          unit=''
          trend={-1.2}
          color='#f59e0b'
          icon={Users}
          status='warning'
        />
        <LiveMetricCard
          title='Yanıt Süresi'
          value={liveData.responseTime || 0}
          unit='ms'
          trend={-3.1}
          color='#8b5cf6'
          icon={Zap}
          status='online'
        />
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <ActivityFeed />
        <SystemHealth />
      </div>

      {/* Connection Status Bar */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          backgroundColor: isConnected ? '#10b981' : '#ef4444',
          color: 'white',
          borderRadius: '24px',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000,
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Circle size={8} />
        {isConnected ? 'Bağlantı Aktif' : 'Bağlantı Kesildi'}
      </motion.div>
    </div>
  );
};

export default RealTimeDashboard;
