/**
 * ⚙️ CURSOR AI AGENT CONFIGURATION
 * Bu dosya Cursor AI Agent'ın performans optimizasyonu ve konfigürasyon ayarlarını içerir
 */

// ============================================================================
// PERFORMANCE OPTIMIZATION SETTINGS
// ============================================================================

export const performanceConfig = {
  // Bundle optimization
  bundle: {
    // Chunk size limit (KB)
    maxChunkSize: 500,
    // Enable tree shaking
    treeShaking: true,
    // Enable code splitting
    codeSplitting: true,
    // Enable dynamic imports
    dynamicImports: true,
  },

  // Image optimization
  images: {
    // Enable lazy loading
    lazyLoading: true,
    // Enable responsive images
    responsive: true,
    // Enable WebP format
    webp: true,
    // Image quality (0-100)
    quality: 85,
    // Max image width
    maxWidth: 1920,
  },

  // Caching strategy
  caching: {
    // Enable service worker
    serviceWorker: true,
    // Cache duration (seconds)
    cacheDuration: 86400, // 24 hours
    // Enable runtime caching
    runtimeCaching: true,
    // Enable offline support
    offline: true,
  },

  // Code optimization
  code: {
    // Enable minification
    minify: true,
    // Enable source maps in development
    sourceMaps: process.env.NODE_ENV === 'development',
    // Enable dead code elimination
    deadCodeElimination: true,
    // Enable constant folding
    constantFolding: true,
  },
};

// ============================================================================
// DEVELOPMENT SETTINGS
// ============================================================================

export const developmentConfig = {
  // Hot reload settings
  hotReload: {
    // Enable fast refresh
    fastRefresh: true,
    // Enable overlay for errors
    overlay: true,
    // Enable source maps
    sourceMaps: true,
  },

  // Debug settings
  debug: {
    // Enable React DevTools
    reactDevTools: true,
    // Enable Redux DevTools
    reduxDevTools: true,
    // Enable performance monitoring
    performanceMonitoring: true,
    // Enable error tracking
    errorTracking: true,
  },

  // Code quality
  codeQuality: {
    // Enable ESLint
    eslint: true,
    // Enable Prettier
    prettier: true,
    // Enable TypeScript checking
    typescript: true,
    // Enable pre-commit hooks
    preCommitHooks: true,
  },
};

// ============================================================================
// AI AGENT OPTIMIZATION SETTINGS
// ============================================================================

export const aiAgentConfig = {
  // Code generation settings
  codeGeneration: {
    // Enable TypeScript by default
    typescript: true,
    // Enable PropTypes
    propTypes: true,
    // Enable JSDoc comments
    jsdoc: true,
    // Enable error handling
    errorHandling: true,
    // Enable loading states
    loadingStates: true,
    // Enable accessibility
    accessibility: true,
    // Enable responsive design
    responsive: true,
  },

  // Search optimization
  search: {
    // Enable fuzzy search
    fuzzySearch: true,
    // Enable semantic search
    semanticSearch: true,
    // Enable pattern matching
    patternMatching: true,
    // Search result limit
    resultLimit: 10,
    // Enable search suggestions
    suggestions: true,
  },

  // Suggestion settings
  suggestions: {
    // Enable auto-complete
    autoComplete: true,
    // Enable code snippets
    codeSnippets: true,
    // Enable best practices
    bestPractices: true,
    // Enable performance tips
    performanceTips: true,
    // Enable security tips
    securityTips: true,
  },

  // Context awareness
  context: {
    // Enable project context
    projectContext: true,
    // Enable file context
    fileContext: true,
    // Enable function context
    functionContext: true,
    // Enable import context
    importContext: true,
  },
};

// ============================================================================
// PROJECT-SPECIFIC SETTINGS
// ============================================================================

export const projectConfig = {
  // KAF Portal specific settings
  kafPortal: {
    // Multi-language support
    languages: ['tr', 'en', 'ru'],
    // Default language
    defaultLanguage: 'tr',
    // Enable real-time features
    realTime: true,
    // Enable WebSocket connections
    webSocket: true,
    // Enable offline mode
    offlineMode: true,
  },

  // Database settings
  database: {
    // Supabase configuration
    supabase: {
      // Enable real-time subscriptions
      realTime: true,
      // Enable row level security
      rls: true,
      // Enable automatic backups
      backups: true,
    },
  },

  // API settings
  api: {
    // Base URL
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:5001',
    // Timeout (ms)
    timeout: 10000,
    // Retry attempts
    retryAttempts: 3,
    // Enable request caching
    caching: true,
  },

  // Security settings
  security: {
    // Enable HTTPS
    https: process.env.NODE_ENV === 'production',
    // Enable CSP headers
    csp: true,
    // Enable XSS protection
    xssProtection: true,
    // Enable CSRF protection
    csrfProtection: true,
  },
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export const performanceMonitoring = {
  // Metrics to track
  metrics: {
    // Page load time
    pageLoadTime: true,
    // First contentful paint
    firstContentfulPaint: true,
    // Largest contentful paint
    largestContentfulPaint: true,
    // Cumulative layout shift
    cumulativeLayoutShift: true,
    // First input delay
    firstInputDelay: true,
    // Bundle size
    bundleSize: true,
    // Memory usage
    memoryUsage: true,
  },

  // Performance budgets
  budgets: {
    // Max bundle size (KB)
    maxBundleSize: 1000,
    // Max initial load time (ms)
    maxLoadTime: 3000,
    // Max time to interactive (ms)
    maxTTI: 5000,
    // Max first contentful paint (ms)
    maxFCP: 2000,
  },

  // Reporting
  reporting: {
    // Enable console logging
    console: process.env.NODE_ENV === 'development',
    // Enable analytics
    analytics: true,
    // Enable error reporting
    errorReporting: true,
    // Enable performance alerts
    alerts: true,
  },
};

// ============================================================================
// OPTIMIZATION HELPERS
// ============================================================================

/**
 * Performance optimization helper
 */
export const optimizePerformance = {
  // Bundle optimization
  optimizeBundle: (config = {}) => {
    return {
      ...performanceConfig.bundle,
      ...config,
    };
  },

  // Image optimization
  optimizeImages: (config = {}) => {
    return {
      ...performanceConfig.images,
      ...config,
    };
  },

  // Caching optimization
  optimizeCaching: (config = {}) => {
    return {
      ...performanceConfig.caching,
      ...config,
    };
  },

  // Code optimization
  optimizeCode: (config = {}) => {
    return {
      ...performanceConfig.code,
      ...config,
    };
  },
};

/**
 * Development optimization helper
 */
export const optimizeDevelopment = {
  // Hot reload optimization
  optimizeHotReload: (config = {}) => {
    return {
      ...developmentConfig.hotReload,
      ...config,
    };
  },

  // Debug optimization
  optimizeDebug: (config = {}) => {
    return {
      ...developmentConfig.debug,
      ...config,
    };
  },

  // Code quality optimization
  optimizeCodeQuality: (config = {}) => {
    return {
      ...developmentConfig.codeQuality,
      ...config,
    };
  },
};

/**
 * AI Agent optimization helper
 */
export const optimizeAIAgent = {
  // Code generation optimization
  optimizeCodeGeneration: (config = {}) => {
    return {
      ...aiAgentConfig.codeGeneration,
      ...config,
    };
  },

  // Search optimization
  optimizeSearch: (config = {}) => {
    return {
      ...aiAgentConfig.search,
      ...config,
    };
  },

  // Suggestions optimization
  optimizeSuggestions: (config = {}) => {
    return {
      ...aiAgentConfig.suggestions,
      ...config,
    };
  },

  // Context optimization
  optimizeContext: (config = {}) => {
    return {
      ...aiAgentConfig.context,
      ...config,
    };
  },
};

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

/**
 * Validate configuration
 */
export const validateConfig = (config) => {
  const errors = [];

  // Validate performance config
  if (config.performance) {
    if (config.performance.bundle?.maxChunkSize < 100) {
      errors.push('Bundle size should be at least 100KB');
    }
    if (config.performance.images?.quality < 0 || config.performance.images?.quality > 100) {
      errors.push('Image quality should be between 0 and 100');
    }
  }

  // Validate development config
  if (config.development) {
    if (config.development.hotReload?.fastRefresh === false) {
      errors.push('Fast refresh is recommended for development');
    }
  }

  // Validate AI agent config
  if (config.aiAgent) {
    if (config.aiAgent.search?.resultLimit < 1) {
      errors.push('Search result limit should be at least 1');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// CONFIGURATION MERGER
// ============================================================================

/**
 * Merge configurations
 */
export const mergeConfigs = (...configs) => {
  return configs.reduce((merged, config) => {
    return {
      ...merged,
      ...config,
      performance: {
        ...merged.performance,
        ...config.performance,
      },
      development: {
        ...merged.development,
        ...config.development,
      },
      aiAgent: {
        ...merged.aiAgent,
        ...config.aiAgent,
      },
      project: {
        ...merged.project,
        ...config.project,
      },
    };
  }, {});
};

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const defaultConfig = mergeConfigs(
  { performance: performanceConfig },
  { development: developmentConfig },
  { aiAgent: aiAgentConfig },
  { project: projectConfig }
);

// ============================================================================
// EXPORT ALL CONFIGURATIONS
// ============================================================================

export const cursorConfig = {
  // Base configurations
  performance: performanceConfig,
  development: developmentConfig,
  aiAgent: aiAgentConfig,
  project: projectConfig,
  monitoring: performanceMonitoring,

  // Optimization helpers
  optimize: {
    performance: optimizePerformance,
    development: optimizeDevelopment,
    aiAgent: optimizeAIAgent,
  },

  // Utilities
  validate: validateConfig,
  merge: mergeConfigs,
  default: defaultConfig,
};

export default cursorConfig;
