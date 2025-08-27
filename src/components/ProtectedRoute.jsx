import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ children, requiredPermissions = [], requiredRoles = [] }) => {
  const { isAuthenticated, loading, user, hasPermission, hasRole } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </motion.div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role))
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h1>
            <p className="text-gray-600 mb-4">
              Bu sayfaya erişim için gerekli yetkiye sahip değilsiniz.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>
      )
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission => hasPermission(permission))
    if (!hasRequiredPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Yetki Gerekli</h1>
            <p className="text-gray-600 mb-4">
              Bu işlemi gerçekleştirmek için gerekli izinlere sahip değilsiniz.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>
      )
    }
  }

  // User is authenticated and has required permissions/roles
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute
