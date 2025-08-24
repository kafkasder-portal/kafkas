/**
 * Validation utility functions
 * Consolidates common validation logic used across multiple components
 */

/**
 * Validates if a field is not empty
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} zorunludur`
  }
  return null
}

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Geçerli bir e-posta adresi girin'
  }
  return null
}

/**
 * Validates Turkish phone number format
 * @param {string} phone - The phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateTurkishPhone = (phone) => {
  if (!phone) return null
  if (!/^\+90\s\d{3}\s\d{3}\s\d{4}$/.test(phone)) {
    return 'Telefon formatı: +90 5XX XXX XXXX'
  }
  return null
}

/**
 * Validates Turkish ID number (TC Kimlik No)
 * @param {string} tcNo - The TC number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateTCNo = (tcNo) => {
  if (!tcNo) return null
  if (tcNo.length !== 11) {
    return 'TC Kimlik No 11 haneli olmalıdır'
  }
  // Additional TC validation logic can be added here
  return null
}

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) return 'Şifre gereklidir'
  if (password.length < 8) {
    return 'Şifre en az 8 karakter olmalıdır'
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
  }
  return null
}

/**
 * Validates IBAN format
 * @param {string} iban - The IBAN to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateIban = (iban) => {
  if (!iban) return 'IBAN gereklidir'

  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase()

  // Turkish IBAN should start with TR and be 26 characters
  if (!cleanIban.startsWith('TR')) {
    return 'IBAN TR ile başlamalıdır'
  }

  if (cleanIban.length !== 26) {
    return 'IBAN 26 karakter olmalıdır'
  }

  return null
}

/**
 * Generic form validation function
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - Object containing validation rules for each field
 * @returns {Object} Object containing errors for each field
 */
export const validateForm = (formData, validationRules) => {
  const errors = {}

  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName]
    const value = formData[fieldName]

    // Check required fields
    if (rules.required) {
      const error = validateRequired(value, rules.label || fieldName)
      if (error) {
        errors[fieldName] = error
        return
      }
    }

    // Check specific validators
    if (rules.validator) {
      const error = rules.validator(value)
      if (error) {
        errors[fieldName] = error
      }
    }

    // Check email validation
    if (rules.email && value) {
      const error = validateEmail(value)
      if (error) {
        errors[fieldName] = error
      }
    }

    // Check phone validation
    if (rules.phone && value) {
      const error = validateTurkishPhone(value)
      if (error) {
        errors[fieldName] = error
      }
    }

    // Check TC validation
    if (rules.tcNo && value) {
      const error = validateTCNo(value)
      if (error) {
        errors[fieldName] = error
      }
    }

    // Check IBAN validation
    if (rules.iban && value) {
      const error = validateIban(value)
      if (error) {
        errors[fieldName] = error
      }
    }

    // Check min length
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[fieldName] = `En az ${rules.minLength} karakter olmalıdır`
    }

    // Check max length
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[fieldName] = `En fazla ${rules.maxLength} karakter olmalıdır`
    }
  })

  return errors
}

/**
 * Checks if form has any errors
 * @param {Object} errors - The errors object
 * @returns {boolean} True if there are no errors
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0
}

/**
 * Creates a rate limiter for API endpoints
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Rate limiter function
 */
export const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map()
  
  return (identifier) => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean old requests
    requests.forEach((timestamps, key) => {
      const validTimestamps = timestamps.filter(time => time > windowStart)
      if (validTimestamps.length === 0) {
        requests.delete(key)
      } else {
        requests.set(key, validTimestamps)
      }
    })
    
    // Check current requests
    const userRequests = requests.get(identifier) || []
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= maxRequests) {
      return false // Rate limit exceeded
    }
    
    // Add current request
    validRequests.push(now)
    requests.set(identifier, validRequests)
    
    return true // Request allowed
  }
}

/**
 * Generates a CSRF token
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validates CSRF token
 * @param {string} token - Token to validate
 * @param {string} expectedToken - Expected token
 * @returns {boolean} True if valid
 */
export const validateCSRFToken = (token, expectedToken) => {
  if (!token || !expectedToken) return false
  return token === expectedToken
}

/**
 * Sanitizes form data to prevent XSS attacks
 * @param {Object} formData - Form data to sanitize
 * @returns {Object} Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  const sanitized = {}
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Basic HTML sanitization - remove script tags and dangerous attributes
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim()
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

// Export aliases for different naming conventions
export const validatePhone = validateTurkishPhone
export const validateTCKimlik = validateTCNo
export const validateIBAN = validateIban
export const sanitizeInput = sanitizeFormData

/**
 * Validates monetary amounts
 * @param {string|number} amount - Amount to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateAmount = (amount) => {
  if (!amount && amount !== 0) return 'Tutar gereklidir'
  const numAmount = parseFloat(amount)
  if (isNaN(numAmount)) return 'Geçerli bir tutar girin'
  if (numAmount < 0) return 'Tutar negatif olamaz'
  if (numAmount > 1000000) return 'Tutar çok yüksek'
  return null
}