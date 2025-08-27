import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

// Components
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import ConnectionStatus from './components/ConnectionStatus.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import MobileNavigation from './components/MobileNavigation.jsx'

// Pages
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Inventory from './pages/Inventory.jsx'
import Finance from './pages/Finance.jsx'
import Messages from './pages/Messages.jsx'
import System from './pages/System.jsx'
import UserManagement from './pages/UserManagement.jsx'
import Aid from './pages/Aid.jsx'
import Fund from './pages/Fund.jsx'
import Scholarship from './pages/Scholarship.jsx'
import HospitalReferral from './pages/HospitalReferral.jsx'
import BudgetPlanning from './pages/BudgetPlanning.jsx'
import ProjectManagement from './pages/ProjectManagement.jsx'
import PiggyBankTracking from './pages/PiggyBankTracking.jsx'
import Meetings from './pages/Meetings.jsx'
import Donors from './pages/Donors.jsx'
import WhatsApp from './pages/WhatsApp.jsx'
import WhatsAppLogin from './pages/WhatsAppLogin.jsx'
import ProfileSettings from './pages/ProfileSettings.jsx'

// New Design System Pages
import DashboardNew from './pages/DashboardNew.jsx'
import LoginNew from './pages/LoginNew.jsx'
import BeneficiariesNew from './pages/BeneficiariesNew.jsx'
import DonationsNew from './pages/DonationsNew.jsx'
import TasksNew from './pages/TasksNew.jsx'
import VolunteersNew from './pages/VolunteersNew.jsx'
import FinanceNew from './pages/FinanceNew.jsx'
import UserManagementNew from './pages/UserManagementNew.jsx'
import InventoryNew from './pages/InventoryNew.jsx'
import SystemNew from './pages/SystemNew.jsx'
import MessagesNew from './pages/MessagesNew.jsx'
import WhatsAppNew from './pages/WhatsAppNew.jsx'
import WhatsAppLoginNew from './pages/WhatsAppLoginNew.jsx'
import MeetingsNew from './pages/MeetingsNew.jsx'
import AidNew from './pages/AidNew.jsx'
import FundNew from './pages/FundNew.jsx'
import ScholarshipNew from './pages/ScholarshipNew.jsx'
import HospitalReferralNew from './pages/HospitalReferralNew.jsx'
import BudgetPlanningNew from './pages/BudgetPlanningNew.jsx'
import PiggyBankTrackingNew from './pages/PiggyBankTrackingNew.jsx'

// Design System Layout
import DesignSystemLayout from './layouts/DesignSystemLayout'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '64px', 
            height: '64px', 
            border: '3px solid rgba(255,255,255,0.3)', 
            borderTop: '3px solid white', 
            borderRadius: '50%'
          }}
        />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

// Main Layout Component
const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Connection Status */}
        <ConnectionStatus />
        
        {/* Mobile Navigation */}
        {isMobile && <MobileNavigation />}
        
        {/* Page Content */}
        <div className="page-content">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

// App Content Component
function AppContent() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '64px', 
            height: '64px', 
            border: '3px solid rgba(255,255,255,0.3)', 
            borderTop: '3px solid white', 
            borderRadius: '50%'
          }}
        />
      </div>
    )
  }
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginNew />
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <DashboardNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <InventoryNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <TasksNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/donations" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <DonationsNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/beneficiaries" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <BeneficiariesNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/volunteers" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <VolunteersNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/finance" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <FinanceNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <MessagesNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/system" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <SystemNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/user-management" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <UserManagementNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/aid" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <AidNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/fund" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <FundNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/scholarship" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <ScholarshipNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/hospital-referral" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <HospitalReferralNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/budget-planning" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <BudgetPlanningNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/project-management" element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectManagement />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/piggy-bank-tracking" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <PiggyBankTrackingNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/meetings" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <MeetingsNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/donors" element={
          <ProtectedRoute>
            <MainLayout>
              <Donors />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/whatsapp" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <WhatsAppNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/whatsapp-login" element={
          <ProtectedRoute>
            <DesignSystemLayout>
              <WhatsAppLoginNew />
            </DesignSystemLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile-settings" element={
          <ProtectedRoute>
            <MainLayout>
              <ProfileSettings />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
