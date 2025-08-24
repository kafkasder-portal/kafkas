import { apiClient } from './api.js';

// Aid Service
export const aidService = {
  // Get all aid requests
  async getAllAidRequests() {
    try {
      const response = await apiClient.get('/aid');
      return response;
    } catch (error) {
      console.error('Failed to fetch aid requests:', error);
      throw error;
    }
  },

  // Get aid request by ID
  async getAidRequestById(id) {
    try {
      const response = await apiClient.get(`/aid/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch aid request:', error);
      throw error;
    }
  },

  // Create new aid request
  async createAidRequest(aidData) {
    try {
      const response = await apiClient.post('/aid', aidData);
      return response;
    } catch (error) {
      console.error('Failed to create aid request:', error);
      throw error;
    }
  },

  // Update aid request
  async updateAidRequest(id, aidData) {
    try {
      const response = await apiClient.put(`/aid/${id}`, aidData);
      return response;
    } catch (error) {
      console.error('Failed to update aid request:', error);
      throw error;
    }
  },

  // Delete aid request
  async deleteAidRequest(id) {
    try {
      const response = await apiClient.delete(`/aid/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete aid request:', error);
      throw error;
    }
  },

  // Get aid requests by status
  async getAidRequestsByStatus(status) {
    try {
      const response = await apiClient.get(`/aid?status=${status}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch aid requests by status:', error);
      throw error;
    }
  },

  // Get aid requests by type
  async getAidRequestsByType(type) {
    try {
      const response = await apiClient.get(`/aid?type=${type}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch aid requests by type:', error);
      throw error;
    }
  },

  // Get aid requests by priority
  async getAidRequestsByPriority(priority) {
    try {
      const response = await apiClient.get(`/aid?priority=${priority}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch aid requests by priority:', error);
      throw error;
    }
  },

  // Get pending aid requests
  async getPendingAidRequests() {
    try {
      const response = await apiClient.get('/aid?status=pending');
      return response;
    } catch (error) {
      console.error('Failed to fetch pending aid requests:', error);
      throw error;
    }
  },

  // Get urgent aid requests
  async getUrgentAidRequests() {
    try {
      const response = await apiClient.get('/aid?priority=urgent');
      return response;
    } catch (error) {
      console.error('Failed to fetch urgent aid requests:', error);
      throw error;
    }
  },

  // Search aid requests
  async searchAidRequests(query) {
    try {
      const response = await apiClient.get(
        `/aid/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to search aid requests:', error);
      throw error;
    }
  },

  // Update aid request status
  async updateAidRequestStatus(id, status) {
    try {
      const response = await apiClient.patch(`/aid/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Failed to update aid request status:', error);
      throw error;
    }
  },

  // Assign aid request to volunteer
  async assignAidRequest(id, volunteerId) {
    try {
      const response = await apiClient.patch(`/aid/${id}/assign`, {
        volunteerId,
      });
      return response;
    } catch (error) {
      console.error('Failed to assign aid request:', error);
      throw error;
    }
  },

  // Get aid request history
  async getAidRequestHistory(id) {
    try {
      const response = await apiClient.get(`/aid/${id}/history`);
      return response;
    } catch (error) {
      console.error('Failed to fetch aid request history:', error);
      throw error;
    }
  },

  // Get aid statistics
  async getAidStats() {
    try {
      const response = await apiClient.get('/aid/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch aid statistics:', error);
      throw error;
    }
  },

  // Get aid reports
  async getAidReports(period) {
    try {
      const response = await apiClient.get(`/aid/reports?period=${period}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch aid reports:', error);
      throw error;
    }
  },

  // Get aid requests by date range
  async getAidRequestsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(
        `/aid?start=${startDate}&end=${endDate}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch aid requests by date range:', error);
      throw error;
    }
  },

  // Backward compatibility aliases
  async getAll() {
    return this.getAllAidRequests();
  },

  async update(id, data) {
    return this.updateAidRequest(id, data);
  },

  async delete(id) {
    return this.deleteAidRequest(id);
  },
};

export default aidService;
