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

// Design System Imports
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  AppShell,
  Page 
} from '../ui';
import { iconSize } from '../design-system/design-tokens';

import { beneficiariesService } from '../services/beneficiariesService';
import { donationsService } from '../services/donationsService';
import { hospitalReferralsService } from '../services/hospitalReferralsService';
import { handleError } from '../utils/errorHandler';

/**
 * StatsCard Component - Redesigned with design system
 */
const StatsCard = ({ icon: Icon, title, value, change, trend, loading = false }) => {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
                {title}
              </p>
              <div className="flex items-baseline space-x-2">
                {loading ? (
                  <div className="h-8 w-24 bg-muted-200 animate-pulse rounded" />
                ) : (
                  <h3 className="text-2xl font-bold text-foreground">
                    {value}
                  </h3>
                )}
                {!loading && change !== 0 && (
                  <div className={`flex items-center text-xs font-medium ${
                    isPositive ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    <TrendIcon size={iconSize.xs} className="mr-1" />
                    %{Math.abs(change)}
                  </div>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-full ${
              loading 
                ? 'bg-muted-200 animate-pulse' 
                : 'bg-brand-50'
            }`}>
              {loading ? (
                <div className="w-6 h-6" />
              ) : (
                <Icon size={iconSize.lg} className="text-brand-600" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * ActivityCard Component - Redesigned for recent activities
 */
const ActivityCard = ({ activity }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-50';
      case 'pending': return 'text-warning-600 bg-warning-50';
      case 'urgent': return 'text-danger-600 bg-danger-50';
      default: return 'text-muted-600 bg-muted-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted-50 transition-colors"
    >
      <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
        {activity.type === 'donation' && <Heart size={iconSize.sm} />}
        {activity.type === 'beneficiary' && <Users size={iconSize.sm} />}
        {activity.type === 'referral' && <CheckCircle size={iconSize.sm} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {activity.title}
        </p>
        <p className="text-xs text-foreground-muted">
          {activity.description}
        </p>
      </div>
      
      <div className="text-right space-y-1">
        <p className="text-xs text-foreground-muted">
          {activity.time}
        </p>
        {activity.amount && (
          <p className="text-xs font-semibold text-brand-600">
            {activity.amount}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/**
 * TaskCard Component - Redesigned for urgent tasks
 */
const TaskCard = ({ task }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-600';
      case 'medium': return 'text-warning-600';
      case 'low': return 'text-success-600';
      default: return 'text-muted-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground mb-1">
            {task.title}
          </h4>
          <p className="text-xs text-foreground-muted">
            Atanan: {task.assignee}
          </p>
        </div>
        
        <div className="flex items-center text-xs space-x-2">
          <Clock size={iconSize.xs} className="text-muted-500" />
          <span className="text-foreground-muted">{task.deadline}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority === 'high' && 'Yüksek'}
            {task.priority === 'medium' && 'Orta'}
            {task.priority === 'low' && 'Düşük'}
          </span>
          <span className="text-foreground-muted">%{task.progress}</span>
        </div>
        
        <div className="w-full bg-muted-200 rounded-full h-2">
          <div 
            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
    },
    {
      id: 2,
      type: 'beneficiary',
      title: 'Yeni Yararlanan Eklendi',
      description: 'Fatma Demir sisteme kayıt edildi',
      time: '4 saat önce',
      status: 'pending',
    },
    {
      id: 3,
      type: 'referral',
      title: 'Hastane Sevki Tamamlandı',
      description: 'Mehmet Kaya sevki onaylandı',
      time: '6 saat önce',
      status: 'completed',
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
      
      // Development mode için fallback data kullan
      if (import.meta.env.DEV) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setDashboardData(fallbackData);
        setLastUpdate(new Date());
        return;
      }

      // Production'da gerçek API çağrıları
      const [donationsData, beneficiariesData, referralsData] = await Promise.all([
        donationsService.getTotalDonations(),
        beneficiariesService.getAllBeneficiaries(),
        hospitalReferralsService.getAllReferrals(),
      ]);

      setDashboardData({
        donations: {
          total: donationsData.reduce((sum, d) => sum + d.amount, 0),
          monthly: donationsData.filter(d => 
            new Date(d.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).reduce((sum, d) => sum + d.amount, 0),
          change: 12.5,
        },
        beneficiaries: {
          total: beneficiariesData.length,
          active: beneficiariesData.filter(b => b.status === 'active').length,
          change: 8.2,
        },
        referrals: {
          total: referralsData.length,
          pending: referralsData.filter(r => r.status === 'pending').length,
          change: -5.1,
        },
        volunteers: {
          total: 1247,
          active: 892,
          change: 8.2,
        },
      });
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Dashboard veri yüklenirken hata:', error);
      handleError(error, 'Dashboard verisi yüklenemedi');
      setDashboardData(fallbackData);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [fallbackData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <Page
      title="Dashboard"
      description="Platform genelindeki verilerin özeti ve son aktiviteler"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          leftIcon={<RefreshCw size={iconSize.sm} className={refreshing ? 'animate-spin' : ''} />}
        >
          Yenile
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={DollarSign}
          title="Toplam Bağış"
          value={`₺${dashboardData.donations.total.toLocaleString()}`}
          change={dashboardData.donations.change}
          loading={loading}
        />
        <StatsCard
          icon={Users}
          title="Toplam Yararlanan"
          value={dashboardData.beneficiaries.total.toLocaleString()}
          change={dashboardData.beneficiaries.change}
          loading={loading}
        />
        <StatsCard
          icon={Heart}
          title="Hastane Sevkleri"
          value={dashboardData.referrals.total.toLocaleString()}
          change={dashboardData.referrals.change}
          loading={loading}
        />
        <StatsCard
          icon={CheckCircle}
          title="Aktif Gönüllü"
          value={dashboardData.volunteers.active.toLocaleString()}
          change={dashboardData.volunteers.change}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>
                Platform üzerindeki son işlemler ve güncellemeler
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Tasks */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acil Görevler</CardTitle>
                  <CardDescription>
                    Öncelikli olarak tamamlanması gereken görevler
                  </CardDescription>
                </div>
                <AlertTriangle size={iconSize.md} className="text-danger-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Last Update Info */}
      <div className="flex items-center justify-center text-xs text-foreground-muted">
        <Clock size={iconSize.xs} className="mr-1" />
        Son güncelleme: {lastUpdate.toLocaleString('tr-TR')}
      </div>
    </Page>
  );
};

export default Dashboard;
