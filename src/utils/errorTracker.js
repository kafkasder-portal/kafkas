/**
 * Error tracking and monitoring utility
 * Tracks errors, warnings, and performance issues
 */

class ErrorTracker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.apiErrors = [];
    this.performanceIssues = [];
    this.errorCount = 0;
    this.warningCount = 0;
    this.categories = {
      'console.error': 0,
      'console.warn': 0,
      'api.error': 0,
      'network.error': 0,
      'react.error': 0,
      'javascript.error': 0,
      'performance.error': 0,
    };
    this.isInitialized = false;
  }

  // Initialize error tracking
  init() {
    if (this.isInitialized) return;

    this.setupConsoleInterception();
    this.setupGlobalErrorHandlers();
    this.setupReactErrorBoundary();
    this.setupPerformanceMonitoring();
    this.setupAPIErrorTracking();

    // Clean old errors every hour
    setInterval(
      () => {
        this.cleanOldErrors();
      },
      60 * 60 * 1000
    );

    this.isInitialized = true;
  }

  // Track an error
  trackError(category, errorData) {
    const error = {
      id: this.generateErrorId(),
      category,
      ...errorData,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    this.errors.push(error);
    this.errorCount++;
    this.categories[category] = (this.categories[category] || 0) + 1;

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Tracked');
      console.error('Category:', category);
      console.error('Error:', error);
      console.groupEnd();
    }
  }

  // Track a warning
  trackWarning(category, warningData) {
    const warning = {
      id: this.generateWarningId(),
      category,
      ...warningData,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    this.warnings.push(warning);
    this.warningCount++;
    this.categories[category] = (this.categories[category] || 0) + 1;

    // Keep only last 50 warnings
    if (this.warnings.length > 50) {
      this.warnings = this.warnings.slice(-50);
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.group('⚠️ Warning Tracked');
      console.warn('Category:', category);
      console.warn('Warning:', warning);
      console.groupEnd();
    }
  }

  // Track API errors
  trackAPIError(endpoint, error, requestData = {}) {
    const apiError = {
      id: this.generateErrorId(),
      endpoint,
      method: requestData.method || 'GET',
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      response: error.response?.data,
      request: requestData,
      timestamp: new Date().toISOString(),
    };

    this.apiErrors.push(apiError);
    this.trackError('api.error', apiError);
  }

  // Track performance issues
  trackPerformanceIssue(type, issueData) {
    const issue = {
      id: this.generateErrorId(),
      type,
      ...issueData,
      timestamp: new Date().toISOString(),
    };

    this.performanceIssues.push(issue);
    this.trackError('performance.error', issue);
  }

  // Setup console interception
  setupConsoleInterception() {
    const originalError = console.error;
    const originalWarn = console.warn;

    // Intercept console.error
    console.error = (...args) => {
      this.trackError('console.error', {
        message: args.join(' '),
        stack: new Error().stack,
        args,
      });
      originalError.apply(console, args);
    };

    // Intercept console.warn
    console.warn = (...args) => {
      this.trackWarning('console.warn', {
        message: args.join(' '),
        stack: new Error().stack,
        args,
      });
      originalWarn.apply(console, args);
    };
  }

  // Setup global error handlers
  setupGlobalErrorHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.trackError('promise.rejection', {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        reason: event.reason,
      });
    });

    // JavaScript errors
    window.addEventListener('error', event => {
      this.trackError('javascript.error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target && event.target !== window) {
          this.trackError('resource.error', {
            message: `Failed to load resource: ${event.target.src || event.target.href}`,
            resource: event.target.src || event.target.href,
          });
        }
      },
      true
    );
  }

  // Setup React error boundary
  setupReactErrorBoundary() {
    window.reactErrorHandler = (error, errorInfo) => {
      this.trackError('react.error', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    };
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Long tasks
      const longTaskObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 50) {
            this.trackPerformanceIssue('long.task', {
              duration: entry.duration,
              startTime: entry.startTime,
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
            this.trackPerformanceIssue('memory.high', {
              used: memory.usedJSHeapSize,
              limit: memory.jsHeapSizeLimit,
              percentage:
                (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
            });
          }
        }, 30000);
      }
    }
  }

  // Setup API error tracking
  setupAPIErrorTracking() {
    // This will be used by API service to track errors
    window.apiErrorHandler = (endpoint, error, requestData) => {
      this.trackAPIError(endpoint, error, requestData);
    };
  }

  // Generate unique error ID
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique warning ID
  generateWarningId() {
    return `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    try {
      const user = JSON.parse(localStorage.getItem('user_data') || '{}');
      return user.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  // Clean old errors (older than 24 hours)
  cleanOldErrors() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    this.errors = this.errors.filter(
      error => new Date(error.timestamp) > oneDayAgo
    );

    this.warnings = this.warnings.filter(
      warning => new Date(warning.timestamp) > oneDayAgo
    );

    this.apiErrors = this.apiErrors.filter(
      error => new Date(error.timestamp) > oneDayAgo
    );

    this.performanceIssues = this.performanceIssues.filter(
      issue => new Date(issue.timestamp) > oneDayAgo
    );
  }

  // Get error statistics
  getStats() {
    return {
      totalErrors: this.errorCount,
      totalWarnings: this.warningCount,
      categories: this.categories,
      recentErrors: this.errors.slice(-10),
      recentWarnings: this.warnings.slice(-10),
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
      'console.error': 0,
      'console.warn': 0,
      'api.error': 0,
      'network.error': 0,
      'react.error': 0,
      'javascript.error': 0,
      'performance.error': 0,
    };
  }
}

// Create and export singleton instance
export const errorTracker = new ErrorTracker();

// Initialize error tracking
if (typeof window !== 'undefined') {
  errorTracker.init();
}

export default errorTracker;
