import { motion } from 'framer-motion'
import {
  Activity,
  DollarSign,
  Download,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(false)
  const [analyticsData] = useState({
    overview: {
      totalDonations: 1250000,
      totalBeneficiaries: 2847,
      activeVolunteers: 892,
      monthlyGrowth: 12.5
    },
    trends: {
      donations: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 85000],
      beneficiaries: [120, 135, 142, 158, 167, 189, 201, 215, 228, 245, 267, 284],
      volunteers: [45, 52, 58, 64, 71, 78, 85, 92, 98, 105, 112, 118]
    },
    demographics: {
      ageGroups: [
        { label: '18-25', value: 15, color: '#3b82f6' },
        { label: '26-35', value: 25, color: '#10b981' },
        { label: '36-45', value: 30, color: '#f59e0b' },
        { label: '46-55', value: 20, color: '#ef4444' },
        { label: '55+', value: 10, color: '#8b5cf6' }
      ],
      regions: [
        { label: 'İstanbul', value: 35, color: '#3b82f6' },
        { label: 'Ankara', value: 20, color: '#10b981' },
        { label: 'İzmir', value: 15, color: '#f59e0b' },
        { label: 'Bursa', value: 12, color: '#ef4444' },
        { label: 'Diğer', value: 18, color: '#8b5cf6' }
      ]
    },
    predictions: {
      nextMonth: {
        donations: 92000,
        beneficiaries: 310,
        volunteers: 125
      }
    }
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Analitik veriler güncellendi!')
    } catch (_error) {
      toast.error('Veri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    toast.success('Rapor dışa aktarılıyor...')
    // Implementation for PDF/Excel export
  }

  const getGrowthIcon = (growth) => {
    return growth > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getGrowthColor = (growth) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gelişmiş Analitik</h1>
          <p className="text-gray-600">Detaylı iş zekası ve tahmin analizleri</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Bağış</p>
              <p className="text-2xl font-bold text-gray-900">
                ₺{analyticsData.overview.totalDonations.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(analyticsData.overview.monthlyGrowth)}
            <span className={`ml-2 text-sm font-medium ${getGrowthColor(analyticsData.overview.monthlyGrowth)}`}>
              +{analyticsData.overview.monthlyGrowth}% geçen aya göre
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">İhtiyaç Sahipleri</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalBeneficiaries.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(8.2)}
            <span className="ml-2 text-sm font-medium text-green-600">
              +8.2% geçen aya göre
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Gönüllüler</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.activeVolunteers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(15.3)}
            <span className="ml-2 text-sm font-medium text-green-600">
              +15.3% geçen aya göre
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aylık Büyüme</p>
              <p className="text-2xl font-bold text-gray-900">
                %{analyticsData.overview.monthlyGrowth}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(analyticsData.overview.monthlyGrowth)}
            <span className="ml-2 text-sm font-medium text-green-600">
              Pozitif trend
            </span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Trend Analizi</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.trends.donations.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(value / 85000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Bağış Trendi (Son 12 Ay)</p>
          </div>
        </motion.div>

        {/* Demographics Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demografik Dağılım</h3>
          <div className="space-y-4">
            {analyticsData.demographics.ageGroups.map((group, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-sm font-medium text-gray-700">{group.label}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${group.value}%`, backgroundColor: group.color }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600">{group.value}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Predictions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelecek Ay Tahminleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Tahmini Bağış</p>
            <p className="text-xl font-bold text-blue-600">
              ₺{analyticsData.predictions.nextMonth.donations.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Yeni İhtiyaç Sahipleri</p>
            <p className="text-xl font-bold text-green-600">
              {analyticsData.predictions.nextMonth.beneficiaries}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Yeni Gönüllüler</p>
            <p className="text-xl font-bold text-purple-600">
              {analyticsData.predictions.nextMonth.volunteers}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdvancedAnalytics
