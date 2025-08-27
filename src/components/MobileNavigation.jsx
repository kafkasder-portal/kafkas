import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Menu, Search, Settings, X } from 'lucide-react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import useDeviceDetection from '../hooks/useDeviceDetection.jsx'

const MobileHeader = ({ onMenuToggle }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const deviceInfo = useDeviceDetection()
  
  // Mock kullanıcı verisi
  const user = {
    fullName: 'Admin Kullanıcı',
    email: 'admin@kafportal.com'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Implement global search
    }
  }

  const quickSearchSuggestions = [
    { title: 'İhtiyaç Sahipleri', path: '/beneficiaries', icon: '👥' },
    { title: 'Bağışlar', path: '/donations', icon: '💰' },
    { title: 'Gönüllüler', path: '/volunteers', icon: '🤝' },
    { title: 'Görevler', path: '/tasks', icon: '✅' }
  ]

  if (!deviceInfo.isMobile) return null

  return (
    <motion.div 
      className="mobile-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 1000
      }}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sol taraf - Menu butonu */}
      <motion.button
        onClick={onMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '8px'
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ backgroundColor: '#f1f5f9' }}
      >
        <Menu size={24} color="#1a202c" />
      </motion.button>

      {/* Orta - Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#667eea',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          K
        </div>
        <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c' }}>
          Portal
        </span>
      </div>

      {/* Sağ taraf - Kullanıcı menüsü */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <motion.button
          onClick={() => setIsSearchOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px'
          }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ backgroundColor: '#f1f5f9' }}
        >
          <Search size={20} color="#64748b" />
        </motion.button>

        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#667eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {user?.fullName?.charAt(0) || 'U'}
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '2rem'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              style={{
                width: '90%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
              }}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Search size={20} color="#64748b" />
                <form onSubmit={handleSearch} style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Ne arıyorsunuz?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      color: '#1a202c'
                    }}
                  />
                </form>
                <motion.button
                  onClick={() => setIsSearchOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} color="#64748b" />
                </motion.button>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                  Hızlı Erişim
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {quickSearchSuggestions.map((item) => (
                    <motion.a
                      key={item.title || item.path}
                      href={item.path}
                      onClick={() => setIsSearchOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#374151'
                      }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.title}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const MobileSidebar = ({ isOpen, onClose, menuItems }) => {
  // Mock kullanıcı verisi
  const user = {
    fullName: 'Admin Kullanıcı',
    email: 'admin@kafportal.com'
  }
  
  const logout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      window.location.reload()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1500
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100vh',
              backgroundColor: 'white',
              zIndex: 1600,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)'
            }}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#667eea',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>
                  K
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>
                    Kafkas Derneği
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    Portal
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '6px'
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: '#f1f5f9' }}
              >
                <X size={20} color="#64748b" />
              </motion.button>
            </div>

            {/* Menu Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {menuItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.path}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    marginBottom: '0.25rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#374151'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.indexOf(item) * 0.05 }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={20} color={item.color} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {item.title}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* User Section */}
            <div style={{ 
              padding: '1rem', 
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a202c', margin: 0 }}>
                    {user?.fullName || 'Kullanıcı'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ backgroundColor: '#e5e7eb' }}
                >
                  <Settings size={16} />
                  Ayarlar
                </motion.button>
                
                <motion.button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#dc2626'
                  }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ backgroundColor: '#fee2e2' }}
                >
                  <LogOut size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

MobileHeader.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
};

export { MobileHeader, MobileSidebar }

// Combined Mobile Navigation Component
const MobileNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <MobileHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

export default MobileNavigation
