/**
 * 🚀 CURSOR AI AGENT HELPER FUNCTIONS
 * Bu dosya Cursor AI Agent'ın daha akıllı öneriler vermesi için yardımcı fonksiyonlar içerir
 */

// ============================================================================
// COMMON PATTERNS AND SNIPPETS
// ============================================================================

/**
 * Form validation pattern with error handling
 */
export const createFormValidation = (schema) => {
  return {
    validate: (data) => {
      try {
        return schema.parse(data);
      } catch (error) {
        return { success: false, errors: error.errors };
      }
    },
    handleSubmit: async (data, onSubmit) => {
      const validation = schema.safeParse(data);
      if (!validation.success) {
        return { success: false, errors: validation.error.errors };
      }
      
      try {
        const result = await onSubmit(validation.data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
};

/**
 * API service pattern with loading states
 */
export const createApiService = (baseURL) => {
  const service = {
    async request(endpoint, options = {}) {
      const url = `${baseURL}${endpoint}`;
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },

    get: (endpoint) => service.request(endpoint),
    post: (endpoint, data) => service.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => service.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => service.request(endpoint, { method: 'DELETE' }),
  };
  
  return service;
};

/**
 * React component with TypeScript pattern
 */
export const createComponentTemplate = (componentName, props = {}) => {
  return `
import React from 'react';
import PropTypes from 'prop-types';

/**
 * ${componentName} Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ${componentName} = ({ ${Object.keys(props).join(', ')} }) => {
  return (
    <div className="${componentName.toLowerCase()}-container">
      {/* Component content */}
    </div>
  );
};

${componentName}.propTypes = {
${Object.entries(props).map(([key, type]) => `  ${key}: PropTypes.${type}`).join(',\n')}
};

${componentName}.defaultProps = {
${Object.entries(props).map(([key, defaultValue]) => `  ${key}: ${defaultValue}`).join(',\n')}
};

export default ${componentName};
`;
};

/**
 * Error boundary pattern
 */
export const createErrorBoundary = () => {
  return `
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
`;
};

/**
 * Loading skeleton pattern
 */
export const createLoadingSkeleton = (type = 'default') => {
  const skeletons = {
    default: `
const LoadingSkeleton = () => (
  <div className="loading-skeleton">
    <div className="skeleton-item"></div>
    <div className="skeleton-item"></div>
    <div className="skeleton-item"></div>
  </div>
);
`,
    table: `
const TableSkeleton = () => (
  <div className="table-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-actions"></div>
    </div>
    <div className="skeleton-rows">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-cell"></div>
          <div className="skeleton-cell"></div>
          <div className="skeleton-cell"></div>
        </div>
      ))}
    </div>
  </div>
);
`,
    card: `
const CardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
    </div>
  </div>
);
`
  };

  return skeletons[type] || skeletons.default;
};

/**
 * Toast notification pattern
 */
export const createToastSystem = () => {
  return `
import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
};

export const useToast = () => {
  return {
    showSuccess: (message) => showToast.success(message),
    showError: (message) => showToast.error(message),
    showLoading: (message) => showToast.loading(message),
    dismiss: (toastId) => showToast.dismiss(toastId),
  };
};
`;
};

/**
 * Modal/Dialog pattern
 */
export const createModalPattern = () => {
  return `
import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close">
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

export default Modal;
`;
};

/**
 * Data table with pagination pattern
 */
export const createDataTablePattern = () => {
  return `
import React, { useState, useMemo } from 'react';

const DataTable = ({ data, columns, itemsPerPage = 10 }) => {
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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} onClick={() => handleSort(column.key)}>
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
            <tr key={index}>
              {columns.map(column => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
`;
};

/**
 * Search and filter pattern
 */
export const createSearchFilterPattern = () => {
  return `
import React, { useState, useMemo } from 'react';

const SearchFilter = ({ data, searchFields, filterFields, onFilteredData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        searchFields.some(field =>
          item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => item[key] === value);
      }
    });

    onFilteredData?.(result);
    return result;
  }, [data, searchTerm, filters, searchFields, onFilteredData]);

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      {filterFields.map(field => (
        <select
          key={field.key}
          value={filters[field.key] || ''}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            [field.key]: e.target.value || undefined
          }))}
          className="filter-select"
        >
          <option value="">{field.label}</option>
          {field.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default SearchFilter;
`;
};

/**
 * Real-time updates with WebSocket pattern
 */
export const createWebSocketPattern = () => {
  return `
import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      try {
        wsRef.current = new WebSocket(url);
        
        wsRef.current.onopen = () => {
          setIsConnected(true);
          setError(null);
          options.onOpen?.();
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          options.onMessage?.(data);
        };

        wsRef.current.onclose = () => {
          setIsConnected(false);
          options.onClose?.();
        };

        wsRef.current.onerror = (error) => {
          setError(error);
          options.onError?.(error);
        };
      } catch (err) {
        setError(err);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
  };
};

export default useWebSocket;
`;
};

/**
 * Multi-language support pattern
 */
export const createI18nPattern = () => {
  return `
import { useTranslation } from 'react-i18next';

const useLocalization = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const getCurrentLanguage = () => i18n.language;

  const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat(i18n.language, options).format(date);
  };

  const formatNumber = (number, options = {}) => {
    return new Intl.NumberFormat(i18n.language, options).format(number);
  };

  const formatCurrency = (amount, currency = 'USD', options = {}) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
      ...options,
    }).format(amount);
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
    currentLanguage: i18n.language,
  };
};

export default useLocalization;
`;
};

/**
 * Responsive design patterns
 */
export const createResponsivePatterns = () => {
  return `
// CSS Media Queries
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

// React Hook for responsive design
import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
  };
};

// Responsive component wrapper
const ResponsiveWrapper = ({ mobile, tablet, desktop, children }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && mobile) return mobile;
  if (isTablet && tablet) return tablet;
  if (isDesktop && desktop) return desktop;
  
  return children;
};

export { useResponsive, ResponsiveWrapper, breakpoints };
`;
};

/**
 * Accessibility improvements pattern
 */
export const createAccessibilityPatterns = () => {
  return `
// Focus management
export const useFocusManagement = () => {
  const focusRef = useRef(null);

  const focusFirstElement = () => {
    const focusableElements = focusRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements?.length > 0) {
      focusableElements[0].focus();
    }
  };

  const trapFocus = (event) => {
    const focusableElements = focusRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  return { focusRef, focusFirstElement, trapFocus };
};

// Screen reader announcements
export const useScreenReader = () => {
  const announce = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

// Keyboard navigation
export const useKeyboardNavigation = (onKeyDown) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      onKeyDown(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onKeyDown]);
};
`;
};

/**
 * Performance optimizations pattern
 */
export const createPerformancePatterns = () => {
  return `
import { useMemo, useCallback, useRef, useEffect } from 'react';

// Debounced hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttled hook
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Virtual scrolling hook
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute',
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
      },
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  };
};

// Image lazy loading
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { imageSrc, isLoaded };
};

// Memoized expensive calculations
export const useMemoizedCalculation = (data, calculation) => {
  return useMemo(() => {
    return calculation(data);
  }, [data, calculation]);
};
`;
};

/**
 * Unit test patterns
 */
export const createTestPatterns = () => {
  return `
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Component test template
export const createComponentTest = (Component, props = {}) => {
  const defaultProps = {
    ...props,
  };

  const renderComponent = (customProps = {}) => {
    const finalProps = { ...defaultProps, ...customProps };
    return render(<Component {...finalProps} />);
  };

  return { renderComponent };
};

// API service test template
export const createApiTest = (apiService) => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  const mockResponse = (data, status = 200) => {
    return Promise.resolve({
      ok: status < 400,
      status,
      json: () => Promise.resolve(data),
    });
  };

  return { mockFetch, mockResponse };
};

// Hook test template
export const createHookTest = (hook, initialProps = {}) => {
  const TestComponent = ({ hookProps }) => {
    const result = hook(hookProps);
    return <div data-testid="hook-result">{JSON.stringify(result)}</div>;
  };

  const renderHook = (props = {}) => {
    return render(<TestComponent hookProps={{ ...initialProps, ...props }} />);
  };

  return { renderHook };
};

// Form test template
export const createFormTest = (FormComponent, initialData = {}) => {
  const renderForm = (props = {}) => {
    return render(<FormComponent {...props} />);
  };

  const fillForm = async (formData) => {
    Object.entries(formData).forEach(([name, value]) => {
      const input = screen.getByRole('textbox', { name: new RegExp(name, 'i') });
      fireEvent.change(input, { target: { value } });
    });
  };

  const submitForm = async () => {
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
  };

  return { renderForm, fillForm, submitForm };
};
`;
};

// ============================================================================
// EXPORT ALL PATTERNS
// ============================================================================

export const cursorPatterns = {
  formValidation: createFormValidation,
  apiService: createApiService,
  componentTemplate: createComponentTemplate,
  errorBoundary: createErrorBoundary,
  loadingSkeleton: createLoadingSkeleton,
  toastSystem: createToastSystem,
  modalPattern: createModalPattern,
  dataTable: createDataTablePattern,
  searchFilter: createSearchFilterPattern,
  webSocket: createWebSocketPattern,
  i18n: createI18nPattern,
  responsive: createResponsivePatterns,
  accessibility: createAccessibilityPatterns,
  performance: createPerformancePatterns,
  testPatterns: createTestPatterns,
  
  // Additional patterns for optimizer
  authService: (serviceName) => `
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
`,
  
  stateHook: (hookName) => `
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
  
  effectHook: (hookName) => `
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
  
  customHook: (hookName) => `
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
`,
};

export default cursorPatterns;
