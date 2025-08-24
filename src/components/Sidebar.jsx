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
    id: 'inventory',
    title: 'Envanter',
    icon: Package,
    path: '/inventory',
    color: '#f59e0b',
  },
  {
    id: 'tasks',
    title: 'Görevler',
    icon: CheckSquare,
    path: '/tasks',
    color: '#f59e0b',
  },
  {
    id: 'donations',
    title: 'Bağışlar',
    icon: Coins,
    path: '/donations',
    color: '#10b981',
  },
  {
    id: 'beneficiaries',
    title: 'İhtiyaç Sahipleri',
    icon: Users,
    path: '/beneficiaries',
    color: '#10b981',
  },
  {
    id: 'volunteers',
    title: 'Gönüllüler',
    icon: Users,
    path: '/volunteers',
    color: '#3b82f6',
  },
  {
    id: 'finance',
    title: 'Finans',
    icon: Calculator,
    path: '/finance',
    color: '#ef4444',
  },
  {
    id: 'messages',
    title: 'Mesajlar',
    icon: MessageSquare,
    path: '/messages',
    color: '#8b5cf6',
  },
  {
    id: 'system',
    title: 'Sistem',
    icon: Shield,
    path: '/system',
    color: '#ef4444',
  },
]

const Sidebar = ({ collapsed, onToggle }) => {
  // Removed hover states for simplified navigation
  const { user, logout, hasPermission } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()
  const deviceInfo = useDeviceDetection()

  const handleMouseEnter = useCallback((item, event) => {
    // Simplified hover handling without submenus
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Simplified mouse leave handling
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

                {/* Removed submenu indicators for simplified navigation */}
              </motion.div>
            )
          })}
        </nav>
      </motion.div>

      {/* Submenu popup removed for simplified navigation */}

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
