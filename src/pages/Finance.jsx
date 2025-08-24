import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Plus, Search, Filter, Download } from 'lucide-react'
import { financeService } from '../services/financeService'
import { toast } from 'sonner'

const Finance = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [financialStats, setFinancialStats] = useState([
    {
      title: 'Toplam Gelir',
      value: '₺0',
      change: '+0%',
      icon: TrendingUp,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Toplam Gider',
      value: '₺0',
      change: '+0%',
      icon: TrendingDown,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Net Bakiye',
      value: '₺0',
      change: '+0%',
      icon: DollarSign,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Bu Ay Bütçe',
      value: '₺0',
      change: '+0%',
      icon: PieChart,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ])

  // Veri yükleme fonksiyonu
  const loadFinanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await financeService.getAll()
      setTransactions(data)
      
      // İstatistikleri hesapla
      const totalIncome = data.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
      const totalExpense = Math.abs(data.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
      const netBalance = totalIncome - totalExpense
      
      setFinancialStats([
        {
          title: 'Toplam Gelir',
          value: `₺${totalIncome.toLocaleString()}`,
          change: '+12.5%',
          icon: TrendingUp,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
          title: 'Toplam Gider',
          value: `₺${totalExpense.toLocaleString()}`,
          change: '+8.2%',
          icon: TrendingDown,
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)'
        },
        {
          title: 'Net Bakiye',
          value: `₺${netBalance.toLocaleString()}`,
          change: '+15.3%',
          icon: DollarSign,
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          title: 'Bu Ay Bütçe',
          value: '₺75,000',
          change: '-5.7%',
          icon: PieChart,
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        }
      ])
    } catch (_err) {
      setError('Finans verileri yüklenirken hata oluştu')
      toast.error('Finans verileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // İşlem güncelleme fonksiyonu
  const handleUpdateTransaction = async (id, updates) => {
    try {
      await financeService.update(id, updates)
      await loadFinanceData()
      toast.success('İşlem güncellendi')
    } catch (_err) {
      toast.error('İşlem güncellenirken hata oluştu')
    }
  }

  // İşlem silme fonksiyonu
  const handleDeleteTransaction = async (id) => {
    try {
      await financeService.delete(id)
      await loadFinanceData()
      toast.success('İşlem silindi')
    } catch (_err) {
      toast.error('İşlem silinirken hata oluştu')
    }
  }

  // Component mount edildiğinde veri yükle
  useEffect(() => {
    loadFinanceData()
  }, [])

  // Arama filtresi
  useEffect(() => {
    if (!Array.isArray(transactions)) {
      setFilteredTransactions([])
      return
    }
    
    const filtered = transactions.filter(transaction =>
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTransactions(filtered)
  }, [transactions, searchTerm])



  const budgetCategories = [
    { name: 'Yardım Programları', allocated: 120000, spent: 95000, percentage: 79 },
    { name: 'İşletme Giderleri', allocated: 45000, spent: 38000, percentage: 84 },
    { name: 'Personel', allocated: 80000, spent: 80000, percentage: 100 },
    { name: 'Pazarlama', allocated: 25000, spent: 18000, percentage: 72 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Finans Yönetimi</h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Mali durum ve bütçe takibi</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
            whileHover={{ backgroundColor: '#f1f5f9' }}
          >
            <Download size={18} />
            Rapor İndir
          </motion.button>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            Yeni İşlem
          </motion.button>
        </div>
      </div>

      {/* Mali İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {financialStats.map((stat, index) => (
          <motion.div
            key={index}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: stat.bgColor,
                color: stat.color
              }}
            >
              <stat.icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>{stat.value}</h3>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{stat.title}</p>
              <span style={{ color: stat.color, fontSize: '0.75rem', fontWeight: '600' }}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Son İşlemler */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>Son İşlemler</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.5rem 0.5rem 0.5rem 2rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    width: '150px'
                  }}
                />
              </div>
              <button
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <Filter size={16} />
              </button>
            </div>
          </div>
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '1rem', color: '#64748b' }}>İşlemler yükleniyor...</p>
            </div>
          )}
          
          {error && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
              <button
                onClick={loadFinanceData}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Tekrar Dene
              </button>
            </div>
          )}
          
          {!loading && !error && filteredTransactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#64748b' }}>İşlem bulunamadı.</p>
            </div>
          )}
          
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a202c', margin: '0 0 0.25rem 0' }}>
                    {transaction.description}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>{transaction.date}</span>
                    <span>{transaction.type}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: transaction.amount > 0 ? '#10b981' : '#ef4444'
                    }}
                  >
                    {transaction.amount > 0 ? '+' : ''}₺{Math.abs(transaction.amount).toLocaleString()}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{transaction.category}</div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateTransaction(transaction.id, { amount: transaction.amount * 1.1 })}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </div>

        {/* Bütçe Durumu */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '1.5rem' }}>Bütçe Durumu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {budgetCategories.map((category, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a202c' }}>{category.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{category.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    style={{
                      height: '100%',
                      backgroundColor: category.percentage > 90 ? '#ef4444' : category.percentage > 75 ? '#f59e0b' : '#10b981',
                      borderRadius: '4px'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Harcanan: ₺{category.spent.toLocaleString()}</span>
                  <span>Bütçe: ₺{category.allocated.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grafik Alanı */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>Mali Durum Grafiği</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Aylık
            </button>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Yıllık
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#64748b' }}>
          <div style={{ textAlign: 'center' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 1rem' }} />
            <p>Grafik verileri yükleniyor...</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Finance