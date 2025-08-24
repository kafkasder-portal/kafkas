import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Lock, Mail, Shield, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { validateEmail, validatePassword } from '../utils/validation'
import { rateLimiters, auditLogger, securityMonitor } from '../utils/security'
import { useAuth } from '../contexts/AuthContext'

import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [attempts, setAttempts] = useState(0)
  const [securityStatus, setSecurityStatus] = useState('secure')
  const [availableUsers, setAvailableUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Demo users for development
  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true)

      const demoUsers = [
        { email: 'admin@kafkas.org', name: 'Admin User', role: 'admin' },
        { email: 'manager@kafkas.org', name: 'Manager User', role: 'manager' },
        { email: 'volunteer@kafkas.org', name: 'Volunteer User', role: 'volunteer' },
      ]

      setAvailableUsers(demoUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchAvailableUsers()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir'
    } else {
      const emailResult = validateEmail(formData.email)
      if (!emailResult.isValid) {
        newErrors.email = emailResult.message
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
    } else {
      const passwordResult = validatePassword(formData.password)
      if (!passwordResult.isValid) {
        newErrors.password = passwordResult.message
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Check rate limiting
    if (!rateLimiters.login('anonymous')) {
      toast.error('Çok fazla giriş denemesi yaptınız. Lütfen 5 dakika bekleyin.')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSecurityStatus('warning')

    try {
      // Log login attempt
      auditLogger.log('login_attempt', null, {
        email: formData.email,
        userAgent: navigator.userAgent,
      })

      // Monitor for suspicious activity
      securityMonitor.monitorActivity({
        type: 'login_attempt',
        userId: null,
        data: { email: formData.email },
      })

      // Call the auth context login function
      const result = await login(formData.email, formData.password)

      if (result.success) {
        setSecurityStatus('secure')
        setAttempts(0)
        navigate('/')
      } else {
        setAttempts(prev => prev + 1)
        setSecurityStatus('error')

        // Log failed login
        auditLogger.log('login_failed', null, {
          email: formData.email,
          attempts: attempts + 1,
        })

        // Monitor for suspicious activity
        securityMonitor.monitorActivity({
          type: 'login_failed',
          userId: null,
          data: {
            email: formData.email,
            attempts: attempts + 1,
          },
        })
      }
    } catch (error) {
      setSecurityStatus('error')
      setAttempts(prev => prev + 1)
      toast.error('Giriş yapılırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-wrapper"
      >
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-circle">
            <span className="logo-text">K</span>
          </div>
          <h1 className="company-title">Kafkas Derneği</h1>
          <p className="company-subtitle">Yönetim Portalı</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="login-form-container"
        >
          <h2 className="form-title">Giriş Yap</h2>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-posta Adresi
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Mail className="icon" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <div className="input-error-icon">
                    <AlertCircle className="icon" />
                  </div>
                )}
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Lock className="icon" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input password-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
                {errors.password && (
                  <div className="input-error-icon password-error">
                    <AlertCircle className="icon" />
                  </div>
                )}
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <div className="remember-me">
                <input id="remember-me" name="remember-me" type="checkbox" className="checkbox" />
                <label htmlFor="remember-me" className="checkbox-label">
                  Beni hatırla
                </label>
              </div>
              <button type="button" className="forgot-password">
                Şifremi unuttum
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </motion.button>
          </form>

          {/* Demo Users */}
          {availableUsers.length > 0 && (
            <div className="admin-accounts">
              <div className="admin-accounts-header">
                <Users className="shield-icon" />
                <p className="admin-accounts-title">Kayıtlı Kullanıcılar:</p>
              </div>
              <div className="admin-accounts-list">
                {loadingUsers ? (
                  <div className="admin-account-item">
                    <p className="admin-email">Kullanıcılar yükleniyor...</p>
                  </div>
                ) : (
                  availableUsers.map((user, index) => (
                    <div key={index} className="admin-account-item">
                      <p className="admin-email">{user.email}</p>
                      <span className="admin-role">
                        {user.role === 'admin'
                          ? 'Yönetici'
                          : user.role === 'manager'
                            ? 'Müdür'
                            : user.role === 'volunteer'
                              ? 'Gönüllü'
                              : user.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <p className="admin-note">* Demo kullanıcılar (geliştirme için)</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">© 2024 Kafkas Derneği. Tüm hakları saklıdır.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
