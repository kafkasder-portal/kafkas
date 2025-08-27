import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

// Components
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ConnectionStatus from './components/ConnectionStatus'
import ErrorBoundary from './components/ErrorBoundary'
import MobileNavigation from './components/MobileNavigation'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import Tasks from './pages/Tasks'
import Donations from './pages/Donations'
import Beneficiaries from './pages/Beneficiaries'
import Volunteers from './pages/Volunteers'
import Finance from './pages/Finance'
import Messages from './pages/Messages'
import System from './pages/System'
import UserManagement from './pages/UserManagement'
import Aid from './pages/Aid'
import Fund from './pages/Fund'
import Scholarship from './pages/Scholarship'
import HospitalReferral from './pages/HospitalReferral'
import BudgetPlanning from './pages/BudgetPlanning'
import ProjectManagement from './pages/ProjectManagement'
import PiggyBankTracking from './pages/PiggyBankTracking'
import Meetings from './pages/Meetings'
import Donors from './pages/Donors'
import WhatsApp from './pages/WhatsApp'
import WhatsAppLogin from './pages/WhatsAppLogin'
import ProfileSettings from './pages/ProfileSettings'

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
          user ? <Navigate to="/" replace /> : <Login />
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory" element={
          <ProtectedRoute>
            <MainLayout>
              <Inventory />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoute>
            <MainLayout>
              <Tasks />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/donations" element={
          <ProtectedRoute>
            <MainLayout>
              <Donations />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/beneficiaries" element={
          <ProtectedRoute>
            <MainLayout>
              <Beneficiaries />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/volunteers" element={
          <ProtectedRoute>
            <MainLayout>
              <Volunteers />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/finance" element={
          <ProtectedRoute>
            <MainLayout>
              <Finance />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <MainLayout>
              <Messages />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/system" element={
          <ProtectedRoute>
            <MainLayout>
              <System />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/user-management" element={
          <ProtectedRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/aid" element={
          <ProtectedRoute>
            <MainLayout>
              <Aid />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/fund" element={
          <ProtectedRoute>
            <MainLayout>
              <Fund />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/scholarship" element={
          <ProtectedRoute>
            <MainLayout>
              <Scholarship />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/hospital-referral" element={
          <ProtectedRoute>
            <MainLayout>
              <HospitalReferral />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/budget-planning" element={
          <ProtectedRoute>
            <MainLayout>
              <BudgetPlanning />
            </MainLayout>
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
            <MainLayout>
              <PiggyBankTracking />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/meetings" element={
          <ProtectedRoute>
            <MainLayout>
              <Meetings />
            </MainLayout>
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
            <MainLayout>
              <WhatsApp />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/whatsapp-login" element={
          <ProtectedRoute>
            <MainLayout>
              <WhatsAppLogin />
            </MainLayout>
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
