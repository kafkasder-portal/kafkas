import { createRateLimiter, generateCSRFToken, validateCSRFToken } from './validation'

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.kafkasder.org wss://api.kafkasder.org",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
}

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  login: { maxRequests: 5, timeWindow: 300000 }, // 5 attempts per 5 minutes
  api: { maxRequests: 100, timeWindow: 60000 }, // 100 requests per minute
  upload: { maxRequests: 10, timeWindow: 60000 }, // 10 uploads per minute
  form: { maxRequests: 20, timeWindow: 60000 } // 20 form submissions per minute
}

// Create rate limiters
export const rateLimiters = {
  login: createRateLimiter(RATE_LIMIT_CONFIG.login.maxRequests, RATE_LIMIT_CONFIG.login.timeWindow),
  api: createRateLimiter(RATE_LIMIT_CONFIG.api.maxRequests, RATE_LIMIT_CONFIG.api.timeWindow),
  upload: createRateLimiter(RATE_LIMIT_CONFIG.upload.maxRequests, RATE_LIMIT_CONFIG.upload.timeWindow),
  form: createRateLimiter(RATE_LIMIT_CONFIG.form.maxRequests, RATE_LIMIT_CONFIG.form.timeWindow)
}

// CSRF token management
class CSRFManager {
  constructor() {
    this.tokens = new Map()
    this.tokenExpiry = 3600000 // 1 hour
  }

  generateToken(userId) {
    const token = generateCSRFToken()
    const expiry = Date.now() + this.tokenExpiry
    
    this.tokens.set(token, {
      userId,
      expiry,
      createdAt: Date.now()
    })
    
    // Clean up expired tokens
    this.cleanup()
    
    return token
  }

  validateToken(token, userId) {
    const tokenData = this.tokens.get(token)
    
    if (!tokenData) {
      return false
    }
    
    if (tokenData.userId !== userId) {
      return false
    }
    
    if (Date.now() > tokenData.expiry) {
      this.tokens.delete(token)
      return false
    }
    
    return true
  }

  revokeToken(token) {
    this.tokens.delete(token)
  }

  cleanup() {
    const now = Date.now()
    for (const [token, data] of this.tokens.entries()) {
      if (now > data.expiry) {
        this.tokens.delete(token)
      }
    }
  }
}

export const csrfManager = new CSRFManager()

// Security middleware for API calls
export const createSecureApiClient = (baseURL) => {
  const client = {
    async request(endpoint, options = {}) {
      const url = `${baseURL}${endpoint}`
      
      // Add security headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...SECURITY_HEADERS,
        ...options.headers
      }
      
      // Add CSRF token if available
      const token = localStorage.getItem('csrfToken')
      if (token) {
        headers['X-CSRF-Token'] = token
      }
      
      // Add authentication token
      const authToken = localStorage.getItem('token')
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      
      try {
        const response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include'
        })
        
        // Handle rate limiting
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
        
        // Handle CSRF token refresh
        if (response.status === 403 && response.headers.get('X-CSRF-Required')) {
          const newToken = csrfManager.generateToken(localStorage.getItem('userId'))
          localStorage.setItem('csrfToken', newToken)
          
          // Retry request with new token
          headers['X-CSRF-Token'] = newToken
          return fetch(url, { ...options, headers, credentials: 'include' })
        }
        
        return response
      } catch (error) {
        console.error('API request failed:', error)
        throw error
      }
    },
    
    get(endpoint, options = {}) {
      return this.request(endpoint, { ...options, method: 'GET' })
    },
    
    post(endpoint, data, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    
    put(endpoint, data, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    
    delete(endpoint, options = {}) {
      return this.request(endpoint, { ...options, method: 'DELETE' })
    }
  }
  
  return client
}

// Input sanitization middleware
export const sanitizeRequest = (data) => {
  if (typeof data === 'string') {
    return data.replace(/[<>]/g, '')
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeRequest(item))
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeRequest(value)
    }
    return sanitized
  }
  
  return data
}

// Session security
export const secureSession = {
  // Generate secure session ID
  generateSessionId() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  },
  
  // Validate session
  validateSession(sessionId) {
    if (!sessionId || sessionId.length !== 64) {
      return false
    }
    
    // Check if session exists and is not expired
    const sessionData = localStorage.getItem(`session_${sessionId}`)
    if (!sessionData) {
      return false
    }
    
    try {
      const session = JSON.parse(sessionData)
      if (Date.now() > session.expiry) {
        localStorage.removeItem(`session_${sessionId}`)
        return false
      }
      
      return true
    } catch {
      return false
    }
  },
  
  // Create new session
  createSession(userId, userData) {
    const sessionId = this.generateSessionId()
    const session = {
      id: sessionId,
      userId,
      userData,
      createdAt: Date.now(),
      expiry: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      lastActivity: Date.now()
    }
    
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(session))
    return sessionId
  },
  
  // Update session activity
  updateSessionActivity(sessionId) {
    const sessionData = localStorage.getItem(`session_${sessionId}`)
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        session.lastActivity = Date.now()
        localStorage.setItem(`session_${sessionId}`, JSON.stringify(session))
      } catch {
        // Session data corrupted, remove it
        localStorage.removeItem(`session_${sessionId}`)
      }
    }
  },
  
  // Destroy session
  destroySession(sessionId) {
    localStorage.removeItem(`session_${sessionId}`)
  }
}

// File upload security
export const secureFileUpload = {
  // Allowed file types
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },
  
  // Maximum file sizes (in bytes)
  maxSizes: {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    spreadsheet: 10 * 1024 * 1024 // 10MB
  },
  
  // Validate file
  validateFile(file, allowedCategories = ['image', 'document']) {
    const errors = []
    
    // Check file size
    const maxSize = Math.max(...allowedCategories.map(cat => this.maxSizes[cat]))
    if (file.size > maxSize) {
      errors.push(`Dosya boyutu çok büyük. Maksimum ${Math.round(maxSize / 1024 / 1024)}MB olmalıdır.`)
    }
    
    // Check file type
    const allowedTypes = allowedCategories.flatMap(cat => this.allowedTypes[cat])
    if (!allowedTypes.includes(file.type)) {
      errors.push('Desteklenmeyen dosya türü.')
    }
    
    // Check file name
    const fileName = file.name.toLowerCase()
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      errors.push('Geçersiz dosya adı.')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  
  // Generate secure filename
  generateSecureFilename(originalName) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}_${random}.${extension}`
  }
}

// Audit logging
export const auditLogger = {
  log(action, userId, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      userAgent: navigator.userAgent,
      ip: 'client-side', // Will be set by server
      details,
      sessionId: localStorage.getItem('sessionId')
    }
    
    // Send to server for logging
    this.sendToServer(logEntry)
    
    // Also log locally for debugging
    console.log('Audit Log:', logEntry)
  },
  
  async sendToServer(logEntry) {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.error('Failed to send audit log:', error)
    }
  }
}

// Security monitoring
export const securityMonitor = {
  suspiciousActivities: [],
  
  // Monitor for suspicious activities
  monitorActivity(activity) {
    const suspicious = this.detectSuspiciousActivity(activity)
    
    if (suspicious) {
      this.suspiciousActivities.push({
        ...activity,
        timestamp: Date.now(),
        severity: suspicious.severity
      })
      
      // Log suspicious activity
      auditLogger.log('suspicious_activity', activity.userId, {
        activity: activity.type,
        severity: suspicious.severity,
        details: suspicious.details
      })
      
      // Take action based on severity
      if (suspicious.severity === 'high') {
        this.handleHighSeverityActivity(activity)
      }
    }
  },
  
  // Detect suspicious activities
  detectSuspiciousActivity(activity) {
    const { type, userId, data } = activity
    
    // Multiple failed login attempts
    if (type === 'login_failed') {
      const recentFailures = this.suspiciousActivities.filter(
        a => a.type === 'login_failed' && a.userId === userId && 
        Date.now() - a.timestamp < 300000 // 5 minutes
      )
      
      if (recentFailures.length >= 3) {
        return {
          severity: 'high',
          details: 'Multiple failed login attempts'
        }
      }
    }
    
    // Unusual data access patterns
    if (type === 'data_access' && data.recordCount > 1000) {
      return {
        severity: 'medium',
        details: 'Large data access request'
      }
    }
    
    // Rapid form submissions
    if (type === 'form_submission') {
      const recentSubmissions = this.suspiciousActivities.filter(
        a => a.type === 'form_submission' && a.userId === userId &&
        Date.now() - a.timestamp < 60000 // 1 minute
      )
      
      if (recentSubmissions.length >= 10) {
        return {
          severity: 'medium',
          details: 'Rapid form submissions'
        }
      }
    }
    
    return null
  },
  
  // Handle high severity activities
  handleHighSeverityActivity(activity) {
    // Log out user
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('csrfToken')
    
    // Redirect to login
    window.location.href = '/login?security=alert'
    
    // Notify admin (in real implementation)
    console.warn('High severity security activity detected:', activity)
  }
}
