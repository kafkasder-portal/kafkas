import { motion } from 'framer-motion'
import { Package, TrendingDown, TrendingUp, AlertTriangle, Plus, Search, Filter, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { inventoryService } from '../services/inventoryService'
import { toast } from 'sonner'

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredItems, setFilteredItems] = useState([])

  // Veri yükleme fonksiyonu
  const loadInventoryItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await inventoryService.getAll()
      setInventoryItems(Array.isArray(data) ? data : [])
      setFilteredItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Envanter verileri yüklenirken hata:', err)
      setError('Envanter verileri yüklenirken bir hata oluştu')
      toast.error('Envanter verileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Stok ekleme fonksiyonu
  const handleAddStock = async (itemId, quantity) => {
    try {
      await inventoryService.addStock(itemId, quantity)
      toast.success('Stok başarıyla eklendi')
      loadInventoryItems()
    } catch (err) {
      console.error('Stok eklenirken hata:', err)
      toast.error('Stok eklenirken hata oluştu')
    }
  }

  // Stok çıkarma fonksiyonu
  const handleRemoveStock = async (itemId, quantity) => {
    try {
      await inventoryService.removeStock(itemId, quantity)
      toast.success('Stok başarıyla çıkarıldı')
      loadInventoryItems()
    } catch (err) {
      console.error('Stok çıkarılırken hata:', err)
      toast.error('Stok çıkarılırken hata oluştu')
    }
  }

  // Ürün güncelleme fonksiyonu
  const handleUpdateItem = async (itemId, updatedData) => {
    try {
      await inventoryService.update(itemId, updatedData)
      toast.success('Ürün başarıyla güncellendi')
      loadInventoryItems()
    } catch (err) {
      console.error('Ürün güncellenirken hata:', err)
      toast.error('Ürün güncellenirken hata oluştu')
    }
  }

  // Filtreleme fonksiyonu
  useEffect(() => {
    let filtered = inventoryItems

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }, [inventoryItems, searchTerm, selectedCategory])

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    loadInventoryItems()
  }, [])

  const stats = [
    {
      title: 'Toplam Ürün',
      value: '1,247',
      icon: Package,
      color: '#3b82f6'
    },
    {
      title: 'Düşük Stok',
      value: '23',
      icon: TrendingDown,
      color: '#f59e0b'
    },
    {
      title: 'Kritik Stok',
      value: '8',
      icon: AlertTriangle,
      color: '#ef4444'
    },
    {
      title: 'Son Giriş',
      value: '156',
      icon: TrendingUp,
      color: '#10b981'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yeterli':
        return '#10b981'
      case 'Düşük':
        return '#f59e0b'
      case 'Kritik':
        return '#ef4444'
      default:
        return '#64748b'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Gıda':
        return '#10b981'
      case 'Giyim':
        return '#3b82f6'
      case 'Eğitim':
        return '#f59e0b'
      case 'Sağlık':
        return '#ef4444'
      default:
        return '#64748b'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Envanter Yönetimi</h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Stok takibi ve envanter kontrolü</p>
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
            <Truck size={18} />
            Stok Girişi
          </motion.button>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f59e0b',
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
            Yeni Ürün
          </motion.button>
        </div>
      </div>

      {/* İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, index) => (
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
                backgroundColor: `${stat.color}20`,
                color: stat.color
              }}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>{stat.value}</h3>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Arama ve Filtre */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="">Tüm Kategoriler</option>
            <option value="Gıda">Gıda</option>
            <option value="Giyim">Giyim</option>
            <option value="Eğitim">Eğitim</option>
            <option value="Sağlık">Sağlık</option>
          </select>
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
            <Filter size={18} />
            Filtrele
          </motion.button>
        </div>
      </div>

      {/* Envanter Listesi */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '1.5rem' }}>Envanter Listesi</h3>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Envanter verileri yükleniyor...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <motion.button
              onClick={loadInventoryItems}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              whileHover={{ backgroundColor: '#2563eb' }}
            >
              Tekrar Dene
            </motion.button>
          </div>
        )}
        
        {!loading && !error && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Envanter verisi bulunamadı</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0
            return (
              <motion.div
                key={item.id}
                style={{
                  padding: '1.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff'
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                        {item.name}
                      </h4>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: getCategoryColor(item.category),
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#1a202c' }}>{item.currentStock}</span> {item.unit}
                      </div>
                      <div>
                        Min: <span style={{ fontWeight: '600' }}>{item.minStock}</span>
                      </div>
                      <div>
                        Max: <span style={{ fontWeight: '600' }}>{item.maxStock}</span>
                      </div>
                      <div>
                        Son Güncelleme: {item.lastUpdated}
                      </div>
                    </div>
                    
                    {/* Stok Seviyesi */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Stok Seviyesi</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a202c' }}>{stockPercentage.toFixed(0)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                          style={{
                            height: '100%',
                            backgroundColor: getStatusColor(item.status),
                            borderRadius: '4px'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPercentage}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(item.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    onClick={() => handleAddStock(item.id, 10)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    whileHover={{ backgroundColor: '#059669' }}
                  >
                    Stok Ekle
                  </motion.button>
                  <motion.button
                    onClick={() => handleRemoveStock(item.id, 5)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    whileHover={{ backgroundColor: '#dc2626' }}
                  >
                    Stok Çıkar
                  </motion.button>
                  <motion.button
                    onClick={() => handleUpdateItem(item.id, { ...item, lastUpdated: new Date().toISOString().split('T')[0] })}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    whileHover={{ backgroundColor: '#f1f5f9' }}
                  >
                    Düzenle
                  </motion.button>
                </div>
                </motion.div>
              )
            })
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Inventory