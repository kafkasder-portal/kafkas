import { apiClient } from './api.js'
import { handleApiError } from '../utils/errorHandler.js'

// Check if API is available
const API_AVAILABLE = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ''

// Mock data for different endpoints
const MOCK_DATA = {
  '/donations': {
    stats: { 
      total: 150000, 
      monthly: 25000, 
      change: 12.5,
      count: 45, 
      thisMonth: 25000,
      monthlyTrend: [45000, 52000, 48000, 61000, 55000, 67000]
    },
    data: [],
  },
  '/beneficiaries': {
    stats: { 
      total: 120, 
      active: 98, 
      change: 8.2,
      thisMonth: 8,
      monthlyTrend: [42000, 47000, 51000, 49000, 62000, 58000]
    },
    data: [],
  },
  '/hospital-referrals': {
    stats: { 
      total: 45, 
      pending: 12, 
      change: -5.3,
      thisMonth: 3,
      monthlyTrend: [38000, 42000, 45000, 41000, 48000, 52000]
    },
    data: [],
  },
  '/aid': {
    stats: { programs: 12, active: 8, beneficiaries: 150 },
    data: [],
  },
  '/volunteers': {
    stats: { total: 25, active: 20, thisMonth: 3 },
    data: [],
  },
}

/**
 * Base service class that provides standardized error handling
 * and common CRUD operations for all services
 */
export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  /**
   * Standardized error handling wrapper
   * @param {Function} requestFn - The API request function to execute
   * @param {string} operation - Description of the operation for logging
   * @returns {Promise} The result of the API request
   */
  async handleRequest(requestFn, operation = 'API request') {
    try {
      const result = await requestFn()
      return result
    } catch (error) {
      // Use the standardized error handler
      handleApiError(error)

      // Log additional context for debugging
      console.error(`Failed ${operation}:`, {
        endpoint: this.endpoint,
        error: error.message,
        status: error.status,
        details: error.data,
      })

      // Re-throw the error so components can handle it appropriately
      throw error
    }
  }

  // Standard CRUD operations with consistent error handling
  async getAll() {
    if (!API_AVAILABLE) {
      return Promise.resolve(MOCK_DATA[this.endpoint]?.data || [])
    }

    return this.handleRequest(() => apiClient.get(this.endpoint), `to fetch all ${this.endpoint}`)
  }

  async getById(id) {
    if (!API_AVAILABLE) {
      return Promise.resolve({ id, name: 'Mock Data', status: 'active' })
    }

    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/${id}`),
      `to fetch ${this.endpoint} with id ${id}`
    )
  }

  async create(data) {
    if (!API_AVAILABLE) {
      return Promise.resolve({ id: Date.now(), ...data, created_at: new Date().toISOString() })
    }

    return this.handleRequest(
      () => apiClient.post(this.endpoint, data),
      `to create ${this.endpoint}`
    )
  }

  async update(id, data) {
    if (!API_AVAILABLE) {
      return Promise.resolve({ id, ...data, updated_at: new Date().toISOString() })
    }

    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}`, data),
      `to update ${this.endpoint} with id ${id}`
    )
  }

  async delete(id) {
    if (!API_AVAILABLE) {
      return Promise.resolve({ success: true, id })
    }

    return this.handleRequest(
      () => apiClient.delete(`${this.endpoint}/${id}`),
      `to delete ${this.endpoint} with id ${id}`
    )
  }

  async search(query) {
    if (!API_AVAILABLE) {
      return Promise.resolve([])
    }

    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/search?q=${encodeURIComponent(query)}`),
      `to search ${this.endpoint}`
    )
  }

  async getStats() {
    if (!API_AVAILABLE) {
      // Return mock data when API is not available
      const mockData = MOCK_DATA[this.endpoint]?.stats || { total: 0, count: 0 }
      return Promise.resolve(mockData)
    }

    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/stats`),
      `to fetch ${this.endpoint} statistics`
    )
  }

  // Utility method for custom requests with error handling
  async customRequest(requestFn, operation) {
    return this.handleRequest(requestFn, operation)
  }
}

export default BaseService
