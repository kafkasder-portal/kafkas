import React from 'react'
import { toast } from 'sonner'

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTH_FORBIDDEN',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  [ERROR_TYPES.AUTHENTICATION]: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
  [ERROR_TYPES.AUTHORIZATION]: 'Bu işlem için yetkiniz bulunmuyor.',
  [ERROR_TYPES.VALIDATION]: 'Girilen bilgiler geçersiz. Lütfen kontrol edin.',
  [ERROR_TYPES.SERVER]: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
  [ERROR_TYPES.UNKNOWN]: 'Beklenmeyen bir hata oluştu.'
}

// Get error type based on status code
const getErrorType = (status) => {
  if (status === 401) return ERROR_TYPES.AUTHENTICATION
  if (status === 403) return ERROR_TYPES.AUTHORIZATION
  if (status === 422) return ERROR_TYPES.VALIDATION
  if (status >= 500) return ERROR_TYPES.SERVER
  if (status === 0) return ERROR_TYPES.NETWORK
  return ERROR_TYPES.UNKNOWN
}

// Enhanced error handler
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    logError = true,
    customMessage = null,
    redirectOnAuth = true
  } = options

  let errorType = ERROR_TYPES.UNKNOWN
  let message = ERROR_MESSAGES[ERROR_TYPES.UNKNOWN]
  let details = null

  if (error?.status) {
    errorType = getErrorType(error.status)
    message = ERROR_MESSAGES[errorType]
    details = error.data
  } else if (error?.message) {
    message = error.message
  }

  // Use custom message if provided
  if (customMessage) {
    message = customMessage
  }

  // Log error for debugging
  if (logError) {
    console.error('Error Handler:', {
      type: errorType,
      status: error?.status,
      message: error?.message,
      details,
      stack: error?.stack
    })
  }

  // Show toast notification
  if (showToast) {
    toast.error(message)
  }

  // Handle authentication errors
  if (errorType === ERROR_TYPES.AUTHENTICATION && redirectOnAuth) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }

  return {
    type: errorType,
    message,
    details,
    originalError: error
  }
}

// Specific error handlers
export const handleApiError = (error) => {
  return handleError(error, {
    showToast: true,
    logError: true,
    redirectOnAuth: true
  })
}

export const handleFormError = (error) => {
  return handleError(error, {
    showToast: true,
    logError: true,
    redirectOnAuth: false
  })
}

export const handleSilentError = (error) => {
  return handleError(error, {
    showToast: false,
    logError: true,
    redirectOnAuth: false
  })
}

// Async error wrapper
export const withErrorHandling = (asyncFn, errorOptions = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      handleError(error, errorOptions)
      throw error
    }
  }
}

// React error boundary helper
export const createErrorBoundary = (fallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error }
    }

    componentDidCatch(error, _errorInfo) {
      handleError(error, {
        showToast: false,
        logError: true,
        redirectOnAuth: false
      })
    }

    render() {
      if (this.state.hasError) {
        return fallbackComponent ? fallbackComponent(this.state.error) : React.createElement('div', null, 'Something went wrong.')
      }

      return this.props.children
    }
  }
}

export default {
  ERROR_TYPES,
  ERROR_MESSAGES,
  handleError,
  handleApiError,
  handleFormError,
  handleSilentError,
  withErrorHandling,
  createErrorBoundary
}