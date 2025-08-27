import { BaseService } from './BaseService.js';
import { apiClient } from './api.js';

// Aid Service extending BaseService for standardized error handling and CRUD operations
class AidService extends BaseService {
  constructor() {
    super('/aid');
  }

  // Basic CRUD operations using base class methods
  async getAllAidRequests() {
    return this.getAll();
  }

  async getAidRequestById(id) {
    return this.getById(id);
  }

  async createAidRequest(aidData) {
    return this.create(aidData);
  }

  async updateAidRequest(id, aidData) {
    return this.update(id, aidData);
  }

  async deleteAidRequest(id) {
    return this.delete(id);
  }

  // Specialized methods with standardized error handling
  async getAidRequestsByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch aid requests by status: ${status}`
    );
  }

  async getAidRequestsByType(type) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?type=${type}`),
      `to fetch aid requests by type: ${type}`
    );
  }

  async getAidRequestsByPriority(priority) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?priority=${priority}`),
      `to fetch aid requests by priority: ${priority}`
    );
  }

  async getPendingAidRequests() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=pending`),
      'to fetch pending aid requests'
    );
  }

  async getUrgentAidRequests() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?priority=urgent`),
      'to fetch urgent aid requests'
    );
  }

  async searchAidRequests(query) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/search?q=${encodeURIComponent(query)}`),
      `to search aid requests with query: ${query}`
    );
  }

  async updateAidRequestStatus(id, status) {
    return this.handleRequest(
      () => apiClient.patch(`${this.endpoint}/${id}/status`, { status }),
      `to update aid request status for id ${id}`
    );
  }

  async assignAidRequest(id, volunteerId) {
    return this.handleRequest(
      () => apiClient.patch(`${this.endpoint}/${id}/assign`, { volunteerId }),
      `to assign aid request for id ${id}`
    );
  }

  async getAidRequestHistory(id) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/${id}/history`),
      `to fetch aid request history for id ${id}`
    );
  }

  async getAidStats() {
    return this.getStats();
  }

  async getAidReports(period) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/reports?period=${period}`),
      `to fetch aid reports for period: ${period}`
    );
  }

  async getAidRequestsByDateRange(startDate, endDate) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?start=${startDate}&end=${endDate}`),
      `to fetch aid requests by date range: ${startDate} to ${endDate}`
    );
  }

  // Backward compatibility aliases - DEPRECATED: Use base class methods directly
  // getAll() -> getAllAidRequests()
  // getById(id) -> getAidRequestById(id)
  // create(data) -> createAidRequest(data)
  // update(id, data) -> updateAidRequest(id, data)
  // delete(id) -> deleteAidRequest(id)
  // Note: These methods are kept for backward compatibility but should be replaced with direct base class method calls
}

// Create and export service instance
export const aidService = new AidService();
export default aidService;
