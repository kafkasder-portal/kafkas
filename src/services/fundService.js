import { apiClient } from './api.js';

// Fund Service
export const fundService = {
  // Get all funds
  async getAllFunds() {
    try {
      const response = await apiClient.get('/funds');
      return response;
    } catch (error) {
      console.error('Failed to fetch funds:', error);
      throw error;
    }
  },

  // Get fund by ID
  async getFundById(id) {
    try {
      const response = await apiClient.get(`/funds/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch fund:', error);
      throw error;
    }
  },

  // Create new fund
  async createFund(fundData) {
    try {
      const response = await apiClient.post('/funds', fundData);
      return response;
    } catch (error) {
      console.error('Failed to create fund:', error);
      throw error;
    }
  },

  // Update fund
  async updateFund(id, fundData) {
    try {
      const response = await apiClient.put(`/funds/${id}`, fundData);
      return response;
    } catch (error) {
      console.error('Failed to update fund:', error);
      throw error;
    }
  },

  // Delete fund
  async deleteFund(id) {
    try {
      const response = await apiClient.delete(`/funds/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete fund:', error);
      throw error;
    }
  },

  // Get funds by status
  async getFundsByStatus(status) {
    try {
      const response = await apiClient.get(`/funds?status=${status}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch funds by status:', error);
      throw error;
    }
  },

  // Get funds by category
  async getFundsByCategory(category) {
    try {
      const response = await apiClient.get(`/funds?category=${category}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch funds by category:', error);
      throw error;
    }
  },

  // Get active funds
  async getActiveFunds() {
    try {
      const response = await apiClient.get('/funds?status=active');
      return response;
    } catch (error) {
      console.error('Failed to fetch active funds:', error);
      throw error;
    }
  },

  // Search funds
  async searchFunds(query) {
    try {
      const response = await apiClient.get(
        `/funds/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to search funds:', error);
      throw error;
    }
  },

  // Update fund status
  async updateFundStatus(id, status) {
    try {
      const response = await apiClient.patch(`/funds/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Failed to update fund status:', error);
      throw error;
    }
  },

  // Add fund contribution
  async addContribution(fundId, contributionData) {
    try {
      const response = await apiClient.post(
        `/funds/${fundId}/contributions`,
        contributionData
      );
      return response;
    } catch (error) {
      console.error('Failed to add contribution:', error);
      throw error;
    }
  },

  // Get fund contributions
  async getFundContributions(fundId) {
    try {
      const response = await apiClient.get(`/funds/${fundId}/contributions`);
      return response;
    } catch (error) {
      console.error('Failed to fetch fund contributions:', error);
      throw error;
    }
  },

  // Get fund progress
  async getFundProgress(id) {
    try {
      const response = await apiClient.get(`/funds/${id}/progress`);
      return response;
    } catch (error) {
      console.error('Failed to fetch fund progress:', error);
      throw error;
    }
  },

  // Get fund statistics
  async getFundStats() {
    try {
      const response = await apiClient.get('/funds/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch fund statistics:', error);
      throw error;
    }
  },

  // Get fund reports
  async getFundReports(period) {
    try {
      const response = await apiClient.get(`/funds/reports?period=${period}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch fund reports:', error);
      throw error;
    }
  },

  // Get funds by date range
  async getFundsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(
        `/funds?start=${startDate}&end=${endDate}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch funds by date range:', error);
      throw error;
    }
  },

  // Backward compatibility aliases
  async getAll() {
    return this.getAllFunds();
  },

  async update(id, data) {
    return this.updateFund(id, data);
  },

  async delete(id) {
    return this.deleteFund(id);
  },
};

export default fundService;
