// =====================================================
// KAF PORTAL ANALYTICS & MONITORING SYSTEM
// =====================================================

class AnalyticsTracker {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.isInitialized = false;
    this.batchSize = parseInt(import.meta.env.VITE_ANALYTICS_BATCH_SIZE) || 100;
    this.flushInterval =
      parseInt(import.meta.env.VITE_ANALYTICS_FLUSH_INTERVAL) || 30000;
    this.endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics';

    this.init();
  }

  init() {
    // Skip analytics in development mode
    if (import.meta.env.DEV) {
      return;
    }

    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      this.isInitialized = true;
      this.setupAutoFlush();
      this.trackPageView();
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  trackPageView(page = window.location.pathname) {
    this.trackEvent('page_view', {
      page,
      title: document.title,
      referrer: document.referrer,
    });
  }

  trackEvent(name, properties = {}) {
    if (!this.isInitialized) return;

    const event = {
      name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    };

    this.events.push(event);

    // Batch gönderimi kontrol et
    if (this.events.length >= this.batchSize) {
      this.sendEvents();
    }
  }

  trackError(error, context = {}) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  trackPerformance(metrics) {
    this.trackEvent('performance', metrics);
  }

  async sendEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      const response = await fetch(`${this.endpoint}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
      });

      if (!response.ok) {
        console.error('Failed to send analytics events');
        // Başarısız olayları geri ekle
        this.events.unshift(...eventsToSend);
      }
    } catch (error) {
      console.error('Error sending analytics events:', error);
      // Başarısız olayları geri ekle
      this.events.unshift(...eventsToSend);
    }
  }

  setupAutoFlush() {
    setInterval(() => {
      this.sendEvents();
    }, this.flushInterval);
  }

  async sendAllEvents() {
    await this.sendEvents();
  }
}

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Map();
    this.isInitialized = false;
    this.endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics';

    this.init();
  }

  init() {
    if (import.meta.env.VITE_ENABLE_MONITORING === 'true') {
      this.isInitialized = true;
      this.setupWebVitals();
      this.setupPerformanceObserver();
      this.setupMemoryMonitoring();
      this.setupNetworkMonitoring();
    }
  }

  setupWebVitals() {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  setupPerformanceObserver() {
    // API çağrı performansını izle
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        this.recordApiCall(args[0], response.status, duration, true);
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordApiCall(args[0], 0, duration, false);
        throw error;
      }
    };
  }

  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.recordMetric('memory', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
      }, 30000); // 30 saniyede bir
    }
  }

  setupNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.recordMetric('network', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      });
    }
  }

  recordMetric(name, value) {
    this.metrics[name] = value;
    this.notifyObservers(name, value);
  }

  recordApiCall(url, status, duration, success) {
    if (!this.metrics.apiCalls) {
      this.metrics.apiCalls = {};
    }

    if (!this.metrics.apiCalls[url]) {
      this.metrics.apiCalls[url] = [];
    }

    this.metrics.apiCalls[url].push({
      status,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });

    // Son 100 çağrıyı tut
    if (this.metrics.apiCalls[url].length > 100) {
      this.metrics.apiCalls[url] = this.metrics.apiCalls[url].slice(-100);
    }
  }

  addObserver(name, callback) {
    if (!this.observers.has(name)) {
      this.observers.set(name, []);
    }
    this.observers.get(name).push(callback);
  }

  notifyObservers(name, value) {
    if (this.observers.has(name)) {
      this.observers.get(name).forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('Error in performance observer:', error);
        }
      });
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  async sendMetrics() {
    if (!this.isInitialized) return;

    try {
      const response = await fetch(`${this.endpoint}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          performance: this.metrics,
          timestamp: new Date().toISOString(),
          sessionId: analyticsTracker.sessionId,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send performance metrics');
      }
    } catch (error) {
      console.error('Error sending performance metrics:', error);
    }
  }
}

class SystemHealthMonitor {
  constructor() {
    this.healthData = {};
    this.isInitialized = false;
    this.endpoint = import.meta.env.VITE_HEALTH_ENDPOINT || '/api/health';

    this.init();
  }

  init() {
    if (import.meta.env.VITE_ENABLE_MONITORING === 'true') {
      this.isInitialized = true;
      this.startMonitoring();
    }
  }

  startMonitoring() {
    // Her 30 saniyede bir sağlık kontrolü
    setInterval(() => {
      this.checkHealth();
    }, 30000);

    // Sayfa yüklendiğinde ilk kontrol
    this.checkHealth();
  }

  async checkHealth() {
    const healthData = {
      system: this.getSystemInfo(),
      network: await this.checkNetworkHealth(),
      application: this.getApplicationInfo(),
      timestamp: new Date().toISOString(),
    };

    this.healthData = healthData;
    await this.sendHealthData();
  }

  getSystemInfo() {
    const memory = performance.memory
      ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          percentage:
            (performance.memory.usedJSHeapSize /
              performance.memory.jsHeapSizeLimit) *
            100,
        }
      : null;

    return {
      memory,
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      platform: navigator.platform,
    };
  }

  async checkNetworkHealth() {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/health', {
        method: 'GET',
        cache: 'no-cache',
      });
      const duration = performance.now() - startTime;

      return {
        status: response.status,
        responseTime: duration,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 0,
        responseTime: 0,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  getApplicationInfo() {
    return {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
      features: {
        pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        monitoring: import.meta.env.VITE_ENABLE_MONITORING === 'true',
      },
    };
  }

  getHealthData() {
    return { ...this.healthData };
  }

  async sendHealthData() {
    if (!this.isInitialized) return;

    try {
      const response = await fetch(`${this.endpoint}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.healthData),
      });

      if (!response.ok) {
        console.error('Failed to send health data');
      }
    } catch (error) {
      console.error('Error sending health data:', error);
    }
  }
}

// Global instances
export const analyticsTracker = new AnalyticsTracker();
export const performanceMonitor = new PerformanceMonitor();
export const systemHealthMonitor = new SystemHealthMonitor();

// Error tracking
window.addEventListener('error', event => {
  analyticsTracker.trackError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', event => {
  analyticsTracker.trackError(new Error(event.reason), {
    type: 'unhandledrejection',
  });
});

// Page visibility tracking
document.addEventListener('visibilitychange', () => {
  analyticsTracker.trackEvent('visibility_change', {
    hidden: document.hidden,
    visibilityState: document.visibilityState,
  });
});

// Export for use in components
export default {
  analyticsTracker,
  performanceMonitor,
  systemHealthMonitor,
};
