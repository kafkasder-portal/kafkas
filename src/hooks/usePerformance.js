import { useEffect, useState, useCallback } from 'react';

/**
 * usePerformance Hook
 * @description Performance monitoring hook for Core Web Vitals and other metrics
 * @returns {Object} Performance metrics and monitoring functions
 */
const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    bundleSize: null,
    loadTime: null,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Measure Core Web Vitals
  const measureCoreWebVitals = useCallback(() => {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({
        ...prev,
        lcp: lastEntry.startTime,
      }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        setMetrics(prev => ({
          ...prev,
          fid,
        }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let cls = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      setMetrics(prev => ({
        ...prev,
        cls,
      }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries[entries.length - 1].startTime;
      setMetrics(prev => ({
        ...prev,
        fcp,
      }));
    });
    fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });

    // TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
      }));
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  // Measure bundle size
  const measureBundleSize = useCallback(() => {
    if (process.env.NODE_ENV === 'production') {
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter(resource => 
        resource.name.includes('.js') && !resource.name.includes('chunk')
      );
      
      const totalSize = jsResources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      setMetrics(prev => ({
        ...prev,
        bundleSize: totalSize / 1024, // Convert to KB
      }));
    }
  }, []);

  // Measure page load time
  const measureLoadTime = useCallback(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      setMetrics(prev => ({
        ...prev,
        loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
      }));
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    const cleanup = measureCoreWebVitals();
    
    // Measure bundle size after a delay
    setTimeout(measureBundleSize, 1000);
    
    // Measure load time when page is fully loaded
    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
    }

    return cleanup;
  }, [measureCoreWebVitals, measureBundleSize, measureLoadTime]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Get performance score
  const getPerformanceScore = useCallback(() => {
    let score = 100;

    // LCP scoring (0-100)
    if (metrics.lcp) {
      if (metrics.lcp <= 2500) score -= 0;
      else if (metrics.lcp <= 4000) score -= 10;
      else score -= 25;
    }

    // FID scoring (0-100)
    if (metrics.fid) {
      if (metrics.fid <= 100) score -= 0;
      else if (metrics.fid <= 300) score -= 10;
      else score -= 25;
    }

    // CLS scoring (0-100)
    if (metrics.cls) {
      if (metrics.cls <= 0.1) score -= 0;
      else if (metrics.cls <= 0.25) score -= 10;
      else score -= 25;
    }

    // Bundle size scoring
    if (metrics.bundleSize) {
      if (metrics.bundleSize <= 500) score -= 0;
      else if (metrics.bundleSize <= 1000) score -= 10;
      else score -= 25;
    }

    return Math.max(0, score);
  }, [metrics]);

  // Get performance recommendations
  const getRecommendations = useCallback(() => {
    const recommendations = [];

    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('LCP is too slow. Optimize images and critical resources.');
    }

    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('FID is too high. Reduce JavaScript execution time.');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('CLS is too high. Avoid layout shifts.');
    }

    if (metrics.bundleSize && metrics.bundleSize > 500) {
      recommendations.push('Bundle size is too large. Implement code splitting.');
    }

    if (metrics.loadTime && metrics.loadTime > 3000) {
      recommendations.push('Page load time is slow. Optimize resources.');
    }

    return recommendations;
  }, [metrics]);

  // Auto-start monitoring on mount
  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore,
    getRecommendations,
  };
};

export default usePerformance;
