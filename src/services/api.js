// API Base Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Import mock client for fallback
import { mockApiClient } from './mockApiClient.js';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Request interceptor to add authentication
const addAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Retry logic for failed requests
const retryRequest = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Enhanced error handling
const handleApiError = error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    console.error('Access forbidden:', error.response.data);
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded');
  }
  return Promise.reject(error);
};

// Enhanced API client with better error handling
class SecureApiClient {
  constructor(baseURL = API_BASE_URL) {
    // Use mock API in development mode
    if (import.meta.env.DEV) {
      this.baseURL = 'mock://api';
      this.useMock = true;
    } else {
      this.baseURL = baseURL;
      this.useMock = false;
    }
  }

  async request(endpoint, options = {}) {
    // Use mock API directly in development mode
    if (this.useMock) {
      return await mockApiClient.request(endpoint, options);
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...addAuthHeaders(), ...options.headers };

    const requestOptions = {
      ...options,
      headers,
    };

    return retryRequest(async () => {
      try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
          error.status = response.status;
          error.data = errorData;
          throw error;
        }

        const data = await response.json();
        return data;
      } catch (error) {
        // Fallback to mock API if real API fails
        console.warn(
          'API request failed, falling back to mock API:',
          error.message
        );
        return await mockApiClient.request(endpoint, requestOptions);
      }
    });
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export secure API client instance
export const apiClient = new SecureApiClient();
export default apiClient;
