import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApiCache Hook
 * @description API caching hook with TTL support and automatic cache invalidation
 * @param {string} key - Cache key
 * @param {Function} fetcher - Data fetching function
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @param {boolean} enabled - Enable/disable caching
 * @returns {Object} Cached data and cache management functions
 */
const useApiCache = (key, fetcher, ttl = 5 * 60 * 1000, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const abortControllerRef = useRef(null);
  const cacheKey = `api-cache-${key}`;

  // Get cached data
  const getCachedData = useCallback(() => {
    if (!enabled) return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data: cachedData, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp < ttl) {
        return cachedData;
      } else {
        // Remove expired cache
        localStorage.removeItem(cacheKey);
        return null;
      }
    } catch (err) {
      console.warn('Failed to read cache:', err);
      localStorage.removeItem(cacheKey);
      return null;
    }
  }, [cacheKey, ttl, enabled]);

  // Set cached data
  const setCachedData = useCallback((newData) => {
    if (!enabled) return;
    
    try {
      const cacheData = {
        data: newData,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to write cache:', err);
    }
  }, [cacheKey, enabled]);

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
      setData(null);
      setLastUpdated(null);
    } catch (err) {
      console.warn('Failed to clear cache:', err);
    }
  }, [cacheKey]);

  // Clear all caches
  const clearAllCaches = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('api-cache-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.warn('Failed to clear all caches:', err);
    }
  }, []);

  // Fetch data
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLastUpdated(new Date());
          setLoading(false);
          return cachedData;
        }
      }

      // Fetch fresh data
      const result = await fetcher(abortControllerRef.current.signal);
      
      if (!abortControllerRef.current.signal.aborted) {
        setData(result);
        setLastUpdated(new Date());
        setCachedData(result);
        setLoading(false);
        return result;
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        setError(err);
        setLoading(false);
        console.error('API cache fetch error:', err);
      }
    }
  }, [fetcher, getCachedData, setCachedData]);

  // Refresh data
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Get cache info
  const getCacheInfo = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { timestamp } = JSON.parse(cached);
      const now = Date.now();
      const age = now - timestamp;
      const isValid = age < ttl;

      return {
        key: cacheKey,
        age,
        isValid,
        expiresAt: timestamp + ttl,
        size: cached.length,
      };
    } catch (err) {
      return null;
    }
  }, [cacheKey, ttl]);

  // Get all cache info
  const getAllCacheInfo = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      const cacheInfo = [];

      keys.forEach(key => {
        if (key.startsWith('api-cache-')) {
          const info = getCacheInfo();
          if (info) {
            cacheInfo.push(info);
          }
        }
      });

      return cacheInfo;
    } catch (err) {
      return [];
    }
  }, [getCacheInfo]);

  // Initialize on mount
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Cleanup expired caches on mount
  useEffect(() => {
    if (enabled) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('api-cache-')) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const { timestamp } = JSON.parse(cached);
              const now = Date.now();
              if (now - timestamp >= ttl) {
                localStorage.removeItem(key);
              }
            }
          } catch (err) {
            localStorage.removeItem(key);
          }
        }
      });
    }
  }, [enabled, ttl]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    fetchData,
    refresh,
    clearCache,
    clearAllCaches,
    getCacheInfo,
    getAllCacheInfo,
    isCached: !!getCachedData(),
  };
};

export default useApiCache;
