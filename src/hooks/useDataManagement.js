import { useState, useCallback } from 'react';

/**
 * Custom hook for standardized data management
 * Eliminates duplicate state management patterns across components
 */
export const useDataManagement = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Standardized loading state management
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((error) => {
    setError(error);
    setLoading(false);
  }, []);

  // Standardized data operations
  const updateData = useCallback((newData) => {
    setData(newData);
    setFilteredData(newData);
  }, []);

  const addItem = useCallback((item) => {
    setData(prev => [...prev, item]);
    setFilteredData(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id, updatedItem) => {
    setData(prev => prev.map(item => item.id === id ? updatedItem : item));
    setFilteredData(prev => prev.map(item => item.id === id ? updatedItem : item));
  }, []);

  const removeItem = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
    setFilteredData(prev => prev.filter(item => item.id !== id));
  }, []);

  // Standardized filtering
  const filterData = useCallback((filterFn) => {
    setFilteredData(data.filter(filterFn));
  }, [data]);

  const clearFilter = useCallback(() => {
    setFilteredData(data);
  }, [data]);

  // Standardized search
  const searchData = useCallback((query, searchFields = []) => {
    if (!query.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(query.toLowerCase());
      })
    );
    setFilteredData(filtered);
  }, [data]);

  // Standardized API call wrapper
  const executeApiCall = useCallback(async (apiCall, operation = 'API call') => {
    startLoading();
    try {
      const result = await apiCall();
      updateData(result.data || result);
      stopLoading();
      return result;
    } catch (error) {
      setLoadingError(error);
      if (import.meta.env.DEV) {
        console.error(`${operation} hatası:`, error);
      }
      throw error;
    }
  }, [startLoading, stopLoading, setLoadingError, updateData]);

  return {
    // State
    data,
    filteredData,
    loading,
    error,
    
    // Actions
    setData: updateData,
    addItem,
    updateItem,
    removeItem,
    filterData,
    clearFilter,
    searchData,
    
    // Loading management
    startLoading,
    stopLoading,
    setLoadingError,
    
    // API wrapper
    executeApiCall,
  };
};

/**
 * Specialized hook for list management with pagination
 */
export const useListManagement = (initialData = [], itemsPerPage = 10) => {
  const {
    data,
    filteredData,
    loading,
    error,
    setData,
    addItem,
    updateItem,
    removeItem,
    filterData,
    clearFilter,
    searchData,
    startLoading,
    stopLoading,
    setLoadingError,
    executeApiCall,
  } = useDataManagement(initialData);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Pagination actions
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

  return {
    // Inherited from useDataManagement
    data,
    filteredData,
    loading,
    error,
    setData,
    addItem,
    updateItem,
    removeItem,
    filterData,
    clearFilter,
    searchData,
    startLoading,
    stopLoading,
    setLoadingError,
    executeApiCall,
    
    // Pagination specific
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage: itemsPerPageState,
    goToPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
  };
};
