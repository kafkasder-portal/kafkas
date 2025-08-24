import { useState, useEffect, useCallback } from 'react';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    memory: null,
    cpu: null
  });

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Performance API is supported
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      setIsSupported(true);
      initializePerformanceMonitoring();
    }
  }, []);

  const initializePerformanceMonitoring = useCallback(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('FCP observer error:', error);
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observer error:', error);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              setMetrics(prev => ({ ...prev, fid }));
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observer error:', error);
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observer error:', error);
      }
    }

    // Time to First Byte
    if ('navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        setMetrics(prev => ({ ...prev, ttfb: navigation.responseStart - navigation.requestStart }));
      }
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      const updateMemory = () => {
        setMetrics(prev => ({ 
          ...prev, 
          memory: {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          }
        }));
      };
      updateMemory();
      setInterval(updateMemory, 5000);
    }

    // CPU usage estimation
    const updateCPU = () => {
      const start = performance.now();
      setTimeout(() => {
        const end = performance.now();
        const cpuUsage = ((end - start) / 16.67) * 100; // 60fps = 16.67ms per frame
        setMetrics(prev => ({ ...prev, cpu: Math.min(cpuUsage, 100) }));
      }, 16);
    };
    updateCPU();
    setInterval(updateCPU, 1000);
  }, []);

  const getPerformanceScore = useCallback(() => {
    const scores = {
      fcp: metrics.fcp < 1800 ? 100 : metrics.fcp < 3000 ? 50 : 0,
      lcp: metrics.lcp < 2500 ? 100 : metrics.lcp < 4000 ? 50 : 0,
      fid: metrics.fid < 100 ? 100 : metrics.fid < 300 ? 50 : 0,
      cls: metrics.cls < 0.1 ? 100 : metrics.cls < 0.25 ? 50 : 0,
      ttfb: metrics.ttfb < 800 ? 100 : metrics.ttfb < 1800 ? 50 : 0
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(scores).length);
  }, [metrics]);

  const getPerformanceGrade = useCallback(() => {
    const score = getPerformanceScore();
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }, [getPerformanceScore]);

  const getRecommendations = useCallback(() => {
    const recommendations = [];

    if (metrics.fcp > 1800) {
      recommendations.push('Optimize First Contentful Paint by reducing server response time and critical resources');
    }

    if (metrics.lcp > 2500) {
      recommendations.push('Improve Largest Contentful Paint by optimizing images and reducing render-blocking resources');
    }

    if (metrics.fid > 100) {
      recommendations.push('Reduce First Input Delay by minimizing main thread work and breaking up long tasks');
    }

    if (metrics.cls > 0.1) {
      recommendations.push('Fix Cumulative Layout Shift by setting explicit dimensions for images and ads');
    }

    if (metrics.ttfb > 800) {
      recommendations.push('Optimize Time to First Byte by improving server response time and using CDN');
    }

    return recommendations;
  }, [metrics]);

  return {
    metrics,
    isSupported,
    getPerformanceScore,
    getPerformanceGrade,
    getRecommendations
  };
};
