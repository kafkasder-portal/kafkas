/**
 * Centralized API helper functions
 * Eliminates duplicate API response patterns across the application
 */

/**
 * Standardized API response formatter
 * @param {any} data - Response data
 * @param {Error|null} error - Error object
 * @param {any} fallbackData - Fallback data for errors
 * @returns {Object} Standardized response
 */
export const formatApiResponse = (data, error = null, fallbackData = null) => {
  if (error) {
    return { data: fallbackData, error };
  }
  return { data, error: null };
};

/**
 * Standardized hook response formatter
 * @param {any} data - Response data
 * @param {boolean} loading - Loading state
 * @param {Error|null} error - Error object
 * @param {Function} refetch - Refetch function
 * @returns {Object} Standardized hook response
 */
export const formatHookResponse = (data, loading, error, refetch) => {
  return { data, loading, error, refetch };
};

/**
 * Standardized mock response generator
 * @param {any} data - Mock data
 * @param {number} status - HTTP status code
 * @param {number} delay - Response delay in ms
 * @returns {Promise} Mock response
 */
export const createMockResponse = (data, status = 200, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status,
        ok: status >= 200 && status < 300,
      });
    }, delay);
  });
};

/**
 * Standardized error handler for API calls
 * @param {Error} error - Error object
 * @param {string} operation - Operation description
 * @param {boolean} logToConsole - Whether to log to console
 */
export const handleApiError = (error, operation = 'API operation', logToConsole = true) => {
  if (logToConsole && import.meta.env.DEV) {
    console.error(`${operation} hatası:`, error);
  }
  
  // You can add error reporting service here
  // reportError(error, { operation, timestamp: new Date().toISOString() });
  
  return error;
};

/**
 * Standardized loading state manager
 * @param {Function} setLoading - Loading state setter
 * @param {Function} operation - Async operation to execute
 * @param {string} operationName - Operation name for error logging
 * @returns {Promise} Operation result
 */
export const withLoading = async (setLoading, operation, operationName = 'Operation') => {
  setLoading(true);
  try {
    const result = await operation();
    return result;
  } catch (error) {
    handleApiError(error, operationName);
    throw error;
  } finally {
    setLoading(false);
  }
};

/**
 * Standardized retry mechanism
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Operation result
 */
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      if (import.meta.env.DEV) {
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Standardized cache key generator
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} Cache key
 */
export const generateCacheKey = (endpoint, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${endpoint}${sortedParams ? `?${sortedParams}` : ''}`;
};

/**
 * Standardized data transformer
 * @param {Array} data - Raw data array
 * @param {Function} transformer - Transformation function
 * @returns {Array} Transformed data
 */
export const transformData = (data, transformer) => {
  if (!Array.isArray(data)) {
    return data;
  }
  
  return data.map(transformer);
};

/**
 * Standardized pagination helper
 * @param {Array} data - Full data array
 * @param {number} page - Current page
 * @param {number} pageSize - Items per page
 * @returns {Object} Pagination result
 */
export const paginateData = (data, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / pageSize),
      totalItems: data.length,
      itemsPerPage: pageSize,
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1,
    },
  };
};
