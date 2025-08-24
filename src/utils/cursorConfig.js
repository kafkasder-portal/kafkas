/**
 * Cursor AI Configuration
 * KAF Portal için özel Cursor AI optimizasyon ayarları
 */

// Environment detection
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const isTest = typeof window !== 'undefined' && window.location.hostname.includes('test');

// Base configuration
export const cursorConfig = {
  // Performance settings
  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableMemoization: true,
    enableDebouncing: true,
    enableThrottling: true,
    maxBundleSize: 500, // KB
    maxLoadTime: 3000, // ms
    enableServiceWorker: true,
    enablePWA: true
  },

  // Search settings
  search: {
    enableSemanticSearch: true,
    enableFuzzySearch: true,
    enablePatternMatching: true,
    maxSearchResults: 50,
    searchTimeout: 3000,
    enableAutoComplete: true,
    enableSearchHistory: true
  },

  // Code generation settings
  codeGeneration: {
    enableTypeScript: true,
    enablePropTypes: true,
    enableJSDoc: true,
    enableErrorHandling: true,
    enableLoadingStates: true,
    enableAccessibility: true,
    enableResponsiveDesign: true,
    enableBestPractices: true
  },

  // Component patterns
  componentPatterns: {
    form: ['validation', 'error-handling', 'loading-states'],
    table: ['pagination', 'sorting', 'filtering', 'search'],
    modal: ['backdrop-click', 'keyboard-navigation', 'focus-management'],
    loading: ['skeleton', 'spinner', 'progress-indicators'],
    navigation: ['sidebar', 'breadcrumb', 'mobile-navigation']
  },

  // Service patterns
  servicePatterns: {
    api: ['restful-endpoints', 'error-handling', 'retry-logic'],
    auth: ['jwt-tokens', 'role-based-access', 'session-management'],
    database: ['supabase-integration', 'real-time-subscriptions'],
    file: ['upload', 'download', 'image-optimization'],
    notification: ['real-time-alerts', 'toast-messages']
  },

  // Hook patterns
  hookPatterns: {
    state: ['local-state', 'global-state', 'form-state'],
    effect: ['side-effects', 'cleanup', 'dependencies'],
    custom: ['business-logic', 'api-calls', 'utilities'],
    performance: ['memoization', 'debouncing', 'throttling']
  },

  // File structure
  fileStructure: {
    components: 'src/components',
    pages: 'src/pages',
    services: 'src/services',
    hooks: 'src/hooks',
    contexts: 'src/contexts',
    utils: 'src/utils',
    i18n: 'src/i18n',
    styles: 'src/styles'
  },

  // Naming conventions
  namingConventions: {
    components: 'PascalCase',
    files: 'camelCase',
    functions: 'camelCase',
    constants: 'UPPER_SNAKE_CASE',
    cssClasses: 'kebab-case'
  },

  // Code quality
  codeQuality: {
    enableTypeScript: true,
    enablePropTypes: true,
    enableJSDoc: true,
    enableErrorHandling: true,
    enableLoadingStates: true,
    enableAccessibility: true,
    enableResponsiveDesign: true
  },

  // Bundle optimization
  bundleOptimization: {
    enableCodeSplitting: true,
    enableTreeShaking: true,
    enableDynamicImports: true,
    enableBundleAnalysis: true,
    maxChunkSize: 250 // KB
  },

  // Image optimization
  imageOptimization: {
    enableWebP: true,
    enableLazyLoading: true,
    enableResponsiveImages: true,
    quality: 85,
    maxWidth: 1920
  },

  // Caching strategy
  cachingStrategy: {
    enableServiceWorker: true,
    enableRuntimeCaching: true,
    enableStaticCaching: true,
    enableCacheInvalidation: true,
    cacheVersion: '1.0.0'
  },

  // Multi-language support
  multiLanguage: {
    languages: ['tr', 'en', 'ru'],
    defaultLanguage: 'tr',
    enableAutoDetection: true,
    enableTranslationKeys: true
  },

  // Real-time features
  realTime: {
    enableWebSocket: true,
    enableSupabase: true,
    enableNotifications: true,
    enableLiveUpdates: true
  },

  // Database integration
  database: {
    enableSupabase: true,
    enableRLS: true,
    enableRealTime: true,
    enableBackups: true
  },

  // Security features
  security: {
    enableAuthentication: true,
    enableAuthorization: true,
    enableCSP: true,
    enableXSSProtection: true
  },

  // Testing strategy
  testing: {
    enableUnitTests: true,
    enableIntegrationTests: true,
    enablePerformanceTests: true,
    enableAccessibilityTests: true
  },

  // Monitoring and analytics
  monitoring: {
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    enableUserAnalytics: true,
    enableRealTimeMonitoring: true
  },

  // Deployment and CI/CD
  deployment: {
    enableProductionBuild: true,
    enableSourceMaps: false,
    enableAssetOptimization: true,
    enableBundleSplitting: true
  },

  // Environment configuration
  environment: {
    development: {
      enableHotReload: true,
      enableSourceMaps: true,
      enableDebugMode: true,
      enableMockData: true
    },
    staging: {
      enablePreProductionTesting: true,
      enablePerformanceTesting: true,
      enableSecurityTesting: true,
      enableUserTesting: true
    },
    production: {
      enableOptimization: true,
      enableCaching: true,
      enableCDN: true,
      enableMonitoring: true
    }
  }
};

// Environment-specific configuration
export const getEnvironmentConfig = () => {
  if (isDevelopment) {
    return {
      ...cursorConfig,
      performance: {
        ...cursorConfig.performance,
        enableLazyLoading: false,
        enableCodeSplitting: false
      },
      monitoring: {
        ...cursorConfig.monitoring,
        enablePerformanceMonitoring: false,
        enableErrorTracking: false
      }
    };
  }

  if (isTest) {
    return {
      ...cursorConfig,
      performance: {
        ...cursorConfig.performance,
        enableLazyLoading: false,
        enableCodeSplitting: false
      },
      monitoring: {
        ...cursorConfig.monitoring,
        enablePerformanceMonitoring: true,
        enableErrorTracking: true
      }
    };
  }

  return cursorConfig;
};

// Quick commands configuration
export const quickCommands = {
  component: {
    pattern: '@component {name} {type} {props}',
    description: 'Component üret',
    examples: [
      '@component UserForm form name:string email:string age:number',
      '@component DataTable table data:array columns:array',
      '@component ConfirmModal modal title:string message:string'
    ]
  },
  service: {
    pattern: '@service {name} {type}',
    description: 'Service üret',
    examples: [
      '@service UserService api',
      '@service AuthService auth',
      '@service FileService file'
    ]
  },
  hook: {
    pattern: '@hook {name} {type}',
    description: 'Hook üret',
    examples: [
      '@hook useUserData custom',
      '@hook useFormValidation form',
      '@hook useApiCache api'
    ]
  },
  search: {
    pattern: '@search {query}',
    description: 'Arama yap',
    examples: [
      '@search form validation',
      '@search table pagination',
      '@search modal component'
    ]
  },
  optimize: {
    pattern: '@optimize {type}',
    description: 'Optimizasyon yap',
    examples: [
      '@optimize bundle',
      '@optimize image',
      '@optimize performance',
      '@optimize accessibility'
    ]
  }
};

// Performance thresholds
export const performanceThresholds = {
  bundleSize: {
    warning: 500, // KB
    error: 1000 // KB
  },
  loadTime: {
    warning: 3000, // ms
    error: 5000 // ms
  },
  lcp: {
    warning: 2500, // ms
    error: 4000 // ms
  },
  fid: {
    warning: 100, // ms
    error: 300 // ms
  },
  cls: {
    warning: 0.1,
    error: 0.25
  }
};

// Search patterns
export const searchPatterns = {
  component: {
    form: ['form', 'input', 'validation', 'submit'],
    table: ['table', 'data', 'pagination', 'sort'],
    modal: ['modal', 'dialog', 'popup', 'overlay'],
    loading: ['loading', 'spinner', 'skeleton'],
    navigation: ['nav', 'menu', 'sidebar', 'breadcrumb']
  },
  service: {
    api: ['api', 'service', 'client', 'request'],
    auth: ['auth', 'login', 'token', 'session'],
    database: ['database', 'query', 'sql', 'table'],
    file: ['file', 'upload', 'download', 'storage']
  },
  hook: {
    state: ['useState', 'useReducer', 'state'],
    effect: ['useEffect', 'mount', 'unmount'],
    custom: ['use', 'hook', 'custom', 'logic']
  }
};

// Code snippets
export const codeSnippets = {
  react: {
    rfc: 'Functional component',
    rfcs: 'Component with useState',
    rfce: 'Component with useEffect',
    rhook: 'Custom hook',
    rctx: 'Context provider'
  },
  form: {
    form: 'Basic form',
    formv: 'Form with validation',
    input: 'Input field',
    select: 'Select field',
    textarea: 'Textarea field'
  },
  api: {
    get: 'GET request',
    post: 'POST request',
    put: 'PUT request',
    delete: 'DELETE request',
    useapi: 'API hook'
  },
  utility: {
    ls: 'Local storage',
    gls: 'Get from local storage',
    date: 'Date formatting',
    currency: 'Currency formatting',
    debounce: 'Debounce hook'
  }
};

// Export default configuration
export default getEnvironmentConfig();
