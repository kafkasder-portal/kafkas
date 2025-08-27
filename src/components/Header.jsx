import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import './Header.css'

const Header = ({ onMenuToggle }) => {
  const { currentUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Yeni Bağış',
      message: 'Ahmet Yılmaz 500₺ bağış yaptı',
      time: '2 dakika önce',
      type: 'donation',
      read: false
    },
    {
      id: 2,
      title: 'Görev Tamamlandı',
      message: 'Kumbara toplama görevi tamamlandı',
      time: '1 saat önce',
      type: 'task',
      read: false
    },
    {
      id: 3,
      title: 'Yeni Gönüllü',
      message: 'Fatma Demir gönüllü olarak kayıt oldu',
      time: '3 saat önce',
      type: 'volunteer',
      read: true
    }
  ]

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Yönetici'
      case 'manager': return 'Müdür'
      case 'volunteer': return 'Gönüllü'
      default: return 'Kullanıcı'
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative-wrapper')) {
        setShowNotifications(false)
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="header">
      {/* Left Section - Brand & Menu */}
      <div className="header-left">
        <motion.button
          onClick={onMenuToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="menu-toggle"
        >
          <Menu size={20} />
        </motion.button>

        <div className="brand-section">
          <div className="brand-logo">
            K
          </div>
          <div className="brand-text">
            <h1 className="brand-title">KAFKASDER</h1>
            <p className="brand-subtitle">Yönetim Sistemi</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Ara..."
          className="search-input"
        />
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="action-btn"
          title={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* Notifications */}
        <div className="relative-wrapper">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-btn"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <div className="notification-badge">
                {unreadCount}
              </div>
            )}
          </motion.button>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="notification-panel"
              >
                <div className="notification-header">
                  <span className="notification-title">Bildirimler</span>
                  <span className="notification-count">{unreadCount}</span>
                </div>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <div className="notification-content-flex">
                        <div className={`notification-type ${notification.type}`}></div>
                        <span className="notification-title-text">{notification.title}</span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative-wrapper">
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="user-menu"
          >
            <div className="user-avatar">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.fullName}</span>
              <span className="user-role">{getRoleName(currentUser.role)}</span>
            </div>
            <ChevronDown size={14} />
          </motion.button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="dropdown-menu"
              >
                <a href="/profile" className="dropdown-item">
                  <User size={16} />
                  <span>Profil</span>
                </a>
                <a href="/settings" className="dropdown-item">
                  <Settings size={16} />
                  <span>Ayarlar</span>
                </a>
                <button onClick={handleLogout} className="dropdown-item danger">
                  <LogOut size={16} />
                  <span>Çıkış Yap</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header
