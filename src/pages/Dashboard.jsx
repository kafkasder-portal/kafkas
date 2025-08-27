import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  Heart,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { beneficiariesService } from '../services/beneficiariesService';
import { donationsService } from '../services/donationsService';
import { hospitalReferralsService } from '../services/hospitalReferralsService';
import { handleError } from '../utils/errorHandler';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredChart, setHoveredChart] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    donations: { total: 0, monthly: 0, change: 0 },
    beneficiaries: { total: 0, active: 0, change: 0 },
    referrals: { total: 0, pending: 0, change: 0 },
    volunteers: { total: 0, active: 0, change: 0 },
  });

  // Fallback data for development mode
  const fallbackData = useMemo(() => ({
    donations: { total: 125000, monthly: 15000, change: 12.5 },
    beneficiaries: { total: 342, active: 298, change: 8.2 },
    referrals: { total: 156, pending: 23, change: -5.1 },
    volunteers: { total: 1247, active: 892, change: 8.2 },
  }), []);

  const recentActivities = [
    {
      id: 1,
      type: 'donation',
      title: 'Yeni Bağış Alındı',
      description: 'Ahmet Yılmaz tarafından ₺5,000 bağış',
      time: '2 saat önce',
      status: 'completed',
      amount: '₺5,000',
      priority: 'high',
    },
    {
      id: 2,
      type: 'beneficiary',
      title: 'Yeni Yardım Alanı',
      description: 'Fatma Demir kaydı oluşturuldu',
      time: '4 saat önce',
      status: 'pending',
      category: 'Acil Yardım',
      priority: 'high',
    },
    {
      id: 3,
      type: 'volunteer',
      title: 'Yeni Gönüllü',
      description: 'Mehmet Kaya sisteme katıldı',
      time: '6 saat önce',
      status: 'completed',
      location: 'İstanbul',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'referral',
      title: 'Hastane Referansı',
      description: 'Acıbadem Hastanesi referansı onaylandı',
      time: '8 saat önce',
      status: 'completed',
      hospital: 'Acıbadem',
      priority: 'low',
    },
    {
      id: 5,
      type: 'donation',
      title: 'Büyük Bağış',
      description: 'Anonim bağışçıdan ₺25,000 bağış',
      time: '1 gün önce',
      status: 'completed',
      amount: '₺25,000',
      priority: 'high',
    },
    {
      id: 6,
      type: 'beneficiary',
      title: 'Acil Yardım Talebi',
      description: 'Deprem bölgesinden acil yardım talebi',
      time: '1 gün önce',
      status: 'pending',
      category: 'Acil Yardım',
      priority: 'high',
    },
  ];

  const urgentTasks = [
    {
      id: 1,
      title: 'Acil yardım paketi dağıtımı',
      deadline: '2 saat',
      priority: 'high',
      assignee: 'Ahmet Yılmaz',
      progress: 75,
    },
    {
      id: 2,
      title: 'Gönüllü eğitimi tamamlama',
      deadline: '4 saat',
      priority: 'medium',
      assignee: 'Fatma Demir',
      progress: 60,
    },
    {
      id: 3,
      title: 'Finansal rapor hazırlama',
      deadline: '6 saat',
      priority: 'low',
      assignee: 'Mehmet Kaya',
      progress: 30,
    },
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      setLoading(true);
      
      // Development mode için fallback data kullan
      if (import.meta.env.DEV) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setDashboardData(fallbackData);
        setLastUpdate(new Date());
        setRefreshing(false);
        setLoading(false);
        return;
      }

      // Production'da gerçek API çağrıları
      const [donationsData, beneficiariesData, referralsData] = await Promise.all([
        donationsService.getTotalDonations(),
        beneficiariesService.getTotalBeneficiaries(),
        hospitalReferralsService.getTotalReferrals(),
      ]);

      setDashboardData({
        donations: donationsData,
        beneficiaries: beneficiariesData,
        referrals: referralsData,
        volunteers: { total: 1247, active: 892, change: 8.2 }, // Static data
      });
      setLastUpdate(new Date());
    } catch (error) {
      handleError(error, { 
        component: 'Dashboard', 
        action: 'fetchDashboardData' 
      });
      // Fallback data kullan
      setDashboardData(fallbackData);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [fallbackData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '128px', 
            height: '128px', 
            border: '3px solid rgba(255,255,255,0.3)', 
            borderTop: '3px solid white', 
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  const StatCard = ({ title, value, change, icon: Icon, type }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="stat-card"
    >
      <div className="stat-header">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className={`stat-icon ${type}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
        {change >= 0 ? (
          <TrendingUp size={16} />
        ) : (
          <TrendingDown size={16} />
        )}
        <span>
          {change >= 0 ? '+' : ''}{change}%
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>geçen aya göre</span>
      </div>
    </motion.div>
  );

  // PropTypes for StatCard
  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
    type: PropTypes.string.isRequired,
  };

  const ChartCard = ({ title, children, onMouseEnter, onMouseLeave }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: hoveredChart === title ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease'
      }}
    >
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#1f2937', 
        margin: '0 0 16px 0',
        textAlign: 'center'
      }}>
        {title}
      </h3>
      {children}
    </motion.div>
  );

  // PropTypes for ChartCard
  ChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };

  const UrgentTaskCard = ({ task }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="urgent-task-card"
    >
      <div className="urgent-task-header">
        <h4 className="urgent-task-title">
          {task.title}
        </h4>
        <span className={`urgent-task-priority ${task.priority}`}>
          {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
        </span>
      </div>
      <p className="urgent-task-assignee">
        Sorumlu: {task.assignee}
      </p>
      <div className="urgent-task-deadline">
        <Clock size={12} color="#dc2626" />
        <span className="urgent-task-deadline-text">
          {task.deadline} kaldı
        </span>
      </div>
      <div className="urgent-task-progress">
        <div className="urgent-task-progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${task.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="urgent-task-progress-fill"
          />
        </div>
        <span className="urgent-task-progress-text">
          {task.progress}%
        </span>
      </div>
    </motion.div>
  );

  // PropTypes for UrgentTaskCard
  UrgentTaskCard.propTypes = {
    task: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired,
      priority: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
      assignee: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
    }).isRequired,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-header"
      >
        <div>
          <h1 className="dashboard-title">
            KAF Portal Dashboard
          </h1>
          <p className="dashboard-subtitle">NGO Yönetim Sistemi Genel Bakış</p>
          <p className="dashboard-update-time">
            Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
          </p>
        </div>
        <div className="dashboard-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="refresh-btn"
          >
            <RefreshCw 
              size={16} 
              style={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none' 
              }} 
            />
            {refreshing ? 'Güncelleniyor...' : 'Yenile'}
          </motion.button>
          {import.meta.env.DEV && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: '1px solid var(--primary-color)'
              }}
            >
              🚧 Geliştirme Modu
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard
            title="Toplam Bağış"
            value={`₺${dashboardData.donations.total.toLocaleString()}`}
            change={dashboardData.donations.change}
            icon={DollarSign}
            type="donations"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard
            title="Yardım Alanlar"
            value={dashboardData.beneficiaries.total.toLocaleString()}
            change={dashboardData.beneficiaries.change}
            icon={Heart}
            type="beneficiaries"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <StatCard
            title="Gönüllüler"
            value={dashboardData.volunteers.total.toLocaleString()}
            change={dashboardData.volunteers.change}
            icon={Users}
            type="volunteers"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <StatCard
            title="Referanslar"
            value={dashboardData.referrals.total.toLocaleString()}
            change={dashboardData.referrals.change}
            icon={CheckCircle}
            type="referrals"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}
        >
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1f2937', 
            margin: '0 0 24px 0',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📊 Analiz Grafikleri
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Bağış Analizi */}
            <ChartCard 
              title="Bağış Analizi" 
              onMouseEnter={() => setHoveredChart('Bağış Analizi')}
              onMouseLeave={() => setHoveredChart(null)}
            >
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="250" height="180" style={{ margin: '0 auto' }}>
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  {/* Bağış Trendi - Animasyonlu çizgi grafik */}
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    points="20,120 50,80 80,100 110,60 140,70 170,40"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Hedef çizgisi */}
                  <line x1="20" y1="90" x2="170" y2="90" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" />
                  {/* Noktalar */}
                  <circle cx="20" cy="120" r="6" fill="#3B82F6" />
                  <circle cx="50" cy="80" r="6" fill="#3B82F6" />
                  <circle cx="80" cy="100" r="6" fill="#3B82F6" />
                  <circle cx="110" cy="60" r="6" fill="#3B82F6" />
                  <circle cx="140" cy="70" r="6" fill="#3B82F6" />
                  <circle cx="170" cy="40" r="6" fill="#3B82F6" />
                  {/* Legend */}
                  <text x="20" y="20" style={{ fontSize: '14px', fill: '#3B82F6', fontWeight: 'bold' }}>Bağışlar</text>
                  <text x="20" y="35" style={{ fontSize: '12px', fill: '#9ca3af' }}>Hedef</text>
                </svg>
              </div>
            </ChartCard>

            {/* Yardım Dağılımı */}
            <ChartCard 
              title="Yardım Dağılımı"
              onMouseEnter={() => setHoveredChart('Yardım Dağılımı')}
              onMouseLeave={() => setHoveredChart(null)}
            >
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="250" height="180" style={{ margin: '0 auto' }}>
                  {/* Pie Chart - Animasyonlu dilimler */}
                  <motion.circle
                    initial={{ strokeDasharray: "0 314" }}
                    animate={{ strokeDasharray: "157 314" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    cx="125" cy="90" r="60" fill="#3B82F6" 
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 314" }}
                    animate={{ strokeDasharray: "78.5 314" }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    cx="125" cy="90" r="60" fill="#10B981" stroke="#10B981" strokeWidth="30" strokeDashoffset="157" 
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 314" }}
                    animate={{ strokeDasharray: "62.8 314" }}
                    transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                    cx="125" cy="90" r="60" fill="#F59E0B" stroke="#F59E0B" strokeWidth="30" strokeDashoffset="235.5" 
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 314" }}
                    animate={{ strokeDasharray: "31.4 314" }}
                    transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
                    cx="125" cy="90" r="60" fill="#EF4444" stroke="#EF4444" strokeWidth="30" strokeDashoffset="298.3" 
                  />
                  {/* Legend */}
                  <rect x="20" y="20" width="12" height="12" fill="#3B82F6" rx="2" />
                  <text x="40" y="30" style={{ fontSize: '12px', fill: '#6b7280', fontWeight: '500' }}>Acil Yardım</text>
                  <rect x="20" y="40" width="12" height="12" fill="#10B981" rx="2" />
                  <text x="40" y="50" style={{ fontSize: '12px', fill: '#6b7280', fontWeight: '500' }}>Eğitim</text>
                  <rect x="20" y="60" width="12" height="12" fill="#F59E0B" rx="2" />
                  <text x="40" y="70" style={{ fontSize: '12px', fill: '#6b7280', fontWeight: '500' }}>Sağlık</text>
                  <rect x="20" y="80" width="12" height="12" fill="#EF4444" rx="2" />
                  <text x="40" y="90" style={{ fontSize: '12px', fill: '#6b7280', fontWeight: '500' }}>Gıda</text>
                </svg>
              </div>
            </ChartCard>
          </div>
        </motion.div>

        {/* Urgent Tasks Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertTriangle size={20} color="#dc2626" />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: 0 
            }}>
              Acil Görevler
            </h3>
          </div>
          {urgentTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <UrgentTaskCard task={task} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}
      >
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#1f2937', 
          margin: '0 0 24px 0',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📋 Son Aktiviteler
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{
                padding: '12px',
                borderRadius: '50%',
                background: activity.type === 'donation' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' :
                           activity.type === 'beneficiary' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                           activity.type === 'volunteer' ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' :
                           'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {activity.type === 'donation' && <DollarSign style={{ width: '20px', height: '20px', color: '#16a34a' }} />}
                {activity.type === 'beneficiary' && <Heart style={{ width: '20px', height: '20px', color: '#2563eb' }} />}
                {activity.type === 'volunteer' && <Users style={{ width: '20px', height: '20px', color: '#7c3aed' }} />}
                {activity.type === 'referral' && <CheckCircle style={{ width: '20px', height: '20px', color: '#ea580c' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                  {activity.title}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {activity.description}
                </p>
                {activity.amount && (
                  <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', margin: '4px 0 0 0' }}>
                    {activity.amount}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: activity.status === 'completed' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  color: activity.status === 'completed' ? '#166534' : '#92400e',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {activity.status === 'completed' ? '✅ Tamamlandı' : '⏳ Beklemede'}
                </span>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 0 0', fontWeight: '500' }}>
                  {activity.time}
                </p>
              </div>
              {activity.priority === 'high' && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#dc2626',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;
