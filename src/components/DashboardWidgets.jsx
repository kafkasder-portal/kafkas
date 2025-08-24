import { AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Coins,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const QuickStatsWidget = ({ data, loading: externalLoading }) => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    pendingRequests: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (data) {
      setStats({
        totalDonations: data.donations?.total || 0,
        activeDonors: data.volunteers?.active || 0,
        pendingRequests: data.referrals?.pending || 0,
        completedProjects: data.beneficiaries?.total || 0,
      });
      setLoading(false);
    }
  }, [data]);

  const isLoading = externalLoading || loading;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const formatCurrency = value => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = value => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  if (isLoading) {
    return (
      <div className='quick-stats-widget loading'>
        <div className='widget-header'>
          <h3>Hızlı İstatistikler</h3>
          <div className='loading-spinner'></div>
        </div>
        <div className='stats-grid'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='stat-item loading'>
              <div className='stat-skeleton'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className='quick-stats-widget'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='widget-header'>
        <h3>Hızlı İstatistikler</h3>
        <button
          className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className='stats-grid'>
        <div className='stat-item'>
          <div className='stat-icon donations'>
            <Coins size={24} />
          </div>
          <div className='stat-content'>
            <div className='stat-value'>
              {formatCurrency(stats.totalDonations)}
            </div>
            <div className='stat-label'>Toplam Bağış</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon donors'>
            <Users size={24} />
          </div>
          <div className='stat-content'>
            <div className='stat-value'>{formatNumber(stats.activeDonors)}</div>
            <div className='stat-label'>Aktif Bağışçı</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon requests'>
            <AlertTriangle size={24} />
          </div>
          <div className='stat-content'>
            <div className='stat-value'>
              {formatNumber(stats.pendingRequests)}
            </div>
            <div className='stat-label'>Bekleyen İstek</div>
          </div>
        </div>

        <div className='stat-item'>
          <div className='stat-icon projects'>
            <CheckCircle size={24} />
          </div>
          <div className='stat-content'>
            <div className='stat-value'>
              {formatNumber(stats.completedProjects)}
            </div>
            <div className='stat-label'>Tamamlanan Proje</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionsWidget = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Yeni Bağışçı',
      icon: Users,
      color: '#10b981',
      path: '/donors?action=create',
    },
    {
      id: 2,
      title: 'Bağış Ekle',
      icon: Coins,
      color: '#3b82f6',
      path: '/donations?action=create',
    },
    {
      id: 3,
      title: 'Görev Oluştur',
      icon: Target,
      color: '#f59e0b',
      path: '/tasks?action=create',
    },
    {
      id: 4,
      title: 'Toplantı Planla',
      icon: Calendar,
      color: '#8b5cf6',
      path: '/meetings?action=create',
    },
  ];

  const handleQuickAction = action => {
    // Navigate or trigger action
  };

  return (
    <div className='card'>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1a202c',
          marginBottom: '1.5rem',
        }}
      >
        Hızlı İşlemler
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
        }}
      >
        {quickActions.map(action => (
          <motion.button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            className='btn-smooth'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
            whileHover={{
              borderColor: action.color,
              backgroundColor: `${action.color}05`,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: `${action.color}15`,
              }}
            >
              <action.icon size={20} color={action.color} />
            </div>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1a202c',
              }}
            >
              {action.title}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const SystemHealthWidget = () => {
  const [healthData, setHealthData] = useState({
    cpu: 45,
    memory: 62,
    storage: 78,
    network: 89,
  });

  const getHealthColor = value => {
    if (value < 50) return '#10b981';
    if (value < 80) return '#f59e0b';
    return '#ef4444';
  };

  const HealthBar = ({ label, value, unit = '%' }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <span
          style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: getHealthColor(value),
          }}
        >
          {value}
          {unit}
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
            backgroundColor: getHealthColor(value),
            borderRadius: '3px',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );

  return (
    <div className='card'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a202c',
            margin: 0,
          }}
        >
          Sistem Durumu
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#10b98115',
            borderRadius: '20px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
            }}
          />
          <span
            style={{ fontSize: '0.75rem', fontWeight: '500', color: '#10b981' }}
          >
            Çevrimiçi
          </span>
        </div>
      </div>

      <HealthBar label='CPU Kullanımı' value={healthData.cpu} />
      <HealthBar label='Bellek' value={healthData.memory} />
      <HealthBar label='Depolama' value={healthData.storage} />
      <HealthBar label='Ağ' value={healthData.network} />
    </div>
  );
};

export { QuickActionsWidget, QuickStatsWidget, SystemHealthWidget };

// Combined Dashboard Widgets Component
const DashboardWidgets = ({ data, loading }) => {
  return (
    <div className='dashboard-widgets'>
      <div className='widgets-grid'>
        <QuickStatsWidget data={data} loading={loading} />
        <QuickActionsWidget />
        <SystemHealthWidget />
      </div>
    </div>
  );
};

export default DashboardWidgets;
