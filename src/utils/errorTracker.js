/**
 * Console Error Tracking System
 * Monitors and reports errors, warnings, and performance issues
 */

class ErrorTracker {
  constructor() {
    this.errors = []
    this.warnings = []
    this.apiErrors = []
    this.performanceIssues = []
    this.maxErrors = 100
    this.isInitialized = false
    this.errorCount = 0
    this.warningCount = 0
    
    // Error categories
    this.categories = {
      'console.error': 0,
      'console.warn': 0,
      'api.error': 0,
      'network.error': 0,
      'react.error': 0,
      'javascript.error': 0,
      'performance.error': 0
    }
  }

  // Initialize error tracking
  init() {
    if (this.isInitialized) return

    // Override console methods
    this.overrideConsole()
    
    // Setup global error handlers
    this.setupGlobalErrorHandlers()
    
    // Setup React error boundary
    this.setupReactErrorBoundary()
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring()
    
    // Setup API error tracking
    this.setupAPIErrorTracking()
    
    // Setup network error tracking
    this.setupNetworkErrorTracking()
    
    // Setup periodic reporting
    this.setupPeriodicReporting()
    
    this.isInitialized = true
  }

  // Override console methods to capture errors and warnings
  overrideConsole() {
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log

    console.error = (...args) => {
      this.trackError('console.error', {
        message: args.join(' '),
        stack: new Error().stack,
        timestamp: new Date().toISOString(),
        args
      })
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      this.trackWarning('console.warn', {
        message: args.join(' '),
        stack: new Error().stack,
        timestamp: new Date().toISOString(),
        args
      })
      originalWarn.apply(console, args)
    }

    // Track important logs
    console.log = (...args) => {
      const message = args.join(' ')
<<<<<<< Current (Your changes)
      if (
        message.includes('error') ||
        message.includes('Error') ||
        message.includes('failed') ||
        message.includes('Failed')
      ) {
        this.trackWarning('console.log', {
          message,
=======
      if (message.includes('error') || message.includes('Error') || 
          message.includes('failed') || message.includes('Failed')) {
        this.trackError('console.error', {
          message: message,
>>>>>>> Incoming (Background Agent changes)
          stack: new Error().stack,
          timestamp: new Date().toISOString(),
          args
        })
      }
      originalLog.apply(console, args)
    }
  }

  // Setup global error handlers
  setupGlobalErrorHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('promise.rejection', {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        reason: event.reason
      })
    })

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript.error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      })
    })

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        this.trackError('resource.error', {
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          resource: event.target.src || event.target.href,
          timestamp: new Date().toISOString()
        })
      }
    }, true)
  }

  // Setup React error boundary
  setupReactErrorBoundary() {
    // This will be used by ErrorBoundary component
    window.reactErrorHandler = (error, errorInfo) => {
      this.trackError('react.error', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.trackPerformanceIssue('long.task', {
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: new Date().toISOString()
            })
          }
        })
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })

      // Memory usage
      if ('memory' in performance) {
        setInterval(() => {
          const memory = performance.memory
          if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
            this.trackPerformanceIssue('memory.high', {
              used: memory.usedJSHeapSize,
              limit: memory.jsHeapSizeLimit,
              percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
              timestamp: new Date().toISOString()
            })
          }
        }, 30000) // Check every 30 seconds
      }
    }
  }

  // Setup API error tracking
  setupAPIErrorTracking() {
    // Override fetch to track API errors
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        
        if (!response.ok) {
          this.trackAPIError({
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            duration: performance.now() - startTime,
            timestamp: new Date().toISOString()
          })
        }
        
        return response
      } catch (error) {
        this.trackAPIError({
          url: args[0],
          error: error.message,
          duration: performance.now() - startTime,
          timestamp: new Date().toISOString()
        })
        throw error
      }
    }
  }

  // Setup network error tracking
  setupNetworkErrorTracking() {
    // Network status changes
    window.addEventListener('online', () => {
      this.trackWarning('network.online', {
        message: 'Network connection restored',
        timestamp: new Date().toISOString()
      })
    })

    window.addEventListener('offline', () => {
      this.trackError('network.offline', {
        message: 'Network connection lost',
        timestamp: new Date().toISOString()
      })
    })

    // Slow network detection
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        const connection = navigator.connection
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          this.trackPerformanceIssue('network.slow', {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            timestamp: new Date().toISOString()
          })
        }
      })
    }
  }

  // Setup periodic reporting
  setupPeriodicReporting() {
    // Report errors every 5 minutes
    setInterval(() => {
      this.reportErrors()
    }, 5 * 60 * 1000)

    // Clean old errors every hour
    setInterval(() => {
      this.cleanOldErrors()
    }, 60 * 60 * 1000)
  }

  // Track an error
  trackError(category, data) {
    const error = {
      id: this.generateId(),
      category,
      ...data,
      severity: 'error',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    this.errors.push(error)
    this.categories[category] = (this.categories[category] || 0) + 1
    this.errorCount++

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🔴 Error Tracked: ${category}`)
      console.groupEnd()
    }

    // Send immediate report for critical errors
    if (category.includes('javascript.error') || category.includes('react.error')) {
      this.sendImmediateReport(error)
    }
  }

  // Track a warning
  trackWarning(category, data) {
    const warning = {
      id: this.generateId(),
      category,
      ...data,
      severity: 'warning',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    this.warnings.push(warning)
    this.categories[category] = (this.categories[category] || 0) + 1
    this.warningCount++

    // Keep only recent warnings
    if (this.warnings.length > this.maxErrors) {
      this.warnings.shift()
    }
  }

  // Track API error
  trackAPIError(data) {
    const apiError = {
      id: this.generateId(),
      category: 'api.error',
      ...data,
      severity: 'error',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    this.apiErrors.push(apiError)
    this.categories['api.error'] = (this.categories['api.error'] || 0) + 1
  }

  // Track performance issue
  trackPerformanceIssue(category, data) {
    const issue = {
      id: this.generateId(),
      category,
      ...data,
      severity: 'warning',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    this.performanceIssues.push(issue)
    this.categories['performance.error'] = (this.categories['performance.error'] || 0) + 1
  }

  // Generate unique ID
  generateId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Send immediate report for critical errors
  sendImmediateReport(error) {
    if (import.meta.env.DEV) {
      // In dev, log to console for visibility
      console.error('Immediate error report (dev):', error)
      return
    }
    
    // In production, send to error reporting service
    this.sendToErrorService([error])
  }

  // Report all errors
  reportErrors() {
    const allErrors = [
      ...this.errors,
      ...this.warnings,
      ...this.apiErrors,
      ...this.performanceIssues
    ]

    if (allErrors.length === 0) return

    const report = {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      summary: {
        totalErrors: this.errorCount,
        totalWarnings: this.warningCount,
        categories: this.categories
      },
      errors: allErrors.slice(-20) // Last 20 errors
    }

    if (import.meta.env.DEV) {
      console.group('📊 Error Report')
      console.groupEnd()
    } else {
      this.sendToErrorService(report.errors)
    }
  }

  // Send errors to error reporting service
  async sendToErrorService(errors) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ errors })
      })
    } catch (error) {
      console.warn('Failed to send error report:', error)
    }
  }

  // Clean old errors (older than 24 hours)
  cleanOldErrors() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    this.errors = this.errors.filter(error => 
      new Date(error.timestamp) > oneDayAgo
    )
    
    this.warnings = this.warnings.filter(warning => 
      new Date(warning.timestamp) > oneDayAgo
    )
    
    this.apiErrors = this.apiErrors.filter(error => 
      new Date(error.timestamp) > oneDayAgo
    )
    
    this.performanceIssues = this.performanceIssues.filter(issue => 
      new Date(issue.timestamp) > oneDayAgo
    )
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('errorTrackerSessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('errorTrackerSessionId', sessionId)
    }
    return sessionId
  }

  // Get user ID
  getUserId() {
    const user = JSON.parse(localStorage.getItem('fallbackUser') || '{}')
    return user.id || 'anonymous'
  }

  // Get error statistics
  getStats() {
    return {
      totalErrors: this.errorCount,
      totalWarnings: this.warningCount,
      categories: this.categories,
      recentErrors: this.errors.slice(-10),
      recentWarnings: this.warnings.slice(-10)
    }
  }

  // Clear all errors
  clear() {
    this.errors = []
    this.warnings = []
    this.apiErrors = []
    this.performanceIssues = []
    this.errorCount = 0
    this.warningCount = 0
    this.categories = {
      'console.error': 0,
      'console.warn': 0,
      'api.error': 0,
      'network.error': 0,
      'react.error': 0,
      'javascript.error': 0,
      'performance.error': 0
    }
  }
}

// Create and export singleton instance
export const errorTracker = new ErrorTracker()

// Initialize error tracking
if (typeof window !== 'undefined') {
  errorTracker.init()
}

export default errorTracker
