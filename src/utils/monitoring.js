/**
 * Monitoring & Analytics Utility for KAF Portal
 * Provides comprehensive monitoring, analytics, and performance tracking
 */

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: {},
      userInteractions: {},
      apiCalls: {},
      errors: [],
      performance: {}
    }
    this.observers = []
    this.isInitialized = false
  }

  // Initialize performance monitoring
  init() {
    if (this.isInitialized) return

    // Web Vitals monitoring
    this.setupWebVitals()

    // User interaction tracking
    this.setupUserInteractionTracking()

    // API call monitoring
    this.setupAPIMonitoring()

    // Error tracking
    this.setupErrorTracking()

    // Memory and performance monitoring
    this.setupPerformanceMonitoring()

    this.isInitialized = true
    console.log('🔍 Performance monitoring initialized')
  }

  // Setup Web Vitals monitoring
  setupWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.performance.lcp = lastEntry.startTime
        this.reportMetric('LCP', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          this.metrics.performance.fid = entry.processingStart - entry.startTime
          this.reportMetric('FID', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.performance.cls = clsValue
        this.reportMetric('CLS', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  // Setup user interaction tracking
  setupUserInteractionTracking() {
    let interactionCount = 0
    const trackInteraction = (event) => {
      interactionCount++
      this.metrics.userInteractions[event.type] =
        (this.metrics.userInteractions[event.type] || 0) + 1

      // Track specific interactions
      if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        this.trackButtonClick(event.target)
      }

      if (event.target.tagName === 'A' || event.target.closest('a')) {
        this.trackLinkClick(event.target)
      }

      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.trackFormInteraction(event.target)
      }
    }

    // Track various user interactions
    ['click', 'input', 'scroll', 'keydown', 'mouseover'].forEach(eventType => {
      document.addEventListener(eventType, trackInteraction, { passive: true })
    })
  }

  // Setup API call monitoring
  setupAPIMonitoring() {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0]

      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const duration = endTime - startTime

        this.trackAPICall({
          url: typeof url === 'string' ? url : url.url,
          method: args[1]?.method || 'GET',
          status: response.status,
          duration,
          success: response.ok
        })

        return response
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime

        this.trackAPICall({
          url: typeof url === 'string' ? url : url.url,
          method: args[1]?.method || 'GET',
          status: 0,
          duration,
          success: false,
          error: error.message
        })

        throw error
      }
    }
  }

  // Setup error tracking
  setupErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      })
    })

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      })
    })

    // React error boundary errors
    window.addEventListener('react-error', (event) => {
      this.trackError({
        type: 'react',
        message: event.detail?.message,
        componentStack: event.detail?.componentStack,
        timestamp: new Date().toISOString()
      })
    })
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    // Memory usage monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory
        this.metrics.performance.memory = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        }
      }, 30000) // Every 30 seconds
    }

    // Navigation timing
    if ('navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        this.metrics.pageLoad = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive,
          firstPaint: navigation.domContentLoadedEventEnd
        }
      }
    }
  }

  // Track button clicks
  trackButtonClick(element) {
    const buttonData = {
      text: element.textContent?.trim() || element.getAttribute('aria-label') || 'Unknown',
      className: element.className,
      id: element.id,
      timestamp: new Date().toISOString()
    }

    this.reportMetric('button_click', buttonData)
  }

  // Track link clicks
  trackLinkClick(element) {
    const linkData = {
      href: element.href,
      text: element.textContent?.trim() || 'Unknown',
      timestamp: new Date().toISOString()
    }

    this.reportMetric('link_click', linkData)
  }

  // Track form interactions
  trackFormInteraction(element) {
    const formData = {
      type: element.type,
      name: element.name,
      id: element.id,
      form: element.form?.id || 'unknown',
      timestamp: new Date().toISOString()
    }

    this.reportMetric('form_interaction', formData)
  }

  // Track API calls
  trackAPICall(data) {
    this.metrics.apiCalls[data.url] = this.metrics.apiCalls[data.url] || []
    this.metrics.apiCalls[data.url].push(data)

    // Keep only last 100 calls per endpoint
    if (this.metrics.apiCalls[data.url].length > 100) {
      this.metrics.apiCalls[data.url] = this.metrics.apiCalls[data.url].slice(-100)
    }

    this.reportMetric('api_call', data)
  }

  // Track errors
  trackError(error) {
    this.metrics.errors.push(error)

    // Keep only last 50 errors
    if (this.metrics.errors.length > 50) {
      this.metrics.errors = this.metrics.errors.slice(-50)
    }

    this.reportMetric('error', error)
  }

  // Report metric to observers
  reportMetric(type, data) {
    this.observers.forEach(observer => {
      if (observer.type === type || observer.type === 'all') {
        observer.callback(data)
      }
    })
  }

  // Add metric observer
  addObserver(type, callback) {
    this.observers.push({ type, callback })
  }

  // Remove metric observer
  removeObserver(callback) {
    this.observers = this.observers.filter(observer => observer.callback !== callback)
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    }
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('kaf_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('kaf_session_id', sessionId)
    }
    return sessionId
  }

  // Send metrics to server
  async sendMetrics() {
    try {
      const metrics = this.getMetrics()
      await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metrics)
      })
    } catch (error) {
      console.warn('Failed to send metrics:', error)
    }
  }

  // Start periodic metric sending
  startPeriodicReporting(interval = 60000) { // 1 minute
    setInterval(() => {
      this.sendMetrics()
    }, interval)
  }
}

// Analytics tracking
class AnalyticsTracker {
  constructor() {
    this.events = []
    this.userProperties = {}
    this.isInitialized = false
  }

  // Initialize analytics
  init() {
    if (this.isInitialized) return

    this.setupPageTracking()
    this.setupUserTracking()
    this.isInitialized = true
    console.log('📊 Analytics tracking initialized')
  }

  // Setup page tracking
  setupPageTracking() {
    // Track initial page load
    this.trackPageView(window.location.pathname)

    // Track route changes (for SPA)
    let currentPath = window.location.pathname
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname
        this.trackPageView(currentPath)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // Setup user tracking
  setupUserTracking() {
    // Track user properties
    this.setUserProperty('userAgent', navigator.userAgent)
    this.setUserProperty('language', navigator.language)
    this.setUserProperty('platform', navigator.platform)
    this.setUserProperty('screenResolution', `${screen.width}x${screen.height}`)
    this.setUserProperty('viewport', `${window.innerWidth}x${window.innerHeight}`)

    // Track timezone
    this.setUserProperty('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)
  }

  // Track page view
  trackPageView(path, title = document.title) {
    this.trackEvent('page_view', {
      path,
      title,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    })
  }

  // Track custom event
  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      }
    }

    this.events.push(event)

    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events = this.events.slice(-100)
    }

    // Send to server immediately for important events
    if (['error', 'exception', 'critical_action'].includes(eventName)) {
      this.sendEvent(event)
    }
  }

  // Set user property
  setUserProperty(key, value) {
    this.userProperties[key] = value
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('kaf_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('kaf_session_id', sessionId)
    }
    return sessionId
  }

  // Send event to server
  async sendEvent(event) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
    }
  }

  // Send all events to server
  async sendAllEvents() {
    if (this.events.length === 0) return

    try {
      await fetch('/api/analytics/events/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: this.events,
          userProperties: this.userProperties
        })
      })

      // Clear sent events
      this.events = []
    } catch (error) {
      console.warn('Failed to send analytics events:', error)
    }
  }

  // Start periodic event sending
  startPeriodicReporting(interval = 30000) { // 30 seconds
    setInterval(() => {
      this.sendAllEvents()
    }, interval)
  }
}

// System health monitoring
class SystemHealthMonitor {
  constructor() {
    this.healthData = {
      system: {},
      application: {},
      database: {},
      network: {}
    }
    this.isMonitoring = false
  }

  // Start health monitoring
  startMonitoring() {
    if (this.isMonitoring) return

    this.monitorSystemHealth()
    this.monitorApplicationHealth()
    this.monitorNetworkHealth()

    this.isMonitoring = true
    console.log('🏥 System health monitoring started')
  }

  // Monitor system health
  monitorSystemHealth() {
    setInterval(() => {
      // Memory usage
      if ('memory' in performance) {
        const memory = performance.memory
        this.healthData.system.memory = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
          percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        }
      }

      // CPU usage (simplified)
      const startTime = performance.now()
      setTimeout(() => {
        const endTime = performance.now()
        this.healthData.system.cpu = {
          load: Math.round((endTime - startTime) / 100)
        }
      }, 100)

      // Uptime
      this.healthData.system.uptime = Math.round(performance.now() / 1000)
    }, 10000) // Every 10 seconds
  }

  // Monitor application health
  monitorApplicationHealth() {
    setInterval(() => {
      this.healthData.application = {
        timestamp: new Date().toISOString(),
        version: import.meta.env.VITE_APP_VERSION || 'unknown',
        environment: import.meta.env.MODE || 'development',
        features: {
          authentication: true,
          database: true,
          websocket: true,
          fileUpload: true,
          notifications: true
        }
      }
    }, 30000) // Every 30 seconds
  }

  // Monitor network health
  monitorNetworkHealth() {
    setInterval(async () => {
      try {
        const startTime = performance.now()
        const response = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-cache'
        })
        const endTime = performance.now()

        this.healthData.network = {
          status: response.status,
          responseTime: Math.round(endTime - startTime),
          timestamp: new Date().toISOString()
        }
      } catch (error) {
        this.healthData.network = {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }
    }, 15000) // Every 15 seconds
  }

  // Get health data
  getHealthData() {
    return this.healthData
  }

  // Send health data to server
  async sendHealthData() {
    try {
      await fetch('/api/health/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.healthData)
      })
    } catch (error) {
      console.warn('Failed to send health data:', error)
    }
  }

  // Start periodic health reporting
  startHealthReporting(interval = 60000) { // 1 minute
    setInterval(() => {
      this.sendHealthData()
    }, interval)
  }
}

// Create singleton instances
const performanceMonitor = new PerformanceMonitor()
const analyticsTracker = new AnalyticsTracker()
const systemHealthMonitor = new SystemHealthMonitor()

// Initialize monitoring
function initializeMonitoring() {
  performanceMonitor.init()
  analyticsTracker.init()
  systemHealthMonitor.startMonitoring()

  // Start periodic reporting
  performanceMonitor.startPeriodicReporting()
  analyticsTracker.startPeriodicReporting()
  systemHealthMonitor.startHealthReporting()

  console.log('🚀 Monitoring & Analytics initialized')
}

// Export monitoring utilities
export {
  analyticsTracker, initializeMonitoring, performanceMonitor, systemHealthMonitor
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMonitoring)
  } else {
    initializeMonitoring()
  }
}
