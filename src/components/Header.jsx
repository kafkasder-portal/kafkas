import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Shield,
  Clock,
  ChevronDown,
  Menu,
} from 'lucide-react';

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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <motion.button
          onClick={onMenuToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#667eea',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <Menu size={20} />
        </motion.button>

        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            KAF Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0' }}>
            NGO Yönetim Sistemi
          </p>
        </div>
      </div>

      {/* Center Section - Search */}
      <div style={{ flex: 1, maxWidth: '500px', margin: '0 24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af' 
          }} />
          <input
            type="text"
            placeholder="Ara..."
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#f9fafb',
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}>
                {unreadCount}
              </div>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                minWidth: '320px',
                maxHeight: '400px',
                overflow: 'hidden',
                zIndex: 1000,
              }}
            >
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Bildirimler
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  {unreadCount} okunmamış bildirim
                </p>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: notification.read ? 'white' : '#fef3c7',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = notification.read ? 'white' : '#fef3c7'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: notification.read ? 'transparent' : '#f59e0b',
                        marginTop: '6px',
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {notification.title}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px 0' }}>
                          {notification.message}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
            }}>
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <span>{currentUser.fullName}</span>
            <ChevronDown
              size={16}
              style={{
                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </motion.button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                minWidth: '280px',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              {/* User Info */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1.25rem',
                  }}>
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#1a202c',
                      fontSize: '0.875rem',
                    }}>
                      {currentUser.fullName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <Shield size={14} style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                    <strong>Rol:</strong> {getRoleName(currentUser.role)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Clock size={14} style={{ color: '#64748b' }} />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Son giriş: {formatDate(currentUser.lastLogin)}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px 0' }}>
                <motion.button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/profile-settings';
                  }}
                >
                  <Settings size={16} />
                  Profil Ayarları
                </motion.button>

                <motion.button
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.875rem',
                    color: '#ef4444',
                  }}
                  whileHover={{ backgroundColor: '#fef2f2' }}
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  Çıkış Yap
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </motion.header>
  );
};

export default Header;
