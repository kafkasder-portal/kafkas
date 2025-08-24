import { motion } from 'framer-motion'
import { Calendar, Clock, Filter, MapPin, Plus, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { meetingsService } from '../services/meetingsService'

const Meetings = () => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMeetings, setFilteredMeetings] = useState([])

  // Veri yükleme fonksiyonu
  const loadMeetings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await meetingsService.getAll()
      setMeetings(data)
    } catch (err) {
      setError('Toplantılar yüklenirken hata oluştu')
      toast.error('Toplantılar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Toplantı güncelleme fonksiyonu
  const handleUpdateMeeting = async (id, updates) => {
    try {
      await meetingsService.update(id, updates)
      await loadMeetings()
      toast.success('Toplantı güncellendi')
    } catch (err) {
      toast.error('Toplantı güncellenirken hata oluştu')
    }
  }

  // Toplantı silme fonksiyonu
  const handleDeleteMeeting = async (id) => {
    try {
      await meetingsService.delete(id)
      await loadMeetings()
      toast.success('Toplantı silindi')
    } catch (err) {
      toast.error('Toplantı silinirken hata oluştu')
    }
  }

  // Component mount edildiğinde veri yükle
  useEffect(() => {
    loadMeetings()
  }, [])

  // Arama filtreleme
  useEffect(() => {
    const filtered = meetings.filter(meeting =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMeetings(filtered)
  }, [meetings, searchTerm])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planlandı':
        return '#3b82f6'
      case 'Tamamlandı':
        return '#10b981'
      case 'İptal':
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Toplantılar</h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Toplantı planları ve kayıtları</p>
        </div>
        <motion.button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
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
          Yeni Toplantı
        </motion.button>
      </div>

      {/* Arama ve Filtre */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Toplantı ara..."
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

      {/* Toplantı Listesi */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '1.5rem' }}>Toplantı Listesi</h3>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Toplantılar yükleniyor...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={loadMeetings}
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

        {!loading && !error && filteredMeetings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#64748b' }}>Toplantı bulunamadı.</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredMeetings.map((meeting) => (
              <motion.div
                key={meeting.id}
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
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c', margin: '0 0 0.5rem 0' }}>
                      {meeting.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {meeting.date}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        {meeting.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} />
                        {meeting.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} />
                        {meeting.participants} kişi
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(meeting.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {meeting.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    onClick={() => handleUpdateMeeting(meeting.id, { status: meeting.status === 'Planlandı' ? 'Tamamlandı' : 'Planlandı' })}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    whileHover={{ backgroundColor: '#5a67d8' }}
                  >
                    Durum Değiştir
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteMeeting(meeting.id)}
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

export default Meetings