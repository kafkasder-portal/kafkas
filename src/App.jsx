import React, { Suspense, lazy, memo, useState } from 'react'
import { Route, BrowserRouter as Router, Routes, RouterProvider } from 'react-router-dom'
import './App.css'
import './animations.css'
import AnimatedRoutes from './components/AnimatedRoutes'
import ConnectionStatus from './components/ConnectionStatus'
import ErrorBoundary from './components/ErrorBoundary'
import LanguageSwitcher from './components/LanguageSwitcher'
import MobileNavigation from './components/MobileNavigation'
import NotificationPanel from './components/NotificationPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import useDeviceDetection from './hooks/useDeviceDetection.jsx'

// Lazy loading ile sayfa componentlerini yükle
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Donations = lazy(() => import('./pages/Donations'))
const Meetings = lazy(() => import('./pages/Meetings'))
const Aid = lazy(() => import('./pages/Aid'))
const Beneficiaries = lazy(() => import('./pages/Beneficiaries'))
const BeneficiaryDetail = lazy(() => import('./pages/BeneficiaryDetail'))
const Finance = lazy(() => import('./pages/Finance'))
const Volunteers = lazy(() => import('./pages/Volunteers'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Messages = lazy(() => import('./pages/Messages'))
const WhatsApp = lazy(() => import('./pages/WhatsApp'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Donors = lazy(() => import('./pages/Donors'))
const Scholarship = lazy(() => import('./pages/Scholarship'))
const Fund = lazy(() => import('./pages/Fund'))
const PiggyBankTracking = lazy(() => import('./pages/PiggyBankTracking'))
const System = lazy(() => import('./pages/System'))
const UserManagement = lazy(() => import('./pages/UserManagement'))
const HospitalReferral = lazy(() => import('./pages/HospitalReferral'))
const TodosList = lazy(() => import('./components/TodosList'))

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '1.2rem',
      color: '#667eea',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    ></div>
    <span style={{ marginLeft: '1rem' }}>Yükleniyor...</span>
  </div>
)

const AppContent = memo(() => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const deviceInfo = useDeviceDetection()
  const { isAuthenticated } = useAuth()

  return (
    <div className={`app device-${deviceInfo.type} ${deviceInfo.orientation}`}>
      <ConnectionStatus />

      {/* Show login page if not authenticated */}
      {!isAuthenticated ? (
        <Login />
      ) : (
        <>
          {/* Mobile Navigation */}
          {deviceInfo.isMobile && <MobileNavigation />}

          {/* Desktop Navigation */}
          {!deviceInfo.isMobile && (
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          )}

          <main
            className={`main-content ${sidebarCollapsed ? 'expanded' : ''} ${deviceInfo.isMobile ? 'mobile' : ''}`}
          >
            {!deviceInfo.isMobile && (
              <div className="main-header">
                <div className="header-actions">
                  <LanguageSwitcher variant="icon" />
                  <NotificationPanel />
                </div>
              </div>
            )}
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/donations/*"
                    element={
                      <ProtectedRoute>
                        <Donations />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meetings/*"
                    element={
                      <ProtectedRoute>
                        <Meetings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/aid/*"
                    element={
                      <ProtectedRoute>
                        <Aid />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/aid/hospital-referral"
                    element={
                      <ProtectedRoute>
                        <HospitalReferral />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/beneficiaries"
                    element={
                      <ProtectedRoute>
                        <Beneficiaries />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/beneficiaries/:id"
                    element={
                      <ProtectedRoute>
                        <BeneficiaryDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/finance/*"
                    element={
                      <ProtectedRoute requiredPermissions={['finance']}>
                        <Finance />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/volunteers/*"
                    element={
                      <ProtectedRoute>
                        <Volunteers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tasks/*"
                    element={
                      <ProtectedRoute>
                        <Tasks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages/*"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages/whatsapp"
                    element={
                      <ProtectedRoute>
                        <WhatsApp />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/inventory/*"
                    element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/donors/*"
                    element={
                      <ProtectedRoute>
                        <Donors />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/scholarship/*"
                    element={
                      <ProtectedRoute>
                        <Scholarship />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/fund/*"
                    element={
                      <ProtectedRoute>
                        <Fund />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bagis/kumbara-takibi"
                    element={
                      <ProtectedRoute>
                        <PiggyBankTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/system/*"
                    element={
                      <ProtectedRoute requiredRoles={['admin']}>
                        <System />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/system/user-management"
                    element={
                      <ProtectedRoute requiredRoles={['admin']}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/todos"
                    element={
                      <ProtectedRoute>
                        <TodosList />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AnimatedRoutes>
            </Suspense>
          </main>
        </>
      )}
    </div>
  )
})



function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppContent />
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
