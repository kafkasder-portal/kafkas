import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  RefreshCw, 
  Trash2,
  Download,
  Filter,
  Search,
  Clock,
  Activity,
  Wifi,
  WifiOff,
  Database,
  Code,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { toast } from 'sonner'
import errorTracker from '../utils/errorTracker'

const ErrorDashboard = () => {
  const [stats, setStats] = useState(null)
  const [selectedError, setSelectedError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const refreshInterval = useRef(null)

  // Auto-refresh stats
  useEffect(() => {
    const updateStats = () => {
      setStats(errorTracker.getStats())
    }

    updateStats()

    if (autoRefresh) {
      refreshInterval.current = setInterval(updateStats, 2000)
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current)
      }
    }
  }, [autoRefresh])

  // Manual refresh
  const handleRefresh = () => {
    setStats(errorTracker.getStats())
    toast.success('Hata istatistikleri güncellendi')
  }

  // Clear all errors
  const handleClearErrors = () => {
    errorTracker.clear()
    setStats(errorTracker.getStats())
    setSelectedError(null)
    toast.success('Tüm hatalar temizlendi')
  }

  // Export errors
  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      stats: errorTracker.getStats()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Hata raporu indirildi')
  }

  // Filter errors
  const getFilteredErrors = () => {
    if (!stats) return []
    
    let errors = [...stats.recentErrors, ...stats.recentWarnings]
    
    if (filter !== 'all') {
      errors = errors.filter(error => error.category === filter)
    }
    
    if (searchTerm) {
      errors = errors.filter(error => 
        error.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return errors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'console.error':
        return <AlertCircle size={16} />
      case 'console.warn':
        return <AlertTriangle size={16} />
      case 'api.error':
        return <Database size={16} />
      case 'network.error':
        return <Globe size={16} />
      case 'react.error':
        return <Code size={16} />
      case 'javascript.error':
        return <Code size={16} />
      case 'performance.error':
        return <Zap size={16} />
      default:
        return <Info size={16} />
    }
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return '#ef4444'
      case 'warning':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  // Get time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now - time
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days} gün önce`
    if (hours > 0) return `${hours} saat önce`
    if (minutes > 0) return `${minutes} dakika önce`
    return 'Az önce'
  }

  const filteredErrors = getFilteredErrors()

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background-secondary)',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: 'var(--text-primary)', 
              margin: '0 0 0.5rem 0' 
            }}>
              Hata Takip Sistemi
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Gerçek zamanlı hata izleme ve raporlama
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={16} />
              Yenile
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--background-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Download size={16} />
              İndir
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearErrors}
              style={{
                padding: '0.75rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Trash2 size={16} />
              Temizle
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertCircle size={20} color="#ef4444" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Toplam Hata</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {stats.totalErrors}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={20} color="#f59e0b" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Toplam Uyarı</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {stats.totalWarnings}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Activity size={20} color="#3b82f6" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Kategoriler</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {Object.keys(stats.categories).length}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock size={20} color="#10b981" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Son Güncelleme</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {new Date().toLocaleTimeString('tr-TR')}
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters and Search */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} />
            <input
              type="text"
              placeholder="Hata ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--background-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              backgroundColor: 'var(--background-primary)',
              color: 'var(--text-primary)',
              minWidth: '150px'
            }}
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="console.error">Console Error</option>
            <option value="console.warn">Console Warning</option>
            <option value="api.error">API Error</option>
            <option value="network.error">Network Error</option>
            <option value="react.error">React Error</option>
            <option value="javascript.error">JavaScript Error</option>
            <option value="performance.error">Performance Error</option>
          </select>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ margin: 0 }}
            />
            Otomatik Yenile
          </label>
        </div>

        {/* Error List */}
        <div style={{ 
          backgroundColor: 'var(--background-primary)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)', 
              margin: 0 
            }}>
              Son Hatalar ({filteredErrors.length})
            </h3>
          </div>
          
          <div style={{ maxHeight: '600px', overflow: 'auto' }}>
            {filteredErrors.length === 0 ? (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                <Info size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Henüz hata kaydı yok</p>
              </div>
            ) : (
              filteredErrors.map((error, index) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedError(error)
                    setShowDetails(true)
                  }}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--background-secondary)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ 
                      color: getSeverityColor(error.severity),
                      marginTop: '2px'
                    }}>
                      {getCategoryIcon(error.category)}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem'
                      }}>
                        <h4 style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: 'var(--text-primary)', 
                          margin: '0 0 0.25rem 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {error.message || error.category}
                        </h4>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          marginLeft: '0.5rem'
                        }}>
                          {getTimeAgo(error.timestamp)}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          backgroundColor: getSeverityColor(error.severity) + '20',
                          color: getSeverityColor(error.severity),
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: '500'
                        }}>
                          {error.severity}
                        </span>
                        <span>{error.category}</span>
                        {error.url && (
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {new URL(error.url).pathname}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {stats && (
          <div style={{ 
            marginTop: '2rem',
            backgroundColor: 'var(--background-primary)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)', 
              margin: '0 0 1rem 0' 
            }}>
              Kategori Dağılımı
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem'
            }}>
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--background-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {getCategoryIcon(category)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)' 
                    }}>
                      {category.replace('.', ' ')}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)' 
                    }}>
                      {count} hata
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Details Modal */}
      <AnimatePresence>
        {showDetails && selectedError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'var(--background-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)', 
                  margin: 0 
                }}>
                  Hata Detayları
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>
                    Mesaj
                  </label>
                  <div style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--background-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    wordBreak: 'break-word'
                  }}>
                    {selectedError.message || 'Mesaj yok'}
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>
                    Kategori
                  </label>
                  <div style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--background-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    {selectedError.category}
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>
                    Zaman
                  </label>
                  <div style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--background-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    {new Date(selectedError.timestamp).toLocaleString('tr-TR')}
                  </div>
                </div>
                
                {selectedError.url && (
                  <div>
                    <label style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      URL
                    </label>
                    <div style={{ 
                      padding: '0.75rem',
                      backgroundColor: 'var(--background-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      wordBreak: 'break-all'
                    }}>
                      {selectedError.url}
                    </div>
                  </div>
                )}
                
                {selectedError.stack && (
                  <div>
                    <label style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      Stack Trace
                    </label>
                    <pre style={{ 
                      padding: '0.75rem',
                      backgroundColor: 'var(--background-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      overflow: 'auto',
                      maxHeight: '200px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0
                    }}>
                      {selectedError.stack}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ErrorDashboard
