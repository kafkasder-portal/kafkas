import { useEffect, useRef } from 'react';

/**
 * Custom hook for monitoring component performance
 * Tracks render times and provides performance metrics
 */
export const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef(performance.now());
  const renderCount = useRef(0);
  const totalRenderTime = useRef(0);

  useEffect(() => {
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart.current;
    
    renderCount.current += 1;
    totalRenderTime.current += renderTime;
    
    // Log performance in development mode
    if (import.meta.env.DEV && renderTime > 16) { // 16ms threshold for 60fps
      console.warn(
        `⚠️ Slow render detected in ${componentName}:`,
        `${renderTime.toFixed(2)}ms`
      );
    }
    
    // Reset for next render
    renderStart.current = performance.now();
  });

  const getMetrics = () => ({
    renderCount: renderCount.current,
    totalRenderTime: totalRenderTime.current,
    averageRenderTime: totalRenderTime.current / renderCount.current,
  });

  return {
    getMetrics,
    logMetrics: () => {
      if (import.meta.env.DEV) {
        const metrics = getMetrics();
        console.log(`📊 Performance metrics for ${componentName}:`, metrics);
      }
    },
  };
};

/**
 * Higher-order component for automatic performance monitoring
 */
export const withPerformanceMonitor = (WrappedComponent, componentName) => {
  const MonitoredComponent = (props) => {
    const { logMetrics } = usePerformanceMonitor(componentName);
    
    useEffect(() => {
      // Log metrics on unmount in development
      return () => {
        if (import.meta.env.DEV) {
          logMetrics();
        }
      };
    }, [logMetrics]);

    return <WrappedComponent {...props} />;
  };

  MonitoredComponent.displayName = `withPerformanceMonitor(${componentName})`;
  return MonitoredComponent;
};

export default usePerformanceMonitor;