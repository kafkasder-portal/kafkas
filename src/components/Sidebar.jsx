import { AnimatePresence, motion } from 'framer-motion'
import {
  Calculator,
  CheckSquare,
  Coins,
  Home,
  Menu,
  MessageSquare,
  Package,
  Shield,
  Users,
} from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../contexts/AuthContext'
import useDeviceDetection from '../hooks/useDeviceDetection.jsx'
import './Sidebar.css'
import ThemeToggle from './ThemeToggle'

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Home,
    path: '/',
    color: '#1e40af',
  },
  {
    id: 'inventory',
    title: 'Envanter',
    icon: Package,
    path: '/inventory',
    color: '#0ea5e9',
  },
  {
    id: 'tasks',
    title: 'Görevler',
    icon: CheckSquare,
    path: '/tasks',
    color: '#059669',
  },
  {
    id: 'donations',
    title: 'Bağışlar',
    icon: Coins,
    path: '/donations',
    color: '#d97706',
  },
  {
    id: 'beneficiaries',
    title: 'İhtiyaç Sahipleri',
    icon: Users,
    path: '/beneficiaries',
    color: '#7c3aed',
  },
  {
    id: 'volunteers',
    title: 'Gönüllüler',
    icon: Users,
    path: '/volunteers',
    color: '#0ea5e9',
  },
  {
    id: 'finance',
    title: 'Finans',
    icon: Calculator,
    path: '/finance',
    color: '#dc2626',
  },
  {
    id: 'messages',
    title: 'Mesajlar',
    icon: MessageSquare,
    path: '/messages',
    color: '#64748b',
  },
  {
    id: 'system',
    title: 'Sistem',
    icon: Shield,
    path: '/system',
    color: '#374151',
    subItems: [
      { title: 'Genel Ayarlar', path: '/system' },
      { title: 'Hata Takibi', path: '/system/error-dashboard' },
      { title: 'Kullanıcı Yönetimi', path: '/system/user-management' }
    ]
  },
  {
    id: 'test',
    title: 'Test',
    icon: CheckSquare,
    path: '/test',
    color: '#059669',
  },
]

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout, hasPermission } = useAuth()
  const location = useLocation()
  const deviceInfo = useDeviceDetection()
  
  const [hoveredItem, setHoveredItem] = useState(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = useCallback((item, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPopupPosition({
      x: rect.right + 10,
      y: rect.top
    })
    setHoveredItem(item)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null)
  }, [])

  const isActive = useCallback(
    path => {
      if (path === '/') {
        return location.pathname === '/'
      }
      return location.pathname.startsWith(path)
    },
    [location.pathname]
  )

  // Show all menu items since auth is removed
  const getFilteredMenuItems = (items = menuItemsToUse) => {
    return items // Return all items without filtering
  }

  // Alt menü öğeleri için Türkçe başlıkları al
  const getSubItemTitle = (parentId, path) => {
    const titleMap = {
      '/donations': 'Bağış Listesi',
      '/donations/vault': 'Bağış Veznesi',
      '/donations/institutions': 'Kurumlar',
      '/piggy-bank-tracking': 'Kumbara Takibi',
      '/meetings': 'Tüm Toplantılar',
      '/meetings/create': 'Toplantı Planla',
      '/meetings/calendar': 'Toplantı Takvimi',
      '/yardim/ihtiyac-sahipleri': 'İhtiyaç Sahipleri',
      '/aid/applications': 'Yardım Başvuruları',
      '/finance/accounting': 'Muhasebe',
      '/finance/bank-orders': 'Banka İşlemleri',
      '/finance/reports': 'Finansal Raporlar',
      '/volunteers': 'Gönüllü Listesi',
      '/volunteers/create': 'Gönüllü Ekle',
      '/volunteers/reports': 'Gönüllü Raporları',
      '/tasks': 'Görev Listesi',
      '/tasks/create': 'Görev Oluştur',
      '/tasks/calendar': 'Görev Takvimi',
      '/messages': 'Mesaj Listesi',
      '/messages/sms': 'SMS Gönder',
      '/messages/whatsapp': 'WhatsApp',
      '/messages/email': 'Email',
      '/inventory': 'Stok Listesi',
      '/inventory/stock-in': 'Stok Girişi',
      '/inventory/stock-out': 'Stok Çıkışı',
      '/inventory/reports': 'Envanter Raporları',
      '/donors': 'Bağışçı Listesi',
      '/donors/crm': 'CRM Yönetimi',
      '/donors/reports': 'Bağışçı Raporları',
      '/scholarship/programs': 'Burs Programları',
      '/scholarship/applications': 'Burs Başvuruları',
      '/fund': 'Fon Listesi',
      '/fund/work-areas': 'Çalışma Alanları',
      '/system/user-management': 'Kullanıcı Yönetimi',
      '/system/ip-blocking': 'IP Engelleme',
      '/system/settings': 'Sistem Ayarları',
    }

    return titleMap[path] || path
  }

  // Menü öğelerini kullan (zaten Türkçe)
  const getMenuItems = () => {
    return menuItems
  }

  const menuItemsToUse = getMenuItems()
  const filteredMenuItems = getFilteredMenuItems(menuItemsToUse)



  return (
    <>
      <motion.div
        className="sidebar"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <motion.button
            className="toggle-btn"
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={20} />
          </motion.button>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map(item => {
            const IconComponent = item.icon
            const active = isActive(item.path)

            return (
              <motion.div
                key={item.id}
                className={`nav-item ${active ? 'active' : ''}`}
                onMouseEnter={e => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link 
                  to={item.path}
                  className="nav-link"
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    className="icon-wrapper"
                    style={{ backgroundColor: active ? item.color : 'rgba(0,0,0,0)' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <IconComponent size={20} color={active ? 'white' : item.color} />
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer" style={{ 
          padding: '1rem', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: 'auto'
        }}>
          {/* Theme Toggle */}
          <div style={{ marginBottom: '1rem' }}>
            <ThemeToggle />
          </div>

          {/* KAF Portal Info */}
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              KAF Portal
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              v1.0.0
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submenu popup */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            className="popup-menu"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: popupPosition.x,
              top: popupPosition.y,
              zIndex: 1000
            }}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="popup-header">
              <hoveredItem.icon size={16} color={hoveredItem.color} />
              {hoveredItem.title}
            </div>
            <div className="popup-items">
              {hoveredItem.id === 'dashboard' && (
                <>
                  <Link to="/" className="popup-item">Ana Dashboard</Link>
                  <Link to="/analytics" className="popup-item">Analitik</Link>
                  <Link to="/reports" className="popup-item">Raporlar</Link>
                </>
              )}
              
              {hoveredItem.id === 'donations' && (
                <>
                  <Link to="/donations" className="popup-item">Bağış Listesi</Link>
                  <Link to="/piggy-bank-tracking" className="popup-item">Kumbara Takibi</Link>
                  <Link to="/donations/institutions" className="popup-item">Kurumlar</Link>
                  <Link to="/donors" className="popup-item">Bağışçılar</Link>
                </>
              )}
              
              {hoveredItem.id === 'beneficiaries' && (
                <>
                  <Link to="/beneficiaries" className="popup-item">İhtiyaç Sahipleri</Link>
                  <Link to="/aid" className="popup-item">Yardım Programları</Link>
                  <Link to="/scholarship" className="popup-item">Burs Programları</Link>
                  <Link to="/hospital-referrals" className="popup-item">Hastane Sevkleri</Link>
                </>
              )}
              
              {hoveredItem.id === 'volunteers' && (
                <>
                  <Link to="/volunteers" className="popup-item">Gönüllü Listesi</Link>
                  <Link to="/volunteers/create" className="popup-item">Yeni Gönüllü</Link>
                  <Link to="/volunteers/reports" className="popup-item">Gönüllü Raporları</Link>
                </>
              )}
              
              {hoveredItem.id === 'finance' && (
                <>
                  <Link to="/finance" className="popup-item">Finans Yönetimi</Link>
                  <Link to="/finance/accounting" className="popup-item">Muhasebe</Link>
                  <Link to="/finance/bank-orders" className="popup-item">Banka İşlemleri</Link>
                  <Link to="/finance/reports" className="popup-item">Finansal Raporlar</Link>
                </>
              )}
              
              {hoveredItem.id === 'tasks' && (
                <>
                  <Link to="/tasks" className="popup-item">Görev Listesi</Link>
                  <Link to="/tasks/create" className="popup-item">Yeni Görev</Link>
                  <Link to="/tasks/calendar" className="popup-item">Görev Takvimi</Link>
                </>
              )}
              
              {hoveredItem.id === 'inventory' && (
                <>
                  <Link to="/inventory" className="popup-item">Envanter Listesi</Link>
                  <Link to="/inventory/stock-in" className="popup-item">Stok Girişi</Link>
                  <Link to="/inventory/stock-out" className="popup-item">Stok Çıkışı</Link>
                  <Link to="/inventory/reports" className="popup-item">Envanter Raporları</Link>
                </>
              )}
              
              {hoveredItem.id === 'messages' && (
                <>
                  <Link to="/messages" className="popup-item">Mesaj Listesi</Link>
                  <Link to="/messages/sms" className="popup-item">SMS Gönder</Link>
                  <Link to="/messages/whatsapp" className="popup-item">WhatsApp</Link>
                  <Link to="/messages/email" className="popup-item">E-posta</Link>
                </>
              )}
              
              {hoveredItem.id === 'system' && (
                <>
                  <Link to="/system" className="popup-item">Sistem Ayarları</Link>
                  <Link to="/system/user-management" className="popup-item">Kullanıcı Yönetimi</Link>
                  <Link to="/system/ip-blocking" className="popup-item">IP Engelleme</Link>
                  <Link to="/system/settings" className="popup-item">Genel Ayarlar</Link>
                </>
              )}
              
              {hoveredItem.id === 'test' && (
                <>
                  <Link to="/test" className="popup-item">Test Sayfası</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default memo(Sidebar, (prevProps, nextProps) => {
  return prevProps.collapsed === nextProps.collapsed
})
