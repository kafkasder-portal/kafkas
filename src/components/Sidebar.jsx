import { AnimatePresence, motion } from 'framer-motion'
import {
  Calculator,
  CheckSquare,
  Coins,
  Home,
  LogOut,
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
  {
    id: 'test',
    title: 'Test',
    icon: CheckSquare,
    path: '/test',
    color: '#10b981',
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
                <button 
                  className="nav-link"
                  onClick={() => {
                    console.log('Button clicked:', item.path)
                    console.log('Current location:', window.location.pathname)
                    // Manual navigation
                    window.location.href = item.path
                  }}
                >
                  <motion.div
                    className="icon-wrapper"
                    style={{ backgroundColor: active ? item.color : 'transparent' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <IconComponent size={20} color={active ? 'white' : item.color} />
                  </motion.div>
                </button>

                {/* Removed submenu indicators for simplified navigation */}
              </motion.div>
            )
          })}
        </nav>
      </motion.div>

      {/* Submenu popup removed for simplified navigation */}

      {/* Enterprise Features removed for simplified navigation */}

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
