import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Users, Bell } from 'lucide-react'
import { messagesService } from '../services/messagesService'
import { toast } from 'sonner'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ total: 0, unread: 0, activeChats: 0 })

  // Veri yükleme fonksiyonu
  const loadMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await messagesService.getAll()
      setMessages(data)
      
      // İstatistikleri hesapla
      const unreadCount = data.filter(msg => msg.unread).length
      setStats({
        total: data.length,
        unread: unreadCount,
        activeChats: Math.floor(data.length / 3) // Basit hesaplama
      })
    } catch (err) {
      setError('Mesajlar yüklenirken hata oluştu: ' + err.message)
      toast.error('Mesajlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Mesaj güncelleme fonksiyonu
  const handleUpdateMessage = async (id, updates) => {
    try {
      await messagesService.update(id, updates)
      await loadMessages()
      toast.success('Mesaj güncellendi')
    } catch (err) {
      toast.error('Mesaj güncellenirken hata oluştu')
    }
  }

  // Mesaj silme fonksiyonu
  const handleDeleteMessage = async (id) => {
    try {
      await messagesService.delete(id)
      await loadMessages()
      toast.success('Mesaj silindi')
    } catch (err) {
      toast.error('Mesaj silinirken hata oluştu')
    }
  }

  // Component mount edildiğinde veri yükle
  useEffect(() => {
    loadMessages()
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mesajlaşma</h1>
        <p className="page-subtitle">İç iletişim ve mesaj yönetimi</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
        >
          <div style={{ textAlign: 'center' }}>
            <MessageSquare size={32} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Toplam Mesaj</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6', margin: 0 }}>{stats.total}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div style={{ textAlign: 'center' }}>
            <Bell size={32} color="#ef4444" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Okunmamış</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', margin: 0 }}>{stats.unread}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div style={{ textAlign: 'center' }}>
            <Users size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Aktif Sohbet</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', margin: 0 }}>{stats.activeChats}</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>Son Mesajlar</h2>
          <motion.button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
            Yeni Mesaj
          </motion.button>
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Mesajlar yükleniyor...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={loadMessages}
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
        
        {!loading && !error && messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#64748b' }}>Mesaj bulunamadı.</p>
          </div>
        )}
        
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -2 }}
              style={{
                borderLeft: message.unread ? '4px solid #3b82f6' : '4px solid transparent',
                backgroundColor: message.unread ? '#f8fafc' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                      {message.sender}
                    </h3>
                    {message.unread && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                      }} />
                    )}
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{message.subject}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{message.time}</span>
                  <button
                    onClick={() => handleUpdateMessage(message.id, { unread: false })}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      marginRight: '0.5rem'
                    }}
                  >
                    Okundu İşaretle
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
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
      </motion.div>
    </div>
  )
 }

export default Messages