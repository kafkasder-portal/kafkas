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
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'all 0.2s ease',
        }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={16} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: '600' }}>{user.fullName}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {getRoleName(user.role)}
          </div>
        </div>
        <ChevronDown
          size={16}
          style={{
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #e2e8f0',
                minWidth: '280px',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              {/* Kullanıcı Bilgileri */}
              <div
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: '600',
                        color: '#1a202c',
                        fontSize: '0.875rem',
                      }}
                    >
                      {user.fullName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Shield size={14} style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                    <strong>Rol:</strong> {getRoleName(user.role)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Clock size={14} style={{ color: '#64748b' }} />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Son giriş: {formatDate(user.lastLogin)}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '0.5rem 0' }}>
                <motion.button
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                  }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  onClick={() => {
                    setShowDropdown(false);
                    // Profil ayarları sayfasına yönlendir
                  }}
                >
                  <Settings size={16} />
                  Profil Ayarları
                </motion.button>

                <motion.button
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#ef4444',
                  }}
                  whileHover={{ backgroundColor: '#fef2f2' }}
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  Çıkış Yap
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
