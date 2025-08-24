import { useState, useEffect, useCallback } from 'react'

// Performance metrics
const usePerformance = (componentName = 'Component') => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    loadTime: 0
  })
  
  const [isMonitoring, setIsMonitoring] = useState(false)
  const renderStartTime = useRef(0)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const monitoringInterval = useRef(null)

  // Start render timing
  const startRenderTimer = useCallback(() => {
    renderStartTime.current = performance.now()
  }, [])

  // End render timing
  const endRenderTimer = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current
    setMetrics(prev => ({ ...prev, renderTime }))
  }, [])

  // Measure memory usage
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory
      const memoryUsage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      setMetrics(prev => ({ ...prev, memoryUsage }))
    }
  }, [])

  // Measure FPS
  const measureFPS = useCallback(() => {
    frameCount.current++
    const currentTime = performance.now()
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
      setMetrics(prev => ({ ...prev, fps }))
      frameCount.current = 0
      lastTime.current = currentTime
    }
  }, [])

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    
    // Start FPS monitoring
    const fpsInterval = setInterval(measureFPS, 16) // ~60fps
    
    // Start memory monitoring
    const memoryInterval = setInterval(measureMemory, 1000)
    
    monitoringInterval.current = { fpsInterval, memoryInterval }
  }, [measureFPS, measureMemory])

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current.fpsInterval)
      clearInterval(monitoringInterval.current.memoryInterval)
      monitoringInterval.current = null
    }
  }, [])

  // Measure load time
  const measureLoadTime = useCallback(() => {
    const loadTime = performance.now() - performance.timing.navigationStart
    setMetrics(prev => ({ ...prev, loadTime }))
  }, [])

  // Performance warning thresholds
  const getPerformanceWarnings = useCallback(() => {
    const warnings = []
    
    if (metrics.renderTime > 16) {
      warnings.push(`Render time (${metrics.renderTime.toFixed(2)}ms) is above 16ms threshold`)
    }
    
    if (metrics.memoryUsage > 80) {
      warnings.push(`Memory usage (${metrics.memoryUsage.toFixed(1)}%) is above 80% threshold`)
    }
    
    if (metrics.fps < 30) {
      warnings.push(`FPS (${metrics.fps}) is below 30fps threshold`)
    }
    
    return warnings
  }, [metrics])

  // Log performance data
  const logPerformance = useCallback(() => {
    const warnings = getPerformanceWarnings()
    
    console.group(`🚀 Performance Report - ${componentName}`)
    
    if (warnings.length > 0) {
      console.warn('⚠️ Performance Warnings:', warnings)
    }
    
    console.groupEnd()
  }, [componentName, metrics, getPerformanceWarnings])

  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring()
    measureLoadTime()
    
    return () => {
      stopMonitoring()
    }
  }, [startMonitoring, stopMonitoring, measureLoadTime])

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = []
    
    if (metrics.renderTime > 16) {
      suggestions.push({
        type: 'render',
        priority: 'high',
        message: 'Consider using React.memo or useMemo to optimize re-renders',
        action: 'Optimize component rendering'
      })
    }
    
    if (metrics.memoryUsage > 80) {
      suggestions.push({
        type: 'memory',
        priority: 'high',
        message: 'Memory usage is high. Check for memory leaks or large data structures',
        action: 'Review memory usage'
      })
    }
    
    if (metrics.fps < 30) {
      suggestions.push({
        type: 'fps',
        priority: 'medium',
        message: 'Low FPS detected. Consider optimizing animations or heavy computations',
        action: 'Optimize animations'
      })
    }
    
    return suggestions
  }, [metrics])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    startRenderTimer,
    endRenderTimer,
    logPerformance,
    getPerformanceWarnings,
    getOptimizationSuggestions
  }
}

// Bundle size analyzer
export const useBundleAnalyzer = () => {
  const [bundleInfo, setBundleInfo] = useState(null)

  const analyzeBundle = useCallback(async () => {
    try {
      // This would typically call an API endpoint that analyzes the bundle
      const response = await fetch('/api/bundle-analyzer')
      const data = await response.json()
      setBundleInfo(data)
    } catch (error) {
      console.error('Bundle analysis failed:', error)
    }
  }, [])

  return { bundleInfo, analyzeBundle }
}

// Network performance monitoring
export const useNetworkPerformance = () => {
  const [networkMetrics, setNetworkMetrics] = useState({
    latency: 0,
    bandwidth: 0,
    connectionType: 'unknown'
  })

  const measureNetworkPerformance = useCallback(async () => {
    try {
      const startTime = performance.now()
      
      // Measure latency
      const response = await fetch('/api/ping')
      const endTime = performance.now()
      const latency = endTime - startTime
      
      // Get connection info
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const connectionType = connection ? connection.effectiveType : 'unknown'
      
      setNetworkMetrics({
        latency,
        bandwidth: connection ? connection.downlink : 0,
        connectionType
      })
    } catch (error) {
      console.error('Network performance measurement failed:', error)
    }
  }, [])

  useEffect(() => {
    measureNetworkPerformance()
    const interval = setInterval(measureNetworkPerformance, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [measureNetworkPerformance])

  return { networkMetrics, measureNetworkPerformance }
}

// Resource loading performance
export const useResourcePerformance = () => {
  const [resourceMetrics, setResourceMetrics] = useState({
    totalResources: 0,
    loadedResources: 0,
    failedResources: 0,
    totalSize: 0
  })

  const measureResourcePerformance = useCallback(() => {
    const resources = performance.getEntriesByType('resource')
    const totalResources = resources.length
    const loadedResources = resources.filter(r => r.initiatorType !== 'xmlhttprequest').length
    const failedResources = resources.filter(r => r.transferSize === 0).length
    const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)

    setResourceMetrics({
      totalResources,
      loadedResources,
      failedResources,
      totalSize
    })
  }, [])

  useEffect(() => {
    // Wait for page load to complete
    if (document.readyState === 'complete') {
      measureResourcePerformance()
    } else {
      window.addEventListener('load', measureResourcePerformance)
      return () => window.removeEventListener('load', measureResourcePerformance)
    }
  }, [measureResourcePerformance])

  return { resourceMetrics, measureResourcePerformance }
}

export default usePerformance
