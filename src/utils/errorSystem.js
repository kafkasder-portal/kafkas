/**
 * Unified Error Handling System
 * Consolidates error handling, tracking, and reporting functionality
 * This replaces the separate errorHandler.js and errorTracker.js files
 */

// import { toast } from 'sonner'; // Not currently used but available for future implementations

// Error categories
export const ERROR_CATEGORIES = {
  CONSOLE_ERROR: 'console.error',
  CONSOLE_WARN: 'console.warn',
  API_ERROR: 'api.error',
  NETWORK_ERROR: 'network.error',
  REACT_ERROR: 'react.error',
  JAVASCRIPT_ERROR: 'javascript.error',
  PERFORMANCE_ERROR: 'performance.error',
  PROMISE_REJECTION: 'promise.rejection',
  RESOURCE_ERROR: 'resource.error',
  FORM_ERROR: 'form.error',
  AUTH_ERROR: 'auth.error',
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

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
    category: context.category || ERROR_CATEGORIES.JAVASCRIPT_ERROR,
    severity: context.severity || ERROR_SEVERITY.MEDIUM,
    ...context,
  };

  // Log error to console in development
  if (import.meta.env.DEV) {
    console.group('🚨 Error occurred');
    console.error('Error:', error);
    console.error('Context:', errorInfo);
    console.groupEnd();
  }

  // Send to error tracking service
  errorTracker.trackError(errorInfo);

  // Send to external monitoring service in production
  if (import.meta.env.PROD) {
    sendErrorToMonitoringService(errorInfo);
  }

  // Store locally for offline scenarios
  storeErrorLocally(errorInfo);

  // Return a user-friendly error message
  return {
    message: getUserFriendlyMessage(error),
    details: import.meta.env.DEV ? error.message : null,
    errorId: generateErrorId(),
  };
};

/**
 * API error handler with detailed response handling
 */
export const handleApiError = error => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

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
      504: 'İstek zaman aşımına uğradı.',
    };

    const message =
      data?.message || errorMap[status] || 'Beklenmeyen bir hata oluştu.';

    // Handle authentication errors
    if (status === 401) {
      handleAuthenticationError();
      errorTracker.trackError({
        message,
        status,
        category: ERROR_CATEGORIES.AUTH_ERROR,
        severity: ERROR_SEVERITY.HIGH,
      });
    }

    return {
      message,
      status,
      code: data?.code,
      errors: data?.errors,
    };
  } else if (error.request) {
    // Network error
    errorTracker.trackError({
      message: 'Network error',
      category: ERROR_CATEGORIES.NETWORK_ERROR,
      severity: ERROR_SEVERITY.HIGH,
    });
    
    return {
      message: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
      type: 'network_error',
    };
  } else {
    // Other error
    return handleError(error);
  }
};

/**
 * Error tracking system
 */
class ErrorTracker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.apiErrors = [];
    this.performanceIssues = [];
    this.maxErrors = 100;
    this.isInitialized = false;
    this.errorCount = 0;
    this.warningCount = 0;
    
    // Error categories
    this.categories = {
      [ERROR_CATEGORIES.CONSOLE_ERROR]: 0,
      [ERROR_CATEGORIES.CONSOLE_WARN]: 0,
      [ERROR_CATEGORIES.API_ERROR]: 0,
      [ERROR_CATEGORIES.NETWORK_ERROR]: 0,
      [ERROR_CATEGORIES.REACT_ERROR]: 0,
      [ERROR_CATEGORIES.JAVASCRIPT_ERROR]: 0,
      [ERROR_CATEGORIES.PERFORMANCE_ERROR]: 0,
      [ERROR_CATEGORIES.PROMISE_REJECTION]: 0,
      [ERROR_CATEGORIES.RESOURCE_ERROR]: 0,
      [ERROR_CATEGORIES.FORM_ERROR]: 0,
      [ERROR_CATEGORIES.AUTH_ERROR]: 0,
    };
  }

  // Initialize error tracking
  init() {
    if (this.isInitialized) return;

    // Override console methods
    this.overrideConsoleMethods();
    
    // Setup global error handlers
    this.setupGlobalErrorHandlers();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    // Setup API error tracking
    this.setupAPIErrorTracking();
    
    // Setup network error tracking
    this.setupNetworkErrorTracking();
    
    // Setup periodic reporting
    this.setupPeriodicReporting();
    
    this.isInitialized = true;
  }

  // Override console methods to capture errors and warnings
  overrideConsoleMethods() {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args) => {
      this.trackError(ERROR_CATEGORIES.CONSOLE_ERROR, {
        message: args.join(' '),
        stack: new Error().stack,
        timestamp: new Date().toISOString(),
        args,
        severity: ERROR_SEVERITY.HIGH,
      });
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.trackWarning(ERROR_CATEGORIES.CONSOLE_WARN, {
        message: args.join(' '),
        stack: new Error().stack,
        timestamp: new Date().toISOString(),
        args,
        severity: ERROR_SEVERITY.MEDIUM,
      });
      originalWarn.apply(console, args);
    };

    // Track important logs
    console.log = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('error') ||
        message.includes('Error') ||
        message.includes('failed') ||
        message.includes('Failed')
      ) {
        this.trackWarning(ERROR_CATEGORIES.CONSOLE_WARN, {
          message,
          stack: new Error().stack,
          timestamp: new Date().toISOString(),
          args,
          severity: ERROR_SEVERITY.LOW,
        });
      }
      originalLog.apply(console, args);
    };
  }

  // Setup global error handlers
  setupGlobalErrorHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(ERROR_CATEGORIES.PROMISE_REJECTION, {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        reason: event.reason,
        severity: ERROR_SEVERITY.HIGH,
      });
    });

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(ERROR_CATEGORIES.JAVASCRIPT_ERROR, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        severity: ERROR_SEVERITY.HIGH,
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        this.trackError(ERROR_CATEGORIES.RESOURCE_ERROR, {
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          resource: event.target.src || event.target.href,
          timestamp: new Date().toISOString(),
          severity: ERROR_SEVERITY.MEDIUM,
        });
      }
    }, true);
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.trackPerformanceIssue(ERROR_CATEGORIES.PERFORMANCE_ERROR, {
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: new Date().toISOString(),
              severity: ERROR_SEVERITY.LOW,
            });
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Memory usage
      if ('memory' in performance) {
        setInterval(() => {
          const memory = performance.memory;
          if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
            this.trackPerformanceIssue(ERROR_CATEGORIES.PERFORMANCE_ERROR, {
              used: memory.usedJSHeapSize,
              limit: memory.jsHeapSizeLimit,
              percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
              timestamp: new Date().toISOString(),
              severity: ERROR_SEVERITY.MEDIUM,
            });
          }
        }, 30000); // Check every 30 seconds
      }
    }
  }

  // Setup API error tracking
  setupAPIErrorTracking() {
    // Override fetch to track API errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.trackAPIError({
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            duration: performance.now() - startTime,
            timestamp: new Date().toISOString(),
            severity: ERROR_SEVERITY.HIGH,
          });
        }
        
        return response;
      } catch (error) {
        this.trackAPIError({
          url: args[0],
          error: error.message,
          duration: performance.now() - startTime,
          timestamp: new Date().toISOString(),
          severity: ERROR_SEVERITY.HIGH,
        });
        throw error;
      }
    };
  }

  // Setup network error tracking
  setupNetworkErrorTracking() {
    // Network status changes
    window.addEventListener('online', () => {
      this.trackWarning(ERROR_CATEGORIES.NETWORK_ERROR, {
        message: 'Network connection restored',
        timestamp: new Date().toISOString(),
        severity: ERROR_SEVERITY.LOW,
      });
    });

    window.addEventListener('offline', () => {
      this.trackError(ERROR_CATEGORIES.NETWORK_ERROR, {
        message: 'Network connection lost',
        timestamp: new Date().toISOString(),
        severity: ERROR_SEVERITY.HIGH,
      });
    });

    // Slow network detection
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          this.trackPerformanceIssue(ERROR_CATEGORIES.NETWORK_ERROR, {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            timestamp: new Date().toISOString(),
            severity: ERROR_SEVERITY.MEDIUM,
          });
        }
      });
    }
  }

  // Setup periodic reporting
  setupPeriodicReporting() {
    // Report errors every 5 minutes
    setInterval(() => {
      this.reportErrors();
    }, 5 * 60 * 1000);

    // Clean old errors every hour
    setInterval(() => {
      this.cleanOldErrors();
    }, 60 * 60 * 1000);
  }

  // Track an error
  trackError(category, data) {
    const error = {
      id: this.generateId(),
      category,
      ...data,
      severity: data.severity || ERROR_SEVERITY.HIGH,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    this.errors.push(error);
    this.categories[category] = (this.categories[category] || 0) + 1;
    this.errorCount++;

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🔴 Error Tracked: ${category}`);
      console.error('Error:', error);
      console.groupEnd();
    }

    // Send immediate report for critical errors
    if (error.severity === ERROR_SEVERITY.CRITICAL || 
        category.includes(ERROR_CATEGORIES.JAVASCRIPT_ERROR) || 
        category.includes(ERROR_CATEGORIES.REACT_ERROR)) {
      this.sendImmediateReport(error);
    }
  }

  // Track a warning
  trackWarning(category, data) {
    const warning = {
      id: this.generateId(),
      category,
      ...data,
      severity: data.severity || ERROR_SEVERITY.MEDIUM,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    this.warnings.push(warning);
    this.categories[category] = (this.categories[category] || 0) + 1;
    this.warningCount++;

    // Keep only recent warnings
    if (this.warnings.length > this.maxErrors) {
      this.warnings.shift();
    }
  }

  // Track API error
  trackAPIError(data) {
    const apiError = {
      id: this.generateId(),
      category: ERROR_CATEGORIES.API_ERROR,
      ...data,
      severity: data.severity || ERROR_SEVERITY.HIGH,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    this.apiErrors.push(apiError);
    this.categories[ERROR_CATEGORIES.API_ERROR] = (this.categories[ERROR_CATEGORIES.API_ERROR] || 0) + 1;
  }

  // Track performance issue
  trackPerformanceIssue(category, data) {
    const issue = {
      id: this.generateId(),
      category,
      ...data,
      severity: data.severity || ERROR_SEVERITY.LOW,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    this.performanceIssues.push(issue);
    this.categories[category] = (this.categories[category] || 0) + 1;
  }

  // Generate unique ID
  generateId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send immediate report for critical errors
  sendImmediateReport(error) {
    if (import.meta.env.DEV) {
      // In dev, log to console for visibility
      console.error('Immediate error report (dev):', error);
      return;
    }
    
    // In production, send to error reporting service
    this.sendToErrorService([error]);
  }

  // Report all errors
  reportErrors() {
    const allErrors = [
      ...this.errors,
      ...this.warnings,
      ...this.apiErrors,
      ...this.performanceIssues
    ];

    if (allErrors.length === 0) return;

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
    };

    if (import.meta.env.DEV) {
      console.group('📊 Error Report');
      console.log('Report:', report);
      console.groupEnd();
    } else {
      this.sendToErrorService(report.errors);
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
      });
    } catch (error) {
      console.warn('Failed to send error report:', error);
    }
  }

  // Clean old errors (older than 24 hours)
  cleanOldErrors() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    this.errors = this.errors.filter(error => 
      new Date(error.timestamp) > oneDayAgo
    );
    
    this.warnings = this.warnings.filter(warning => 
      new Date(warning.timestamp) > oneDayAgo
    );
    
    this.apiErrors = this.apiErrors.filter(error => 
      new Date(error.timestamp) > oneDayAgo
    );
    
    this.performanceIssues = this.performanceIssues.filter(issue => 
      new Date(issue.timestamp) > oneDayAgo
    );
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('errorTrackerSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('errorTrackerSessionId', sessionId);
    }
    return sessionId;
  }

  // Get user ID
  getUserId() {
    const user = JSON.parse(localStorage.getItem('fallbackUser') || '{}');
    return user.id || 'anonymous';
  }

  // Get error statistics
  getStats() {
    return {
      totalErrors: this.errorCount,
      totalWarnings: this.warningCount,
      categories: this.categories,
      recentErrors: this.errors.slice(-10),
      recentWarnings: this.warnings.slice(-10)
    };
  }

  // Clear all errors
  clear() {
    this.errors = [];
    this.warnings = [];
    this.apiErrors = [];
    this.performanceIssues = [];
    this.errorCount = 0;
    this.warningCount = 0;
    this.categories = {
      [ERROR_CATEGORIES.CONSOLE_ERROR]: 0,
      [ERROR_CATEGORIES.CONSOLE_WARN]: 0,
      [ERROR_CATEGORIES.API_ERROR]: 0,
      [ERROR_CATEGORIES.NETWORK_ERROR]: 0,
      [ERROR_CATEGORIES.REACT_ERROR]: 0,
      [ERROR_CATEGORIES.JAVASCRIPT_ERROR]: 0,
      [ERROR_CATEGORIES.PERFORMANCE_ERROR]: 0,
      [ERROR_CATEGORIES.PROMISE_REJECTION]: 0,
      [ERROR_CATEGORIES.RESOURCE_ERROR]: 0,
      [ERROR_CATEGORIES.FORM_ERROR]: 0,
      [ERROR_CATEGORIES.AUTH_ERROR]: 0,
    };
  }
}

// Create and export singleton instance
export const errorTracker = new ErrorTracker();

// Initialize error tracking
if (typeof window !== 'undefined') {
  errorTracker.init();
}

// Helper functions
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData).id : null;
  } catch {
    return null;
  }
};

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const generateErrorId = () => {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getUserFriendlyMessage = error => {
  // Known error types
  if (error.name === 'ChunkLoadError') {
    return 'Uygulama güncellemesi mevcut. Lütfen sayfayı yenileyin.';
  }

  if (error.message?.includes('Loading chunk')) {
    return 'Sayfa yüklenirken hata oluştu. Lütfen sayfayı yenileyin.';
  }

  if (error.message?.includes('Network Error')) {
    return 'Ağ bağlantısı sorunu. İnternet bağlantınızı kontrol edin.';
  }

  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
};

const handleAuthenticationError = () => {
  // Clear user session
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');

  // Redirect to login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const sendErrorToMonitoringService = async errorInfo => {
  try {
    // Example integration with Sentry, LogRocket, or custom service
    if (window.Sentry) {
      window.Sentry.captureException(new Error(errorInfo.message), {
        tags: {
          component: errorInfo.component,
          userId: errorInfo.userId,
        },
        extra: errorInfo,
      });
    }

    // Custom logging endpoint
    if (import.meta.env.VITE_ERROR_LOGGING_ENDPOINT) {
      await fetch(import.meta.env.VITE_ERROR_LOGGING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    }
  } catch (loggingError) {
    console.error('Failed to send error to monitoring service:', loggingError);
  }
};

const storeErrorLocally = errorInfo => {
  try {
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push(errorInfo);

    // Keep only last 10 errors
    const recentErrors = errors.slice(-10);
    
    // Safely stringify to avoid circular reference errors
    try {
      localStorage.setItem('app_errors', JSON.stringify(recentErrors));
    } catch (stringifyError) {
      console.warn('Failed to stringify error data:', stringifyError);
      // Store simplified error data
      const simplifiedErrors = recentErrors.map(error => ({
        message: error.message || 'Unknown error',
        stack: error.stack?.split('\n')[0] || '',
        timestamp: error.timestamp,
        type: error.type || 'unknown'
      }));
      localStorage.setItem('app_errors', JSON.stringify(simplifiedErrors));
    }
  } catch (error) {
    console.error('Failed to store error locally:', error);
  }
};

// Export utility functions for backward compatibility
export const setupGlobalErrorHandlers = () => {
  // This function is now handled automatically by errorTracker.init()
  console.log('Global error handlers are set up automatically');
};

export const getStoredErrors = () => {
  try {
    return JSON.parse(localStorage.getItem('app_errors') || '[]');
  } catch {
    return [];
  }
};

export const clearStoredErrors = () => {
  localStorage.removeItem('app_errors');
};
