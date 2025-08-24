import { motion } from 'framer-motion'
import { AlertCircle, Calendar, CheckSquare, Clock, Filter, Plus, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { tasksService } from '../services/tasksService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState([])

  // Veri yükleme fonksiyonu
  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tasksService.getAll()
      setTasks(data)
    } catch (_err) {
      setError('Görevler yüklenirken hata oluştu')
      toast.error('Görevler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Görev güncelleme fonksiyonu
  const handleUpdateTask = async (taskId, updates) => {
    try {
      await tasksService.update(taskId, updates)
      toast.success('Görev başarıyla güncellendi')
      loadTasks()
    } catch (_err) {
      toast.error('Görev güncellenirken hata oluştu')
    }
  }

  // Görev silme fonksiyonu
  const handleDeleteTask = async (taskId) => {
    try {
      await tasksService.delete(taskId)
      toast.success('Görev başarıyla silindi')
      loadTasks()
    } catch (_err) {
      toast.error('Görev silinirken hata oluştu')
    }
  }

  // Component mount edildiğinde veri yükle
  useEffect(() => {
    loadTasks()
  }, [])

  // Arama ve filtreleme
  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTasks(filtered)
  }, [tasks, searchTerm])

  const stats = [
    {
      title: 'Toplam Görev',
      value: '156',
      icon: CheckSquare,
      color: '#3b82f6'
    },
    {
      title: 'Devam Eden',
      value: '42',
      icon: Clock,
      color: '#f59e0b'
    },
    {
      title: 'Tamamlanan',
      value: '98',
      icon: CheckSquare,
      color: '#10b981'
    },
    {
      title: 'Geciken',
      value: '16',
      icon: AlertCircle,
      color: '#ef4444'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı':
        return '#10b981'
      case 'Devam Ediyor':
        return '#3b82f6'
      case 'Beklemede':
        return '#f59e0b'
      case 'Gecikmiş':
        return '#ef4444'
      default:
        return '#64748b'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Yüksek':
        return '#ef4444'
      case 'Orta':
        return '#f59e0b'
      case 'Düşük':
        return '#10b981'
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>Görev Yönetimi</h1>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Proje görevleri ve takip sistemi</p>
        </div>
        <motion.button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#8b5cf6',
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
          Yeni Görev
        </motion.button>
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
              placeholder="Görev ara..."
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

      {/* Görev Listesi */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a202c', marginBottom: '1.5rem' }}>Aktif Görevler</h3>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Görevler yükleniyor...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={loadTasks}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#8b5cf6',
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

        {!loading && !error && filteredTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#64748b' }}>Görev bulunamadı.</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
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
                        {task.title}
                      </h4>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p style={{ color: '#64748b', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
                      {task.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={14} />
                        {task.assignee}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {task.dueDate}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>İlerleme</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a202c' }}>{task.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                          style={{
                            height: '100%',
                            backgroundColor: getStatusColor(task.status),
                            borderRadius: '4px'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(task.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {task.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    onClick={() => handleUpdateTask(task.id, { status: 'Tamamlandı', progress: 100 })}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                    whileHover={{ backgroundColor: '#7c3aed' }}
                  >
                    Detaylar
                  </motion.button>
                  <motion.button
                    onClick={() => handleUpdateTask(task.id, { progress: Math.min(task.progress + 10, 100) })}
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
                    Güncelle
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteTask(task.id)}
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

export default Tasks