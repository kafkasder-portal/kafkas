import { BaseService } from './BaseService.js';
import { apiClient } from './api.js';

// Fund Service extending BaseService for standardized error handling and CRUD operations
class FundService extends BaseService {
  constructor() {
    super('/funds');
  }

  // Basic CRUD operations using base class methods
  async getAllFunds() {
    return this.getAll();
  }

  async getFundById(id) {
    return this.getById(id);
  }

  async createFund(fundData) {
    return this.create(fundData);
  }

  async updateFund(id, fundData) {
    return this.update(id, fundData);
  }

  async deleteFund(id) {
    return this.delete(id);
  }

  // Specialized methods with standardized error handling
  async getFundsByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch funds by status: ${status}`
    );
  }

  async getFundsByCategory(category) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?category=${category}`),
      `to fetch funds by category: ${category}`
    );
  }

  async getActiveFunds() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=active`),
      'to fetch active funds'
    );
  }

  async searchFunds(query) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/search?q=${encodeURIComponent(query)}`),
      `to search funds with query: ${query}`
    );
  }

  async updateFundStatus(id, status) {
    return this.handleRequest(
      () => apiClient.patch(`${this.endpoint}/${id}/status`, { status }),
      `to update fund status for id ${id}`
    );
  }

  async addContribution(fundId, contributionData) {
    return this.handleRequest(
      () => apiClient.post(`${this.endpoint}/${fundId}/contributions`, contributionData),
      `to add contribution for fund id ${fundId}`
    );
  }

  async getFundContributions(fundId) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/${fundId}/contributions`),
      `to fetch fund contributions for id ${fundId}`
    );
  }

  async getFundProgress(id) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/${id}/progress`),
      `to fetch fund progress for id ${id}`
    );
  }

  async getFundStats() {
    return this.getStats();
  }

  async getFundReports(period) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/reports?period=${period}`),
      `to fetch fund reports for period: ${period}`
    );
  }

  async getFundsByDateRange(startDate, endDate) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?start=${startDate}&end=${endDate}`),
      `to fetch funds by date range: ${startDate} to ${endDate}`
    );
  }

  // Backward compatibility aliases - DEPRECATED: Use base class methods directly
  // getAll() -> getAllFunds()
  // getById(id) -> getFundById(id)
  // create(data) -> createFund(data)
  // update(id, data) -> updateFund(id, data)
  // delete(id) -> deleteFund(id)
  // Note: These methods are kept for backward compatibility but should be replaced with direct base class method calls
}

// Create and export service instance
export const fundService = new FundService();
export default fundService;
