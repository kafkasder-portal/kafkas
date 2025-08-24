import { apiClient } from './api.js';

// Scholarship Service
export const scholarshipService = {
  // Get all scholarships
  async getAllScholarships() {
    try {
      const response = await apiClient.get('/scholarships');
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
      throw error;
    }
  },

  // Get scholarship by ID
  async getScholarshipById(id) {
    try {
      const response = await apiClient.get(`/scholarships/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarship:', error);
      throw error;
    }
  },

  // Create new scholarship
  async createScholarship(scholarshipData) {
    try {
      const response = await apiClient.post('/scholarships', scholarshipData);
      return response;
    } catch (error) {
      console.error('Failed to create scholarship:', error);
      throw error;
    }
  },

  // Update scholarship
  async updateScholarship(id, scholarshipData) {
    try {
      const response = await apiClient.put(
        `/scholarships/${id}`,
        scholarshipData
      );
      return response;
    } catch (error) {
      console.error('Failed to update scholarship:', error);
      throw error;
    }
  },

  // Delete scholarship
  async deleteScholarship(id) {
    try {
      const response = await apiClient.delete(`/scholarships/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete scholarship:', error);
      throw error;
    }
  },

  // Get scholarships by status
  async getScholarshipsByStatus(status) {
    try {
      const response = await apiClient.get(`/scholarships?status=${status}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarships by status:', error);
      throw error;
    }
  },

  // Get scholarships by type
  async getScholarshipsByType(type) {
    try {
      const response = await apiClient.get(`/scholarships?type=${type}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarships by type:', error);
      throw error;
    }
  },

  // Get active scholarships
  async getActiveScholarships() {
    try {
      const response = await apiClient.get('/scholarships?status=active');
      return response;
    } catch (error) {
      console.error('Failed to fetch active scholarships:', error);
      throw error;
    }
  },

  // Get scholarship applications
  async getScholarshipApplications(scholarshipId) {
    try {
      const response = await apiClient.get(
        `/scholarships/${scholarshipId}/applications`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarship applications:', error);
      throw error;
    }
  },

  // Submit scholarship application
  async submitApplication(scholarshipId, applicationData) {
    try {
      const response = await apiClient.post(
        `/scholarships/${scholarshipId}/applications`,
        applicationData
      );
      return response;
    } catch (error) {
      console.error('Failed to submit scholarship application:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await apiClient.patch(
        `/scholarship-applications/${applicationId}/status`,
        { status }
      );
      return response;
    } catch (error) {
      console.error('Failed to update application status:', error);
      throw error;
    }
  },

  // Get application by ID
  async getApplicationById(applicationId) {
    try {
      const response = await apiClient.get(
        `/scholarship-applications/${applicationId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch application:', error);
      throw error;
    }
  },

  // Search scholarships
  async searchScholarships(query) {
    try {
      const response = await apiClient.get(
        `/scholarships/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to search scholarships:', error);
      throw error;
    }
  },

  // Get scholarships by deadline
  async getScholarshipsByDeadline(days) {
    try {
      const response = await apiClient.get(`/scholarships?deadline=${days}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarships by deadline:', error);
      throw error;
    }
  },

  // Get scholarship recipients
  async getScholarshipRecipients(scholarshipId) {
    try {
      const response = await apiClient.get(
        `/scholarships/${scholarshipId}/recipients`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarship recipients:', error);
      throw error;
    }
  },

  // Award scholarship
  async awardScholarship(scholarshipId, recipientData) {
    try {
      const response = await apiClient.post(
        `/scholarships/${scholarshipId}/award`,
        recipientData
      );
      return response;
    } catch (error) {
      console.error('Failed to award scholarship:', error);
      throw error;
    }
  },

  // Get scholarship statistics
  async getScholarshipStats() {
    try {
      const response = await apiClient.get('/scholarships/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarship statistics:', error);
      throw error;
    }
  },

  // Get scholarship reports
  async getScholarshipReports(period) {
    try {
      const response = await apiClient.get(
        `/scholarships/reports?period=${period}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch scholarship reports:', error);
      throw error;
    }
  },

  // Get user applications
  async getUserApplications(userId) {
    try {
      const response = await apiClient.get(
        `/users/${userId}/scholarship-applications`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch user applications:', error);
      throw error;
    }
  },

  // Backward compatibility aliases
  async getAll() {
    return this.getAllScholarships();
  },

  async update(id, data) {
    return this.updateScholarship(id, data);
  },

  async delete(id) {
    return this.deleteScholarship(id);
  },
};

export default scholarshipService;
