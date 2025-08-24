import { motion } from 'framer-motion'
import { useState } from 'react'
import AdvancedSearchBar from '../components/AdvancedSearchBar'
import DashboardWidgets from '../components/DashboardWidgets'
import { AnalyticsDashboard, BarChart, ChartContainer, DonutChart, LineChart } from '../components/DataVisualization'
// Auth import removed

// For demo purposes - create simple role badge component
const RoleBadge = ({ role, size = 'sm' }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc2626'
      case 'manager': return '#2563eb'
      case 'coordinator': return '#059669'
      case 'volunteer': return '#7c3aed'
      default: return '#6b7280'
    }
  }

  const color = getRoleColor(role)

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: size === 'sm' ? '0.25rem 0.5rem' : '0.375rem 0.75rem',
      backgroundColor: `${color}15`,
      color: color,
      borderRadius: '20px',
      fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
      fontWeight: '600',
      border: `1px solid ${color}30`
    }}>
      {role}
    </span>
  )
}

// Simple PermissionGate for demo
const PermissionGate = ({ permission, children, fallback = null }) => {
  // Mock user for demo
  const user = { role: 'admin', name: 'Test User' }
  
  // Simple permission check for demo
  const hasPermission = user?.role === 'admin' || 
                       (permission === 'finance.read' && ['admin', 'manager'].includes(user?.role))
  
  return hasPermission ? children : fallback
}

const ComponentsDemo = () => {
  // Mock user for demo
  const user = { role: 'admin', name: 'Test User' }
  const [searchResults, setSearchResults] = useState(null)

  // Sample data for demos
  const searchFilters = [
    {
      id: 'category',
      label: 'Kategori',
      type: 'select',
      options: [
        { value: 'donation', label: 'Bağışlar' },
        { value: 'volunteer', label: 'Gönüllüler' },
        { value: 'task', label: 'Görevler' },
        { value: 'inventory', label: 'Envanter' }
      ]
    },
    {
      id: 'date',
      label: 'Tarih',
      type: 'date'
    },
    {
      id: 'status',
      label: 'Durum',
      type: 'select',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'pending', label: 'Beklemede' },
        { value: 'completed', label: 'Tamamlandı' }
      ]
    }
  ]

  const searchSuggestions = [
    { title: 'Bağış raporları', description: 'Aylık bağış raporlarını görüntüle', category: 'Raporlar' },
    { title: 'Gönüllü kayıtları', description: 'Aktif gönüllüleri listele', category: 'Kişiler' },
    { title: 'Envanter sayımı', description: 'Stok durumunu kontrol et', category: 'Envanter' },
    { title: 'Görev atamaları', description: 'Bekleyen görevleri görüntüle', category: 'Görevler' }
  ]

  const chartData = [
    { label: 'Oca', value: 4200 },
    { label: 'Şub', value: 5100 },
    { label: 'Mar', value: 4800 },
    { label: 'Nis', value: 6200 },
    { label: 'May', value: 5800 },
    { label: 'Haz', value: 6800 }
  ]

  const donutData = [
    { label: 'Nakit Bağış', value: 45, color: '#10b981' },
    { label: 'Ayni Bağış', value: 30, color: '#3b82f6' },
    { label: 'Kurumsal', value: 25, color: '#f59e0b' }
  ]

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData)
    setSearchResults(`Arama: "${searchData.term}" - ${Object.keys(searchData.filters).length} filtre uygulandı`)
  }

  return (
    <div className="page-container">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">Bileşenler Demo</h1>
        <p className="page-subtitle">Geliştirilen yeni bileşenlerin örnekleri</p>
      </motion.div>

      {/* User Info & Role Badge */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ marginBottom: '2rem' }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Kullanıcı Bilgileri</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>Hoş geldin, <strong>{user?.name}</strong></span>
          <RoleBadge role={user?.role} size="md" />
          <span style={{ color: '#6b7280' }}>Son giriş: {new Date().toLocaleDateString('tr-TR')}</span>
        </div>
      </motion.div>

      {/* Advanced Search Bar Demo */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '2rem' }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Gelişmiş Arama Sistemi</h3>
        <AdvancedSearchBar
          placeholder="Projeler, görevler, kişiler ara..."
          filters={searchFilters}
          suggestions={searchSuggestions}
          onSearch={handleSearch}
        />
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #e0f2fe'
            }}
          >
            <strong>Arama Sonucu:</strong> {searchResults}
          </motion.div>
        )}
      </motion.div>

      {/* Analytics Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: '2rem' }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Analytics Dashboard</h3>
        <AnalyticsDashboard />
      </motion.div>

      {/* Dashboard Widgets */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: '2rem' }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Dashboard Widget'ları</h3>
        <DashboardWidgets />
      </motion.div>

      {/* Charts Demo */}
      <motion.div 
        className="grid grid-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ marginBottom: '2rem' }}
      >
        <ChartContainer title="Line Chart - Bağış Trendi">
          <LineChart data={chartData} width={400} height={300} color="#10b981" />
        </ChartContainer>

        <ChartContainer title="Bar Chart - Aylık Karşılaştırma">
          <BarChart data={chartData} width={400} height={300} color="#3b82f6" />
        </ChartContainer>
      </motion.div>

      <motion.div 
        className="grid grid-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ marginBottom: '2rem' }}
      >
        <ChartContainer title="Donut Chart - Bağış Türleri">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart data={donutData} size={250} thickness={50} />
          </div>
        </ChartContainer>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Yetkilendirme Sistemi</h3>
          
          <PermissionGate permission="finance.read">
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f0fdf4', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #bbf7d0'
            }}>
              ✅ Mali raporları görüntüleme yetkiniz var
            </div>
          </PermissionGate>

          <PermissionGate permission="system.admin">
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fef3c7', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #fcd34d'
            }}>
              🔧 Sistem yöneticisi yetkileriniz var
            </div>
          </PermissionGate>

          <PermissionGate permission="nonexistent.permission">
            <div>Bu görüntülenmeyecek</div>
          </PermissionGate>

          <PermissionGate 
            permission="nonexistent.permission"
            fallback={
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#fef2f2', 
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                ❌ Bu yetkiye sahip değilsiniz
              </div>
            }
          >
            <div>Bu görüntülenmeyecek</div>
          </PermissionGate>
        </div>
      </motion.div>

      {/* Component Info */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Geliştirilen Bileşenler</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <h4>🔍 AdvancedSearchBar</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Gelişmiş arama, filtre ve öneri sistemi
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <h4>📊 DataVisualization</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Line, Bar, Donut chartları ve analytics kartları
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <h4>🎛️ DashboardWidgets</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Interaktif dashboard widget'ları
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <h4>📱 MobileNavigation</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Mobil uyumlu navigasyon sistemi
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <h4>🔐 EnhancedAuth</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Gelişmiş yetkilendirme ve rol sistemi
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ComponentsDemo
