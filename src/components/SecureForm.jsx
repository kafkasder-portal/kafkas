import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { 
  validateForm, 
  sanitizeFormData, 
  validateRequired 
} from '../utils/validation'
import { 
  rateLimiters, 
  csrfManager, 
  auditLogger, 
  securityMonitor,
  sanitizeRequest 
} from '../utils/security'
import { useAuth } from '../contexts/AuthContext'

const SecureForm = ({ 
  fields, 
  onSubmit, 
  validationRules = {}, 
  rateLimitType = 'form',
  showSecurityIndicator = true,
  className = '',
  children 
}) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [securityStatus, setSecurityStatus] = useState('secure') // secure, warning, error
  const [csrfToken, setCsrfToken] = useState('')
  const [attempts, setAttempts] = useState(0)

  // Initialize form data
  useEffect(() => {
    const initialData = {}
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || ''
    })
    setFormData(initialData)
  }, [fields])

  // Generate CSRF token on mount
  useEffect(() => {
    if (user?.id) {
      const token = csrfManager.generateToken(user.id)
      setCsrfToken(token)
      localStorage.setItem('csrfToken', token)
    }
  }, [user])

  // Monitor form activity
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      securityMonitor.monitorActivity({
        type: 'form_interaction',
        userId: user?.id,
        data: { formFields: Object.keys(formData) }
      })
    }
  }, [formData, user])

  // Handle input change with sanitization
  const handleInputChange = useCallback((name, value) => {
    // Sanitize input
    const sanitizedValue = sanitizeRequest(value)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  // Validate single field
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name] || {}
    
    // Required validation
    if (rules.required) {
      const requiredValidation = validateRequired(value, rules.fieldName || name)
      if (!requiredValidation.isValid) {
        return requiredValidation.message
      }
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return ''

    // Custom validation
    if (rules.custom) {
      const customValidation = rules.custom(value, formData)
      if (!customValidation.isValid) {
        return customValidation.message
      }
    }

    return ''
  }, [validationRules, formData])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check rate limiting
    const rateLimiter = rateLimiters[rateLimitType]
    if (rateLimiter && !rateLimiter(user?.id || 'anonymous')) {
      toast.error('Çok fazla deneme yaptınız. Lütfen biraz bekleyin.')
      return
    }

    // Validate form
    const validation = validateForm(formData, validationRules)
    if (!validation.isValid) {
      setErrors(validation.errors)
      toast.error('Lütfen form hatalarını düzeltin.')
      return
    }

    setIsSubmitting(true)
    setSecurityStatus('warning')

    try {
      // Sanitize form data
      const sanitizedData = sanitizeFormData(formData)

      // Add CSRF token
      const submissionData = {
        ...sanitizedData,
        _csrf: csrfToken
      }

      // Log form submission
      auditLogger.log('form_submission', user?.id, {
        formType: rateLimitType,
        fields: Object.keys(formData)
      })

      // Monitor for suspicious activity
      securityMonitor.monitorActivity({
        type: 'form_submission',
        userId: user?.id,
        data: { formType: rateLimitType, fieldCount: Object.keys(formData).length }
      })

      // Submit form
      const result = await onSubmit(submissionData)

      setSecurityStatus('secure')
      setAttempts(0)
      
      // Log successful submission
      auditLogger.log('form_submission_success', user?.id, {
        formType: rateLimitType,
        result
      })

      toast.success('Form başarıyla gönderildi!')
      
      // Reset form if needed
      if (result?.resetForm) {
        const initialData = {}
        fields.forEach(field => {
          initialData[field.name] = field.defaultValue || ''
        })
        setFormData(initialData)
        setErrors({})
      }

    } catch (error) {
      setSecurityStatus('error')
      setAttempts(prev => prev + 1)

      // Log failed submission
      auditLogger.log('form_submission_failed', user?.id, {
        formType: rateLimitType,
        error: error.message,
        attempts: attempts + 1
      })

      // Monitor for suspicious activity
      securityMonitor.monitorActivity({
        type: 'form_submission_failed',
        userId: user?.id,
        data: { 
          formType: rateLimitType, 
          error: error.message,
          attempts: attempts + 1
        }
      })

      toast.error(error.message || 'Form gönderilirken bir hata oluştu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render security indicator
  const renderSecurityIndicator = () => {
    if (!showSecurityIndicator) return null

    const indicators = {
      secure: { icon: Shield, color: 'text-green-600', bg: 'bg-green-50', text: 'Güvenli' },
      warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'İşleniyor' },
      error: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', text: 'Hata' }
    }

    const indicator = indicators[securityStatus]
    const Icon = indicator.icon

    return (
      <motion.div 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${indicator.bg} ${indicator.color}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{indicator.text}</span>
      </motion.div>
    )
  }

  // Render form field
  const renderField = (field) => {
    const { name, type, label, placeholder, options = [], required, ...props } = field
    const error = errors[name]
    const value = formData[name] || ''

    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    const errorClasses = error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"

    const handleChange = (e) => {
      const newValue = e.target.value
      handleInputChange(name, newValue)
    }

    const handleBlur = () => {
      const fieldError = validateField(name, value)
      if (fieldError) {
        setErrors(prev => ({ ...prev, [name]: fieldError }))
      }
    }

    switch (type) {
      case 'textarea':
        return (
          <div key={name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`${baseClasses} ${errorClasses} resize-vertical min-h-[100px]`}
              {...props}
            />
            {error && (
              <motion.p 
                className="text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${baseClasses} ${errorClasses}`}
              {...props}
            >
              <option value="">{placeholder || 'Seçiniz'}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <motion.p 
                className="text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={(e) => handleInputChange(name, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...props}
            />
            <label className="text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && (
              <motion.p 
                className="text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        )

      default:
        return (
          <div key={name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`${baseClasses} ${errorClasses}`}
              {...props}
            />
            {error && (
              <motion.p 
                className="text-sm text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        )
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Security Indicator */}
      {renderSecurityIndicator()}

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map((field) => renderField(field))}
      </div>

      {/* Custom Children */}
      {children}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Gönder
          </>
        )}
      </motion.button>

      {/* Attempt Counter */}
      {attempts > 0 && (
        <motion.p 
          className="text-sm text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Deneme sayısı: {attempts}
        </motion.p>
      )}
    </motion.form>
  )
}

export default SecureForm
