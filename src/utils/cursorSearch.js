/**
 * 🔍 CURSOR AI AGENT SMART SEARCH UTILITIES
 * Bu dosya Cursor AI Agent'ın daha akıllı aramalar yapması için yardımcı fonksiyonlar içerir
 */

// ============================================================================
// SMART SEARCH PATTERNS
// ============================================================================

/**
 * Component arama pattern'leri
 */
export const componentSearchPatterns = {
  // Form bileşenleri
  form: [
    'form', 'input', 'button', 'select', 'textarea', 'checkbox', 'radio',
    'validation', 'submit', 'reset', 'field', 'label'
  ],
  
  // Tablo bileşenleri
  table: [
    'table', 'thead', 'tbody', 'tr', 'td', 'th', 'row', 'column',
    'pagination', 'sort', 'filter', 'search', 'data'
  ],
  
  // Modal/Dialog bileşenleri
  modal: [
    'modal', 'dialog', 'popup', 'overlay', 'drawer', 'sidebar',
    'close', 'open', 'backdrop', 'content'
  ],
  
  // Loading bileşenleri
  loading: [
    'loading', 'spinner', 'skeleton', 'shimmer', 'progress',
    'indicator', 'wait', 'busy'
  ],
  
  // Navigation bileşenleri
  navigation: [
    'nav', 'menu', 'sidebar', 'breadcrumb', 'pagination',
    'tabs', 'accordion', 'dropdown'
  ],
  
  // Card bileşenleri
  card: [
    'card', 'tile', 'panel', 'box', 'container',
    'header', 'body', 'footer', 'content'
  ]
};

/**
 * Service arama pattern'leri
 */
export const serviceSearchPatterns = {
  // API servisleri
  api: [
    'api', 'service', 'client', 'request', 'fetch',
    'http', 'rest', 'endpoint', 'url'
  ],
  
  // Auth servisleri
  auth: [
    'auth', 'login', 'logout', 'register', 'password',
    'token', 'session', 'user', 'permission'
  ],
  
  // Database servisleri
  database: [
    'database', 'db', 'query', 'sql', 'table',
    'insert', 'update', 'delete', 'select'
  ],
  
  // File servisleri
  file: [
    'file', 'upload', 'download', 'image', 'document',
    'storage', 'blob', 'binary'
  ]
};

/**
 * Hook arama pattern'leri
 */
export const hookSearchPatterns = {
  // State hooks
  state: [
    'useState', 'useReducer', 'useContext', 'state',
    'data', 'loading', 'error'
  ],
  
  // Effect hooks
  effect: [
    'useEffect', 'useLayoutEffect', 'useInsertionEffect',
    'mount', 'unmount', 'update', 'cleanup'
  ],
  
  // Custom hooks
  custom: [
    'use', 'hook', 'custom', 'logic', 'business'
  ]
};

/**
 * Utility arama pattern'leri
 */
export const utilitySearchPatterns = {
  // Validation utilities
  validation: [
    'validate', 'schema', 'rule', 'check', 'verify',
    'required', 'email', 'password', 'format'
  ],
  
  // Format utilities
  format: [
    'format', 'parse', 'stringify', 'date', 'number',
    'currency', 'phone', 'address'
  ],
  
  // Storage utilities
  storage: [
    'localStorage', 'sessionStorage', 'cookie', 'cache',
    'save', 'load', 'remove', 'clear'
  ]
};

// ============================================================================
// SMART SEARCH FUNCTIONS
// ============================================================================

/**
 * Akıllı component arama
 */
export const smartComponentSearch = (query, components = []) => {
  const normalizedQuery = query.toLowerCase();
  
  // Pattern matching
  for (const [pattern, keywords] of Object.entries(componentSearchPatterns)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return {
        pattern,
        keywords: keywords.filter(keyword => normalizedQuery.includes(keyword)),
        suggestions: getComponentSuggestions(pattern)
      };
    }
  }
  
  // Fuzzy search
  return {
    pattern: 'fuzzy',
    suggestions: components.filter(component => 
      component.name.toLowerCase().includes(normalizedQuery) ||
      component.description?.toLowerCase().includes(normalizedQuery)
    )
  };
};

/**
 * Akıllı service arama
 */
export const smartServiceSearch = (query, services = []) => {
  const normalizedQuery = query.toLowerCase();
  
  // Pattern matching
  for (const [pattern, keywords] of Object.entries(serviceSearchPatterns)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return {
        pattern,
        keywords: keywords.filter(keyword => normalizedQuery.includes(keyword)),
        suggestions: getServiceSuggestions(pattern)
      };
    }
  }
  
  // Fuzzy search
  return {
    pattern: 'fuzzy',
    suggestions: services.filter(service => 
      service.name.toLowerCase().includes(normalizedQuery) ||
      service.description?.toLowerCase().includes(normalizedQuery)
    )
  };
};

/**
 * Akıllı hook arama
 */
export const smartHookSearch = (query, hooks = []) => {
  const normalizedQuery = query.toLowerCase();
  
  // Pattern matching
  for (const [pattern, keywords] of Object.entries(hookSearchPatterns)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return {
        pattern,
        keywords: keywords.filter(keyword => normalizedQuery.includes(keyword)),
        suggestions: getHookSuggestions(pattern)
      };
    }
  }
  
  // Fuzzy search
  return {
    pattern: 'fuzzy',
    suggestions: hooks.filter(hook => 
      hook.name.toLowerCase().includes(normalizedQuery) ||
      hook.description?.toLowerCase().includes(normalizedQuery)
    )
  };
};

// ============================================================================
// SUGGESTION GENERATORS
// ============================================================================

/**
 * Component önerileri
 */
export const getComponentSuggestions = (pattern) => {
  const suggestions = {
    form: [
      'FormValidation',
      'InputField',
      'SubmitButton',
      'FormContainer',
      'FieldGroup'
    ],
    table: [
      'DataTable',
      'TableRow',
      'TableHeader',
      'TablePagination',
      'TableFilter'
    ],
    modal: [
      'Modal',
      'Dialog',
      'Drawer',
      'Popup',
      'Overlay'
    ],
    loading: [
      'LoadingSpinner',
      'Skeleton',
      'ProgressBar',
      'LoadingIndicator',
      'Shimmer'
    ],
    navigation: [
      'Navigation',
      'Sidebar',
      'Menu',
      'Breadcrumb',
      'Tabs'
    ],
    card: [
      'Card',
      'CardHeader',
      'CardBody',
      'CardFooter',
      'CardContainer'
    ]
  };
  
  return suggestions[pattern] || [];
};

/**
 * Service önerileri
 */
export const getServiceSuggestions = (pattern) => {
  const suggestions = {
    api: [
      'ApiClient',
      'HttpService',
      'RequestHandler',
      'EndpointService',
      'ApiManager'
    ],
    auth: [
      'AuthService',
      'LoginService',
      'TokenService',
      'UserService',
      'PermissionService'
    ],
    database: [
      'DatabaseService',
      'QueryService',
      'DataService',
      'Repository',
      'DataManager'
    ],
    file: [
      'FileService',
      'UploadService',
      'StorageService',
      'ImageService',
      'DocumentService'
    ]
  };
  
  return suggestions[pattern] || [];
};

/**
 * Hook önerileri
 */
export const getHookSuggestions = (pattern) => {
  const suggestions = {
    state: [
      'useLocalState',
      'useAsyncState',
      'useFormState',
      'useToggle',
      'useCounter'
    ],
    effect: [
      'useMount',
      'useUnmount',
      'useUpdate',
      'useInterval',
      'useTimeout'
    ],
    custom: [
      'useApi',
      'useLocalStorage',
      'useDebounce',
      'useThrottle',
      'usePrevious'
    ]
  };
  
  return suggestions[pattern] || [];
};

// ============================================================================
// CODE GENERATION HELPERS
// ============================================================================

/**
 * Component kodu üretimi
 */
export const generateComponentCode = (componentName, pattern, props = {}) => {
  const templates = {
    form: `
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ${componentName} = ({ onSubmit, initialData = {}, validation }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (validation) {
        const validationResult = validation(formData);
        if (!validationResult.isValid) {
          setErrors(validationResult.errors);
          return;
        }
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="${componentName.toLowerCase()}-form">
      {/* Form fields will be added here */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

${componentName}.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  validation: PropTypes.func,
};

export default ${componentName};
`,
    
    table: `
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const ${componentName} = ({ data, columns, itemsPerPage = 10, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="${componentName.toLowerCase()}-container">
      <table className="${componentName.toLowerCase()}-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column.key} 
                onClick={() => handleSort(column.key)}
                className="sortable-header"
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr 
              key={index} 
              onClick={() => onRowClick?.(row)}
              className="table-row"
            >
              {columns.map(column => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

${componentName}.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  itemsPerPage: PropTypes.number,
  onRowClick: PropTypes.func,
};

export default ${componentName};
`,
    
    modal: `
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ${componentName} = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={\`modal-content modal-\${size}\`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

${componentName}.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default ${componentName};
`
  };
  
  return templates[pattern] || templates.form;
};

/**
 * Service kodu üretimi
 */
export const generateServiceCode = (serviceName, pattern) => {
  const templates = {
    api: `
class ${serviceName} {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default ${serviceName};
`,
    
    auth: `
class ${serviceName} {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(credentials) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      this.setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: \`Bearer \${this.token}\` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }
}

export default ${serviceName};
`
  };
  
  return templates[pattern] || templates.api;
};

/**
 * Hook kodu üretimi
 */
export const generateHookCode = (hookName, pattern) => {
  const templates = {
    state: `
import { useState, useCallback } from 'react';

const ${hookName} = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const updateValue = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, updateValue, resetValue];
};

export default ${hookName};
`,
    
    effect: `
import { useEffect, useRef } from 'react';

const ${hookName} = (callback, dependencies = []) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    return callback();
  }, dependencies);
};

export default ${hookName};
`,
    
    custom: `
import { useState, useEffect, useCallback } from 'react';

const ${hookName} = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default ${hookName};
`
  };
  
  return templates[pattern] || templates.custom;
};

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export const cursorSearchUtils = {
  // Search patterns
  componentSearchPatterns,
  serviceSearchPatterns,
  hookSearchPatterns,
  utilitySearchPatterns,
  
  // Search functions
  smartComponentSearch,
  smartServiceSearch,
  smartHookSearch,
  
  // Suggestion generators
  getComponentSuggestions,
  getServiceSuggestions,
  getHookSuggestions,
  
  // Code generators
  generateComponentCode,
  generateServiceCode,
  generateHookCode,
};

export default cursorSearchUtils;
