/**
 * ⚡ CURSOR AI AGENT CODE SNIPPETS
 * Bu dosya Cursor AI Agent'ın hızlı kod üretimi için snippet'ler içerir
 */

// ============================================================================
// REACT COMPONENT SNIPPETS
// ============================================================================

export const reactSnippets = {
  // Functional Component
  'rfc': `
import React from 'react';
import PropTypes from 'prop-types';

const $1 = ({ $2 }) => {
  return (
    <div className="$1-container">
      $3
    </div>
  );
};

$1.propTypes = {
  $2: PropTypes.$4,
};

export default $1;
`,

  // Functional Component with useState
  'rfcs': `
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const $1 = ({ $2 }) => {
  const [$3, set$3] = useState($4);

  return (
    <div className="$1-container">
      $5
    </div>
  );
};

$1.propTypes = {
  $2: PropTypes.$6,
};

export default $1;
`,

  // Functional Component with useEffect
  'rfce': `
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const $1 = ({ $2 }) => {
  useEffect(() => {
    $3
  }, [$4]);

  return (
    <div className="$1-container">
      $5
    </div>
  );
};

$1.propTypes = {
  $2: PropTypes.$6,
};

export default $1;
`,

  // Functional Component with useState and useEffect
  'rfcse': `
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const $1 = ({ $2 }) => {
  const [$3, set$3] = useState($4);

  useEffect(() => {
    $5
  }, [$6]);

  return (
    <div className="$1-container">
      $7
    </div>
  );
};

$1.propTypes = {
  $2: PropTypes.$8,
};

export default $1;
`,

  // Custom Hook
  'rhook': `
import { useState, useEffect } from 'react';

const use$1 = ($2) => {
  const [$3, set$3] = useState($4);

  useEffect(() => {
    $5
  }, [$6]);

  return {
    $3,
    set$3,
  };
};

export default use$1;
`,

  // Context Provider
  'rctx': `
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const $1Context = createContext();

export const use$1 = () => {
  const context = useContext($1Context);
  if (!context) {
    throw new Error('use$1 must be used within a $1Provider');
  }
  return context;
};

export const $1Provider = ({ children }) => {
  const [$2, set$2] = useState($3);

  const value = {
    $2,
    set$2,
  };

  return (
    <$1Context.Provider value={value}>
      {children}
    </$1Context.Provider>
  );
};

$1Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
`,
};

// ============================================================================
// FORM SNIPPETS
// ============================================================================

export const formSnippets = {
  // Basic Form
  'form': `
const handleSubmit = (e) => {
  e.preventDefault();
  $1
};

return (
  <form onSubmit={handleSubmit} className="form">
    $2
    <button type="submit">Submit</button>
  </form>
);
`,

  // Form with Validation
  'formv': `
const [errors, setErrors] = useState({});

const validateForm = (data) => {
  const newErrors = {};
  $1
  return newErrors;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formErrors = validateForm(formData);
  
  if (Object.keys(formErrors).length === 0) {
    $2
  } else {
    setErrors(formErrors);
  }
};
`,

  // Input Field
  'input': `
<input
  type="$1"
  name="$2"
  value={$3}
  onChange={(e) => set$3(e.target.value)}
  placeholder="$4"
  className="form-input"
  required
/>
{errors.$2 && <span className="error">{errors.$2}</span>}
`,

  // Select Field
  'select': `
<select
  name="$1"
  value={$2}
  onChange={(e) => set$2(e.target.value)}
  className="form-select"
  required
>
  <option value="">$3</option>
  $4
</select>
{errors.$1 && <span className="error">{errors.$1}</span>}
`,

  // Textarea Field
  'textarea': `
<textarea
  name="$1"
  value={$2}
  onChange={(e) => set$2(e.target.value)}
  placeholder="$3"
  className="form-textarea"
  rows="$4"
  required
/>
{errors.$1 && <span className="error">{errors.$1}</span>}
`,
};

// ============================================================================
// API SNIPPETS
// ============================================================================

export const apiSnippets = {
  // GET Request
  'get': `
const fetch$1 = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/$2');
    const data = await response.json();
    set$3(data);
  } catch (error) {
    console.error('Error fetching $1:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
`,

  // POST Request
  'post': `
const create$1 = async (data) => {
  try {
    setLoading(true);
    const response = await fetch('/api/$2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating $1:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
`,

  // PUT Request
  'put': `
const update$1 = async (id, data) => {
  try {
    setLoading(true);
    const response = await fetch(\`/api/$2/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating $1:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
`,

  // DELETE Request
  'delete': `
const delete$1 = async (id) => {
  try {
    setLoading(true);
    const response = await fetch(\`/api/$2/\${id}\`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting $1:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
`,

  // Custom Hook for API
  'useapi': `
const use$1 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/$2');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
`,
};

// ============================================================================
// STYLING SNIPPETS
// ============================================================================

export const stylingSnippets = {
  // CSS Module Import
  'cssm': `
import styles from './$1.module.css';
`,

  // Styled Components
  'styled': `
import styled from 'styled-components';

const $1 = styled.div\`
  $2
\`;
`,

  // CSS Class
  'class': `
className="$1"
`,

  // Conditional Class
  'cclass': `
className={\`$1 \${$2 ? '$3' : '$4'}\`}
`,

  // Inline Style
  'style': `
style={{
  $1
}}
`,

  // Responsive Design
  'responsive': `
@media (max-width: 768px) {
  $1
}
`,
};

// ============================================================================
// UTILITY SNIPPETS
// ============================================================================

export const utilitySnippets = {
  // Local Storage
  'ls': `
localStorage.setItem('$1', JSON.stringify($2));
`,

  // Get from Local Storage
  'gls': `
const $1 = JSON.parse(localStorage.getItem('$2') || '$3');
`,

  // Session Storage
  'ss': `
sessionStorage.setItem('$1', JSON.stringify($2));
`,

  // Get from Session Storage
  'gss': `
const $1 = JSON.parse(sessionStorage.getItem('$2') || '$3');
`,

  // Date Format
  'date': `
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('$1', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
`,

  // Currency Format
  'currency': `
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('$1', {
    style: 'currency',
    currency: '$2',
  }).format(amount);
};
`,

  // Debounce
  'debounce': `
const useDebounce = (value, delay) => {
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
`,

  // Throttle
  'throttle': `
const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};
`,
};

// ============================================================================
// TEST SNIPPETS
// ============================================================================

export const testSnippets = {
  // Component Test
  'test': `
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import $1 from './$1';

describe('$1', () => {
  it('should render correctly', () => {
    render(<$1 />);
    expect(screen.getByText('$2')).toBeInTheDocument();
  });

  it('should handle $3', () => {
    $4
  });
});
`,

  // Hook Test
  'htest': `
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import use$1 from './use$1';

describe('use$1', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => use$1());
    expect(result.current.$2).toBe($3);
  });

  it('should update state', () => {
    const { result } = renderHook(() => use$1());
    
    act(() => {
      result.current.set$2($4);
    });
    
    expect(result.current.$2).toBe($4);
  });
});
`,

  // Mock Function
  'mock': `
const mock$1 = vi.fn();
`,

  // Mock API Response
  'mockapi': `
const mockResponse = {
  $1
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  })
);
`,
};

// ============================================================================
// ERROR HANDLING SNIPPETS
// ============================================================================

export const errorSnippets = {
  // Try Catch
  'try': `
try {
  $1
} catch (error) {
  console.error('Error:', error);
  $2
}
`,

  // Async Try Catch
  'atry': `
try {
  $1
} catch (error) {
  console.error('Error:', error);
  $2
} finally {
  $3
}
`,

  // Error Boundary
  'eboundary': `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
`,

  // Error State
  'error': `
const [error, setError] = useState(null);

if (error) {
  return <div className="error">Error: {error}</div>;
}
`,
};

// ============================================================================
// PERFORMANCE SNIPPETS
// ============================================================================

export const performanceSnippets = {
  // React.memo
  'memo': `
import React from 'react';

const $1 = React.memo(({ $2 }) => {
  return (
    <div>
      $3
    </div>
  );
});

export default $1;
`,

  // useMemo
  'usememo': `
const $1 = useMemo(() => {
  return $2;
}, [$3]);
`,

  // useCallback
  'callback': `
const $1 = useCallback(() => {
  $2
}, [$3]);
`,

  // Lazy Loading
  'lazy': `
import { lazy, Suspense } from 'react';

const $1 = lazy(() => import('./$1'));

// In component:
<Suspense fallback={<div>Loading...</div>}>
  <$1 />
</Suspense>
`,

  // Virtual Scrolling
  'virtual': `
const VirtualList = ({ items, itemHeight, containerHeight }) => {
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

  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map((item) => (
          <div key={item.index} style={item.style}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};
`,
};

// ============================================================================
// ACCESSIBILITY SNIPPETS
// ============================================================================

export const accessibilitySnippets = {
  // ARIA Label
  'aria': `
aria-label="$1"
`,

  // ARIA Described By
  'describedby': `
aria-describedby="$1"
`,

  // ARIA Labelled By
  'labelledby': `
aria-labelledby="$1"
`,

  // ARIA Hidden
  'hidden': `
aria-hidden="true"
`,

  // ARIA Live
  'live': `
aria-live="polite"
`,

  // ARIA Atomic
  'atomic': `
aria-atomic="true"
`,

  // Focus Management
  'focus': `
const focusRef = useRef(null);

useEffect(() => {
  focusRef.current?.focus();
}, []);

// In JSX:
<div ref={focusRef} tabIndex="-1">
  $1
</div>
`,

  // Keyboard Navigation
  'keyboard': `
const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    $1();
  }
};

// In JSX:
<div 
  role="button"
  tabIndex="0"
  onKeyDown={handleKeyDown}
  onClick={$1}
>
  $2
</div>
`,
};

// ============================================================================
// EXPORT ALL SNIPPETS
// ============================================================================

export const cursorSnippets = {
  react: reactSnippets,
  form: formSnippets,
  api: apiSnippets,
  styling: stylingSnippets,
  utility: utilitySnippets,
  test: testSnippets,
  error: errorSnippets,
  performance: performanceSnippets,
  accessibility: accessibilitySnippets,
};

export default cursorSnippets;
