import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  BellRing,
  X,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react'
import { useNotification } from '../contexts/NotificationContext'

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const panelRef = useRef(null)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    settings,
    updateSettings,
    requestDesktopPermission,
    NOTIFICATION_TYPES,
    NOTIFICATION_PRIORITY,
  } = useNotification()

  // Panel dışında tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = event => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowSettings(false)
      }
    }

    const handleEscapeKey = event => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setShowSettings(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const getNotificationIcon = type => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle size={16} color="#10b981" />
      case NOTIFICATION_TYPES.ERROR:
        return <XCircle size={16} color="#ef4444" />
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle size={16} color="#f59e0b" />
      case NOTIFICATION_TYPES.LOADING:
        return <Loader size={16} color="#3b82f6" className="animate-spin" />
      default:
        return <Info size={16} color="#6b7280" />
    }
  }

  const getPriorityColor = priority => {
    switch (priority) {
      case NOTIFICATION_PRIORITY.URGENT:
        return '#ef4444'
      case NOTIFICATION_PRIORITY.HIGH:
        return '#f59e0b'
      case NOTIFICATION_PRIORITY.MEDIUM:
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const formatTime = timestamp => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now - time

    if (diff < 60000) return 'Şimdi'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dk önce`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat önce`
    return time.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleEnableDesktop = async () => {
    const granted = await requestDesktopPermission()
    if (granted) {
      updateSettings({ enableDesktop: true })
    }
  }

  return (
    <div
      className="notification-panel"
      ref={panelRef}
      style={{
        position: 'relative',
      }}
    >
      {/* Bildirim Butonu */}
      <motion.button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          position: 'relative',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        {unreadCount > 0 ? (
          <BellRing size={20} color="#3b82f6" />
        ) : (
          <Bell size={20} color="#6b7280" />
        )}

        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
              delay: 0.1,
            }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '10px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '20px',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            }}
            className={unreadCount > 0 ? 'notification-pulse' : ''}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Bildirim Paneli */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -15,
              scale: 0.95,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              width: '400px',
              maxHeight: '520px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '20px',
              boxShadow:
                '0 25px 50px rgba(0, 0, 0, 0.1), ' +
                '0 0 0 1px rgba(255, 255, 255, 0.9), ' +
                '0 0 80px rgba(102, 126, 234, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              zIndex: 1000,
              overflow: 'hidden',
              transformOrigin: 'top right',
            }}
          >
            {/* Panel Başlığı */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0,
                  }}
                >
                  Bildirimler
                </h3>
                {unreadCount > 0 && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: '2px 0 0 0',
                    }}
                  >
                    {unreadCount} okunmamış bildirim
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {unreadCount > 0 && (
                  <motion.button
                    onClick={markAllAsRead}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Tümünü okundu olarak işaretle"
                  >
                    <CheckCheck size={14} color="#3b82f6" />
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '6px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: showSettings ? '#e2e8f0' : '#f1f5f9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Ayarlar"
                >
                  <Settings size={14} color="#6b7280" />
                </motion.button>
              </div>
            </div>

            {/* Ayarlar Paneli */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  style={{
                    transformOrigin: 'top',
                    padding: '16px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      margin: '0 0 12px 0',
                    }}
                  >
                    Bildirim Ayarları
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={settings.enableSound}
                        onChange={e => updateSettings({ enableSound: e.target.checked })}
                      />
                      Ses bildirimleri
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={settings.enableDesktop}
                        onChange={e =>
                          e.target.checked
                            ? handleEnableDesktop()
                            : updateSettings({ enableDesktop: false })
                        }
                      />
                      Masaüstü bildirimleri
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={settings.autoRead}
                        onChange={e => updateSettings({ autoRead: e.target.checked })}
                      />
                      Otomatik okundu işaretle
                    </label>
                  </div>

                  {notifications.length > 0 && (
                    <motion.button
                      onClick={clearAllNotifications}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        marginTop: '12px',
                        padding: '6px 12px',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={12} />
                      Tümünü Temizle
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bildirim Listesi */}
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#64748b',
                  }}
                >
                  <Bell size={32} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '14px', margin: 0 }}>Henüz bildirim yok</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{
                      opacity: 0,
                      x: -30,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: 30,
                      scale: 0.95,
                    }}
                    transition={{
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={{
                      x: 4,
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(241, 245, 249, 0.8)',
                      backgroundColor: notification.read
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(248, 250, 252, 0.9)',
                      borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(10px)',
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {notification.title && (
                          <h4
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#1e293b',
                              margin: '0 0 4px 0',
                              lineHeight: '1.3',
                            }}
                          >
                            {notification.title}
                          </h4>
                        )}

                        <p
                          style={{
                            fontSize: '12px',
                            color: '#64748b',
                            margin: '0 0 6px 0',
                            lineHeight: '1.4',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {notification.message}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '11px',
                            color: '#94a3b8',
                          }}
                        >
                          <Clock size={10} />
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {!notification.read && (
                          <motion.button
                            onClick={e => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              padding: '4px',
                              border: 'none',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(0,0,0,0)',
                              cursor: 'pointer',
                            }}
                            title="Okundu olarak işaretle"
                          >
                            <Check size={12} color="#10b981" />
                          </motion.button>
                        )}

                        <motion.button
                          onClick={e => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{
                            padding: '4px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0,0,0,0)',
                            cursor: 'pointer',
                          }}
                          title="Bildirimi sil"
                        >
                          <X size={12} color="#ef4444" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationPanel
