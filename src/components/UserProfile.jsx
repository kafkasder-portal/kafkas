import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  LogOut,
  Settings,
  Shield,
  Clock,
  ChevronDown,
} from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock kullanıcı verisi
  const user = {
    fullName: 'Admin Kullanıcı',
    email: 'admin@kafportal.com',
    role: 'admin',
    lastLogin: new Date().toISOString(),
  };

  const getRoleName = role => {
    const roleNames = {
      admin: 'Yönetici',
      moderator: 'Moderatör',
      user: 'Kullanıcı',
      volunteer: 'Gönüllü',
    };
    return roleNames[role] || 'Kullanıcı';
  };

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      // Mock logout - sadece sayfayı yenile
      window.location.reload();
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'Hiç giriş yapılmamış';
    return new Date(dateString).toLocaleString('tr-TR');
  };

  return (
    <div className="user-profile-container">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="user-profile-button"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="user-avatar">
          <User size={16} />
        </div>
        <div className="user-info">
          <div className="user-name">{user.fullName}</div>
          <div className="user-role">
            {getRoleName(user.role)}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`user-chevron ${showDropdown ? 'rotated' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="user-dropdown-backdrop"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="user-dropdown-menu"
            >
              {/* Kullanıcı Bilgileri */}
              <div className="user-info-section">
                <div className="user-info-header">
                  <div className="user-info-avatar">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info-details">
                    <div className="user-info-name">
                      {user.fullName}
                    </div>
                    <div className="user-info-email">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="user-info-role">
                  <Shield size={14} className="user-menu-item-icon" />
                  <span>
                    <strong>Rol:</strong> {getRoleName(user.role)}
                  </span>
                </div>

                <div className="user-info-role">
                  <Clock size={14} className="user-menu-item-icon" />
                  <span>
                    Son giriş: {formatDate(user.lastLogin)}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="user-menu-items">
                <motion.button
                  className="user-menu-item"
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  onClick={() => {
                    setShowDropdown(false);
                    // Profil ayarları sayfasına yönlendir
                  }}
                >
                  <Settings size={16} className="user-menu-item-icon" />
                  <span className="user-menu-item-text">Profil Ayarları</span>
                </motion.button>

                <motion.button
                  className="user-logout-button"
                  whileHover={{ backgroundColor: '#fef2f2' }}
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} className="user-logout-icon" />
                  <span className="user-logout-text">Çıkış Yap</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
