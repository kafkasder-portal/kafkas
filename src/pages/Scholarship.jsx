import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Users, TrendingUp, Award, Plus, Search, Filter, Calendar, BookOpen } from 'lucide-react'
import { scholarshipService } from '../services/scholarshipService'
import { toast } from 'sonner'

const Scholarship = () => {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredScholarships, setFilteredScholarships] = useState([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeScholarships: 0,
    graduates: 0,
    totalBudget: 0
  })

  // Bursları yükle
  const loadScholarships = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await scholarshipService.getAll()
      setScholarships(data)
      
      // İstatistikleri hesapla
      const totalStudents = data.length
      const activeScholarships = data.filter(scholarship => scholarship.status === 'Aktif').length
      const graduates = data.filter(scholarship => scholarship.year === 4).length
      const totalBudget = data.reduce((sum, scholarship) => sum + scholarship.amount, 0)
      
      setStats({
        totalStudents,
        activeScholarships,
        graduates,
        totalBudget
      })
    } catch (err) {
      setError('Burslar yüklenirken hata oluştu')
      toast.error('Burslar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Burs güncelle
  const handleUpdateScholarship = async (id, updates) => {
    try {
      await scholarshipService.update(id, updates)
      toast.success('Burs başarıyla güncellendi')
      loadScholarships()
    } catch (err) {
      toast.error('Burs güncellenirken hata oluştu')
    }
  }

  // Burs sil
  const handleDeleteScholarship = async (id) => {
    try {
      await scholarshipService.delete(id)
      toast.success('Burs başarıyla silindi')
      loadScholarships()
    } catch (err) {
      toast.error('Burs silinirken hata oluştu')
    }
  }

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    loadScholarships()
  }, [])

  // Arama filtresi
  useEffect(() => {
    const filtered = scholarships.filter(scholarship =>
      scholarship.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.university.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredScholarships(filtered)
  }, [scholarships, searchTerm])

  const statsData = [
    {
      title: 'Toplam Öğrenci',
      value: stats.totalStudents.toString(),
      icon: Users,
      color: '#3b82f6'
    },
    {
      title: 'Aktif Burslar',
      value: stats.activeScholarships.toString(),
      icon: GraduationCap,
      color: '#10b981'
    },
    {
      title: 'Bu Yıl Mezun',
      value: stats.graduates.toString(),
      icon: Award,
      color: '#f59e0b'
    },
    {
      title: 'Toplam Bütçe',
      value: `₺${(stats.totalBudget / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      color: '#ef4444'
    }
  ]

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tam Burs':
        return '#10b981'
      case 'Yarım Burs':
        return '#f59e0b'
      case 'Kısmi Burs':
        return '#3b82f6'
      default:
        return '#64748b'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktif':
        return '#10b981'
      case 'Beklemede':
        return '#f59e0b'
      case 'Tamamlandı':
        return '#64748b'
      case 'İptal':
        return '#ef4444'
      default:
        return '#64748b'
    }
  }

  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return '#10b981'
    if (gpa >= 3.0) return '#f59e0b'
    return '#ef4444'
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Burs Yönetimi</h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Öğrenci bursları ve eğitim destekleri</p>
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
            <BookOpen size={18} />
            Başvuru Formu
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
            Yeni Burs
          </motion.button>
        </div>
      </div>

      {/* İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {statsData.map((stat, index) => (
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
              placeholder="Öğrenci ara..."
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
            <option value="tam">Tam Burs</option>
            <option value="yarim">Yarım Burs</option>
            <option value="kismi">Kısmi Burs</option>
          </select>
          <select
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
            <option value="beklemede">Beklemede</option>
            <option value="tamamlandi">Tamamlandı</option>
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

      {/* Burs Listesi */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '1.5rem' }}>Burs Listesi</h3>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1rem', color: '#6b7280' }}>Yükleniyor...</div>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>
            <button
              onClick={loadScholarships}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Tekrar Dene
            </button>
          </div>
        )}
        
        {!loading && !error && filteredScholarships.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Burs bulunamadı
          </div>
        )}
        
        {!loading && !error && filteredScholarships.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredScholarships.map((scholarship) => (
            <motion.div
              key={scholarship.id}
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
                      {scholarship.studentName}
                    </h4>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getCategoryColor(scholarship.category),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      {scholarship.category}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>{scholarship.program}</strong> - {scholarship.university}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span>{scholarship.year}. Sınıf</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        GPA: 
                        <span style={{ color: getGpaColor(scholarship.gpa), fontWeight: '600' }}>
                          {scholarship.gpa}
                        </span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {scholarship.startDate} - {scholarship.endDate}
                      </span>
                    </div>
                  </div>
                  
                  {/* Burs Detayları */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Burs Miktarı</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c' }}>₺{scholarship.amount.toLocaleString()}</div>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Akademik Başarı</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: getGpaColor(scholarship.gpa) }}>{scholarship.gpa} GPA</div>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Sınıf Seviyesi</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c' }}>{scholarship.year}. Sınıf</div>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Süre</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c' }}>1 Yıl</div>
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(scholarship.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  {scholarship.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
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
                  Akademik Rapor
                </motion.button>
                <motion.button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                  whileHover={{ backgroundColor: '#2563eb' }}
                >
                  Ödeme Geçmişi
                </motion.button>
                <motion.button
                  onClick={() => handleUpdateScholarship(scholarship.id, { 
                    amount: scholarship.amount + 1000,
                    status: 'Aktif'
                  })}
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
                  Artır
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteScholarship(scholarship.id)}
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
                  Sil
                </motion.button>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Scholarship