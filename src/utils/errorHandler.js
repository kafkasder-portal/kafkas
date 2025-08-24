// Enhanced error handling utilities

/**
 * Global error handler for the application
 */
export const handleError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getCurrentUserId(),
    sessionId: getSessionId(),
    ...context
  }

  // Log error to console in development
  if (import.meta.env.DEV) {
    console.group('🚨 Error occurred')
    console.error('Error:', error)
    console.error('Context:', errorInfo)
    console.groupEnd()
  }

  // Send to logging service in production
  if (import.meta.env.PROD) {
    sendErrorToLoggingService(errorInfo)
  }

  // Store locally for offline scenarios
  storeErrorLocally(errorInfo)

  // Return a user-friendly error message
  return {
    message: getUserFriendlyMessage(error),
    details: import.meta.env.DEV ? error.message : null,
    errorId: generateErrorId()
  }
}

/**
 * API error handler with detailed response handling
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    const errorMap = {
      400: 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.',
      401: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
      403: 'Bu işlem için yetkiniz bulunmuyor.',
      404: 'Aradığınız kaynak bulunamadı.',
      422: 'Gönderilen veriler geçersiz. Lütfen kontrol edin.',
      429: 'Çok fazla istek gönderildi. Lütfen bekleyin.',
      500: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
      502: 'Sunucu geçici olarak kullanılamıyor.',
      503: 'Servis geçici olarak kullanılamıyor.',
      504: 'İstek zaman aşımına uğradı.'
    }
    
    const message = data?.message || errorMap[status] || 'Beklenmeyen bir hata oluştu.'
    
    // Handle authentication errors
    if (status === 401) {
      handleAuthenticationError()
    }
    
    return { 
      message, 
      status,
      code: data?.code,
      errors: data?.errors
    }
  } else if (error.request) {
    // Network error
    return { 
      message: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
      type: 'network_error'
    }
  } else {
    // Other error
    return handleError(error)
  }
}

/**
 * Report error to external monitoring service
 */
export const reportError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getCurrentUserId(),
    sessionId: getSessionId(),
    buildId: import.meta.env.VITE_BUILD_ID,
    version: import.meta.env.VITE_APP_VERSION,
    ...context
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.group('📊 Error reported')
    console.error('Error:', error)
    console.error('Report:', errorInfo)
    console.groupEnd()
  }

  // Send to monitoring service
  sendErrorToLoggingService(errorInfo)
  
  // Store locally
  storeErrorLocally(errorInfo)

  return errorInfo
}

/**
 * Send error to external logging service
 */
const sendErrorToLoggingService = async (errorInfo) => {
  try {
    // Example integration with Sentry, LogRocket, or custom service
    if (window.Sentry) {
      window.Sentry.captureException(new Error(errorInfo.message), {
        tags: {
          component: errorInfo.component,
          userId: errorInfo.userId
        },
        extra: errorInfo
      })
    }

    // Custom logging endpoint
    if (import.meta.env.VITE_ERROR_LOGGING_ENDPOINT) {
      await fetch(import.meta.env.VITE_ERROR_LOGGING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorInfo)
      })
    }
  } catch (loggingError) {
    console.error('Failed to send error to logging service:', loggingError)
  }
}

/**
 * Store error locally for offline scenarios
 */
const storeErrorLocally = (errorInfo) => {
  try {
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
    errors.push(errorInfo)
    
    // Keep only last 10 errors
    const recentErrors = errors.slice(-10)
    localStorage.setItem('app_errors', JSON.stringify(recentErrors))
  } catch (error) {
    console.error('Failed to store error locally:', error)
  }
}

/**
 * Get user-friendly error message
 */
const getUserFriendlyMessage = (error) => {
  // Known error types
  if (error.name === 'ChunkLoadError') {
    return 'Uygulama güncellemesi mevcut. Lütfen sayfayı yenileyin.'
  }
  
  if (error.message?.includes('Loading chunk')) {
    return 'Sayfa yüklenirken hata oluştu. Lütfen sayfayı yenileyin.'
  }
  
  if (error.message?.includes('Network Error')) {
    return 'Ağ bağlantısı sorunu. İnternet bağlantınızı kontrol edin.'
  }
  
  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
}

/**
 * Handle authentication errors
 */
const handleAuthenticationError = () => {
  // Clear user session
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  
  // Redirect to login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

/**
 * Get current user ID
 */
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData).id : null
  } catch {
    return null
  }
}

/**
 * Get session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

/**
 * Generate unique error ID
 */
const generateErrorId = () => {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Global error event handlers
 */
export const setupGlobalErrorHandlers = () => {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    reportError(event.reason, { type: 'unhandled_promise_rejection' })
  })

  // JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    reportError(event.error, { 
      type: 'javascript_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  // Resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('Resource loading error:', event.target)
      reportError(new Error(`Failed to load resource: ${event.target.src || event.target.href}`), {
        type: 'resource_error',
        element: event.target.tagName,
        source: event.target.src || event.target.href
      })
    }
  }, true)
}

/**
 * Get stored errors for debugging
 */
export const getStoredErrors = () => {
  try {
    return JSON.parse(localStorage.getItem('app_errors') || '[]')
  } catch {
    return []
  }
}

/**
 * Clear stored errors
 */
export const clearStoredErrors = () => {
  localStorage.removeItem('app_errors')
}