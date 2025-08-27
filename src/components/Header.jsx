import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  Shield,
  Clock,
  ChevronDown,
  Menu,
} from 'lucide-react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ onMenuToggle }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock kullanıcı verisi
  const currentUser = {
    fullName: 'Admin Kullanıcı',
    email: 'admin@kafportal.com',
    role: 'admin',
    lastLogin: new Date().toISOString(),
  };

  const notifications = [
    {
      id: 1,
      title: 'Yeni bağış alındı',
      message: '₺5,000 tutarında yeni bağış kaydedildi',
      time: '2 dakika önce',
      type: 'donation',
      read: false,
    },
    {
      id: 2,
      title: 'Görev tamamlandı',
      message: 'Yardım paketi dağıtımı tamamlandı',
      time: '15 dakika önce',
      type: 'task',
      read: false,
    },
    {
      id: 3,
      title: 'Yeni gönüllü',
      message: 'Mehmet Kaya sisteme katıldı',
      time: '1 saat önce',
      type: 'volunteer',
      read: true,
    },
    {
      id: 4,
      title: 'Sistem güncellemesi',
      message: 'Yeni özellikler eklendi',
      time: '2 saat önce',
      type: 'system',
      read: true,
    },
  ];

  const getRoleName = role => {
    const roleNames = {
      admin: 'Yönetici',
      moderator: 'Moderatör',
      user: 'Kullanıcı',
      volunteer: 'Gönüllü',
    };
    return roleNames[role] || 'Kullanıcı';
  };

  const formatDate = dateString => {
    if (!dateString) return 'Hiç giriş yapılmamış';
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      // Logout işlemi
      window.location.reload();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header"
    >
      {/* Left Section */}
      <div className="header-left">
        <motion.button
          onClick={onMenuToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="menu-toggle"
        >
          <Menu size={20} />
        </motion.button>

        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            KAF Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            NGO Yönetim Sistemi
          </p>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Ara..."
          className="search-input"
        />
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="notification-btn"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div className="notification-badge">
                {unreadCount}
              </div>
            )}
          </motion.button>

          {/* Notifications Panel */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="user-menu-btn"
          >
            <div className="user-avatar">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.fullName}</span>
              <span className="user-role">{getRoleName(currentUser.role)}</span>
            </div>
            <ChevronDown size={16} />
          </motion.button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="dropdown-menu"
            >
              <div className="dropdown-item">
                <Shield size={16} />
                <span>Profil Ayarları</span>
              </div>
              <div className="dropdown-item">
                <Settings size={16} />
                <span>Sistem Ayarları</span>
              </div>
              <div className="dropdown-item">
                <Clock size={16} />
                <span>Son Giriş: {formatDate(currentUser.lastLogin)}</span>
              </div>
              <div className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

Header.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
};

export default Header;
