import { apiClient } from './api.js';
import { BaseService } from './BaseService.js';

// Beneficiaries Service extending BaseService for standardized error handling
class BeneficiariesService extends BaseService {
  constructor() {
    super('/beneficiaries');
  }

  // Specialized methods with standardized error handling
  async getBeneficiariesByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch beneficiaries by status: ${status}`
    );
  }

  async getBeneficiariesByCategory(category) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?category=${category}`),
      `to fetch beneficiaries by category: ${category}`
    );
  }

  async updateBeneficiaryStatus(id, status) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/status`, { status }),
      `to update beneficiary status for id ${id}`
    );
  }

  // Legacy method names for backward compatibility
  async getAllBeneficiaries() {
    return this.getAll();
  }

  async getBeneficiaryById(id) {
    return this.getById(id);
  }

  async createBeneficiary(beneficiaryData) {
    return this.create(beneficiaryData);
  }

  async updateBeneficiary(id, beneficiaryData) {
    return this.update(id, beneficiaryData);
  }

  async deleteBeneficiary(id) {
    return this.delete(id);
  }

  async searchBeneficiaries(query) {
    return this.search(query);
  }

  async getBeneficiaryStats() {
    return this.getStats();
  }
}

// Create and export service instance
export const beneficiariesService = new BeneficiariesService();
export default beneficiariesService;
