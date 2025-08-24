import { motion } from 'framer-motion';
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Clock,
  MessageCircle,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';



import { beneficiariesService } from '../services/beneficiariesService';
import { donationsService } from '../services/donationsService';
import { hospitalReferralsService } from '../services/hospitalReferralsService';

const Dashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    donations: { total: 0, monthly: 0, change: 0 },
    beneficiaries: { total: 0, active: 0, change: 0 },
    referrals: { total: 0, pending: 0, change: 0 },
    volunteers: { total: 0, active: 0, change: 0 },
  });


  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Paralel olarak tüm verileri yükle
      const [donationStats, beneficiaryStats, referralStats] =
        await Promise.all([
          donationsService.getDonationStats(),
          beneficiariesService.getBeneficiaryStats(),
          hospitalReferralsService.getReferralStats(),
        ]);

      setDashboardData({
        donations: donationStats,
        beneficiaries: beneficiaryStats,
        referrals: referralStats,
        volunteers: { total: 1247, active: 892, change: 8.2 }, // Mock data for now
      });


    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingTasks = [
    {
      id: 1,
      title: 'Bağış raporunu hazırla',
      deadline: t('dashboard.upcomingTasks.today', { time: '17:00' }),
      priority: 'high',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Gönüllü eğitimi düzenle',
      deadline: t('dashboard.upcomingTasks.tomorrow', { time: '10:00' }),
      priority: 'medium',
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'Stok sayımı yap',
      deadline: t('dashboard.upcomingTasks.inDays', { days: 3 }),
      priority: 'low',
      status: 'pending',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const getPriorityLabel = priority => {
    switch (priority) {
      case 'high':
        return t('dashboard.upcomingTasks.high');
      case 'medium':
        return t('dashboard.upcomingTasks.medium');
      case 'low':
        return t('dashboard.upcomingTasks.low');
      default:
        return priority;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      case 'pending':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <motion.div
      className='page-container'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div className='page-header' variants={itemVariants}>
        <h1 className='page-title'>{t('dashboard.title')}</h1>
        <p className='page-subtitle'>{t('dashboard.subtitle')}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
        <motion.div variants={itemVariants}>
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Toplam Bağış</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ₺{dashboardData.donations.total.toLocaleString()}
                </p>
              </div>
              <div className='p-2 bg-green-100 rounded-full'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Yardım Alanlar</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {dashboardData.beneficiaries.total}
                </p>
              </div>
              <div className='p-2 bg-blue-100 rounded-full'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Gönüllüler</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {dashboardData.volunteers.total}
                </p>
              </div>
              <div className='p-2 bg-purple-100 rounded-full'>
                <Users className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Referanslar</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {dashboardData.referrals.total}
                </p>
              </div>
              <div className='p-2 bg-orange-100 rounded-full'>
                <AlertCircle className='h-6 w-6 text-orange-600' />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Suggestions & Collaboration Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
        <motion.div variants={itemVariants}>

        </motion.div>

        <motion.div variants={itemVariants}>
          
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div className='mt-8' variants={itemVariants}>
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Hızlı İşlemler
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors'
            >
              <Brain className='h-8 w-8 text-blue-600 mb-2' />
              <span className='text-sm font-medium text-gray-900'>
                AI Analiz
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors'
            >
              <Users className='h-8 w-8 text-green-600 mb-2' />
              <span className='text-sm font-medium text-gray-900'>
                Toplantı
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors'
            >
              <MessageCircle className='h-8 w-8 text-purple-600 mb-2' />
              <span className='text-sm font-medium text-gray-900'>Mesaj</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors'
            >
              <Zap className='h-8 w-8 text-orange-600 mb-2' />
              <span className='text-sm font-medium text-gray-900'>Rapor</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: '2rem' }}>
        {/* Yaklaşan Görevler */}
        <motion.div className='card' variants={itemVariants}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '1.5rem',
            }}
          >
            {t('dashboard.upcomingTasks.title')}
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {upcomingTasks.map((task, index) => {
              const StatusIcon = getStatusIcon(task.status);
              return (
                <motion.div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        margin: '0 0 0.25rem 0',
                      }}
                    >
                      {task.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#64748b',
                        margin: 0,
                      }}
                    >
                      {task.deadline}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: getPriorityColor(task.priority),
                        backgroundColor: `${getPriorityColor(task.priority)}15`,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                      }}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                    <StatusIcon
                      size={16}
                      color={getPriorityColor(task.priority)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
