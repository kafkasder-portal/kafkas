import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  Building2,
  Calculator,
  Calendar,
  CheckSquare,
  ChevronRight,
  Coins,
  Cpu,
  FileText,
  FormInput,
  GraduationCap,
  HelpingHand,
  Home,
  Layers,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Settings,
  Shield,
  Users,
  Workflow,
} from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import useDeviceDetection from '../hooks/useDeviceDetection.jsx'
import './Sidebar.css'
import ThemeToggle from './ThemeToggle'
import UserProfile from './UserProfile'

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Home,
    path: '/',
    color: '#667eea',
  },
  {
    id: 'donations',
    title: 'Bağış Yönetimi',
    icon: Coins,
    path: '/donations',
    color: '#10b981',
    subItems: [
      { title: 'Bağış Listesi', path: '/donations' },
      { title: 'Bağış Veznesi', path: '/donations/vault' },
      { title: 'Kurumlar', path: '/donations/institutions' },
      { title: 'Kumbara Takibi', path: '/bagis/kumbara-takibi' },
    ],
  },
  {
    id: 'meetings',
    title: 'Toplantılar',
    icon: Calendar,
    path: '/meetings',
    color: '#3b82f6',
    subItems: [
      { title: 'Tüm Toplantılar', path: '/meetings' },
      { title: 'Toplantı Planla', path: '/meetings/create' },
      { title: 'Toplantı Takvimi', path: '/meetings/calendar' },
    ],
  },
  {
    id: 'aid',
    title: 'Yardım Yönetimi',
    icon: HelpingHand,
    path: '/aid',
    color: '#10b981',
    subItems: [
      { title: 'İhtiyaç Sahipleri', path: '/yardim/ihtiyac-sahipleri' },
      { title: 'Yardım Başvuruları', path: '/aid/applications' },
      { title: 'Hastane Sevk', path: '/aid/hospital-referral' },
    ],
  },
  {
    id: 'finance',
    title: 'Mali Yönetim',
    icon: Calculator,
    path: '/finance',
    color: '#ef4444',
    subItems: [
      { title: 'Muhasebe', path: '/finance/accounting' },
      { title: 'Banka İşlemleri', path: '/finance/bank-orders' },
      { title: 'Finansal Raporlar', path: '/finance/reports' },
    ],
  },
  {
    id: 'volunteers',
    title: 'Gönüllü Yönetimi',
    icon: Users,
    path: '/volunteers',
    color: '#10b981',
    subItems: [
      { title: 'Gönüllü Listesi', path: '/volunteers' },
      { title: 'Gönüllü Ekle', path: '/volunteers/create' },
      { title: 'Gönüllü Raporları', path: '/volunteers/reports' },
    ],
  },
  {
    id: 'tasks',
    title: 'Görev Yönetimi',
    icon: CheckSquare,
    path: '/tasks',
    color: '#f59e0b',
    subItems: [
      { title: 'Görev Listesi', path: '/tasks' },
      { title: 'Görev Oluştur', path: '/tasks/create' },
      { title: 'Görev Takvimi', path: '/tasks/calendar' },
    ],
  },
  {
    id: 'messages',
    title: 'Mesajlaşma',
    icon: MessageSquare,
    path: '/messages',
    color: '#3b82f6',
    subItems: [
      { title: 'Mesaj Listesi', path: '/messages' },
      { title: 'SMS Gönder', path: '/messages/sms' },
      { title: 'WhatsApp', path: '/messages/whatsapp' },
      { title: 'Email', path: '/messages/email' },
    ],
  },
  {
    id: 'inventory',
    title: 'Envanter',
    icon: Package,
    path: '/inventory',
    color: '#f59e0b',
    subItems: [
      { title: 'Stok Listesi', path: '/inventory' },
      { title: 'Stok Girişi', path: '/inventory/stock-in' },
      { title: 'Stok Çıkışı', path: '/inventory/stock-out' },
      { title: 'Envanter Raporları', path: '/inventory/reports' },
    ],
  },
  {
    id: 'donors',
    title: 'Bağışçı Yönetimi',
    icon: Users,
    path: '/donors',
    color: '#10b981',
    subItems: [
      { title: 'Bağışçı Listesi', path: '/donors' },
      { title: 'CRM Yönetimi', path: '/donors/crm' },
      { title: 'Bağışçı Raporları', path: '/donors/reports' },
    ],
  },
  {
    id: 'scholarship',
    title: 'Burs Yönetimi',
    icon: GraduationCap,
    path: '/scholarship',
    color: '#10b981',
    subItems: [
      { title: 'Burs Programları', path: '/scholarship/programs' },
      { title: 'Burs Başvuruları', path: '/scholarship/applications' },
    ],
  },
  {
    id: 'fund',
    title: 'Fon Yönetimi',
    icon: Building2,
    path: '/fund',
    color: '#10b981',
    subItems: [
      { title: 'Fon Listesi', path: '/fund' },
      { title: 'Çalışma Alanları', path: '/fund/work-areas' },
    ],
  },
  {
    id: 'system',
    title: 'Sistem Yönetimi',
    icon: Shield,
    path: '/system',
    color: '#ef4444',
    subItems: [
      { title: 'Kullanıcı Yönetimi', path: '/system/user-management' },
      { title: 'IP Engelleme', path: '/system/ip-blocking' },
      { title: 'Sistem Ayarları', path: '/system/settings' },
      { title: 'Güvenlik Testi', path: '/security-test' },
      { title: 'Performance Dashboard', path: '/performance' },
    ],
  },
  {
    id: 'demo',
    title: 'Bileşenler Demo',
    icon: Layers,
    path: '/demo',
    color: '#8b5cf6',
  },
  {
    id: 'reports',
    title: 'Rapor Oluşturucu',
    icon: FileText,
    path: '/reports',
    color: '#10b981',
  },
  {
    id: 'theme',
    title: 'Tema Özelleştirici',
    icon: Palette,
    path: '/theme',
    color: '#f59e0b',
  },
  {
    id: 'form-builder',
    title: 'Form Oluşturucu',
    icon: CheckSquare,
    path: '/form-builder',
    color: '#ef4444',
  },
  {
    id: 'analytics',
    title: 'Gelişmiş Analitik',
    icon: BarChart3,
    path: '/analytics',
    color: '#8b5cf6',
  },
  {
    id: 'realtime',
    title: 'Canlı Dashboard',
    icon: Activity,
    path: '/realtime',
    color: '#06b6d4',
  },
  {
    id: 'workflow',
    title: 'Workflow Otomasyonu',
    icon: Workflow,
    path: '/workflow',
    color: '#f97316',
  },
  {
    id: 'todos',
    title: 'Todos',
    icon: CheckSquare,
    path: '/todos',
    color: '#8b5cf6',
  },
]

const Sidebar = ({ collapsed, onToggle }) => {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const { user, logout, hasPermission } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()
  const deviceInfo = useDeviceDetection()

  const handleMouseEnter = useCallback((item, event) => {
    if (item.subItems) {
      const rect = event.currentTarget.getBoundingClientRect()
      setPopupPosition({
        top: rect.top,
        left: rect.right + 10,
      })
      setHoveredItem(item)
    }
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
  const getFilteredMenuItems = (items = translatedMenuItems) => {
    return items // Return all items without filtering
  }

  // Alt menü öğeleri için çeviri anahtarını al
  const getSubItemTranslation = (parentId, path) => {
    const translationMap = {
      '/donations': 'navigation.donationList',
      '/donations/vault': 'navigation.donationVault',
      '/donations/institutions': 'navigation.institutions',
      '/bagis/kumbara-takibi': 'navigation.piggyBankTracking',
      '/meetings': 'navigation.allMeetings',
      '/meetings/create': 'navigation.scheduleMeeting',
      '/meetings/calendar': 'navigation.meetingCalendar',
      '/yardim/ihtiyac-sahipleri': 'navigation.beneficiaries',
      '/aid/applications': 'navigation.aidApplications',
      '/finance/accounting': 'navigation.accounting',
      '/finance/bank-orders': 'navigation.bankOperations',
      '/finance/reports': 'navigation.financialReports',
      '/volunteers': 'navigation.volunteerList',
      '/volunteers/create': 'navigation.addVolunteer',
      '/volunteers/reports': 'navigation.volunteerReports',
      '/tasks': 'navigation.taskList',
      '/tasks/create': 'navigation.createTask',
      '/tasks/calendar': 'navigation.taskCalendar',
      '/messages': 'navigation.messageList',
      '/messages/sms': 'navigation.sendSMS',
      '/messages/whatsapp': 'navigation.whatsapp',
      '/messages/email': 'navigation.email',
      '/inventory': 'navigation.stockList',
      '/inventory/stock-in': 'navigation.stockIn',
      '/inventory/stock-out': 'navigation.stockOut',
      '/inventory/reports': 'navigation.inventoryReports',
      '/donors': 'navigation.donorList',
      '/donors/crm': 'navigation.crmManagement',
      '/donors/reports': 'navigation.donorReports',
      '/scholarship/programs': 'navigation.scholarshipPrograms',
      '/scholarship/applications': 'navigation.scholarshipApplications',
      '/fund': 'navigation.fundList',
      '/fund/work-areas': 'navigation.workAreas',
      '/system/user-management': 'navigation.userManagement',
      '/system/ip-blocking': 'navigation.ipBlocking',
      '/system/settings': 'navigation.systemSettings',
    }

    return t(translationMap[path] || path)
  }

  // Menü öğelerini çevir
  const getTranslatedMenuItems = () => {
    return menuItems.map(item => ({
      ...item,
      title: t(`navigation.${item.id}`),
      subItems: item.subItems?.map(subItem => ({
        ...subItem,
        title: getSubItemTranslation(item.id, subItem.path),
      })),
    }))
  }

  const translatedMenuItems = getTranslatedMenuItems()
  const filteredMenuItems = getFilteredMenuItems(translatedMenuItems)

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
                <Link to={item.path} className="nav-link">
                  <motion.div
                    className="icon-wrapper"
                    style={{ backgroundColor: active ? item.color : 'transparent' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <IconComponent size={20} color={active ? 'white' : item.color} />
                  </motion.div>
                </Link>

                {item.subItems && (
                  <div className="submenu-indicator">
                    <ChevronRight size={12} color="#64748b" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </nav>
      </motion.div>

      <AnimatePresence>
        {hoveredItem && hoveredItem.subItems && (
          <motion.div
            className="popup-menu"
            style={{
              position: 'fixed',
              top: popupPosition.top,
              left: popupPosition.left,
              zIndex: 1000,
            }}
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="popup-header">
              <hoveredItem.icon size={16} color={hoveredItem.color} />
              <span>{hoveredItem.title}</span>
            </div>
            <div className="popup-items">
              {hoveredItem.subItems.map((subItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={subItem.path}
                    className={`popup-item ${isActive(subItem.path) ? 'active' : ''}`}
                  >
                    {subItem.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enterprise Features */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
          Enterprise
        </h3>
        <nav className="space-y-1">
          <NavLink
            to="/advanced-analytics"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Gelişmiş Analitik
          </NavLink>
          <NavLink
            to="/real-time-dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <Activity className="w-5 h-5 mr-3" />
            Real-time Dashboard
          </NavLink>
          <NavLink
            to="/monitoring-dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <Cpu className="w-5 h-5 mr-3" />
            Monitoring & Analytics
          </NavLink>
          <NavLink
            to="/workflow-automation"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Workflow Automation
          </NavLink>
          <NavLink
            to="/report-generator"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <FileText className="w-5 h-5 mr-3" />
            Rapor Oluşturucu
          </NavLink>
          <NavLink
            to="/theme-customizer"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <Palette className="w-5 h-5 mr-3" />
            Tema Özelleştirici
          </NavLink>
          <NavLink
            to="/form-builder"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <FormInput className="w-5 h-5 mr-3" />
            Form Oluşturucu
          </NavLink>
          <NavLink
            to="/components-demo"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`
            }
          >
            <Layers className="w-5 h-5 mr-3" />
            Bileşen Demo
          </NavLink>
        </nav>
      </div>

      {/* Device Info */}
      <div className="sidebar-footer">
        <UserProfile />
        <div className="mt-2 space-y-2">
          <ThemeToggle />
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </>
  )
}
export default memo(Sidebar, (prevProps, nextProps) => {
  return prevProps.collapsed === nextProps.collapsed
})
