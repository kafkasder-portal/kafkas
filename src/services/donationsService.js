import { apiClient } from './api.js';
import { BaseService } from './BaseService.js';

// Donations Service extending BaseService for standardized error handling
class DonationsService extends BaseService {
  constructor() {
    super('/donations');
  }

  // Specialized methods with standardized error handling
  async getDonationsByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch donations by status: ${status}`
    );
  }

  async getDonationsByDonor(donorId) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?donor_id=${donorId}`),
      `to fetch donations by donor: ${donorId}`
    );
  }

  async updateDonationStatus(id, status) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/status`, { status }),
      `to update donation status for id ${id}`
    );
  }

  // Legacy method names for backward compatibility
  async getAllDonations() {
    return this.getAll();
  }

  async getDonationById(id) {
    return this.getById(id);
  }

  async createDonation(donationData) {
    return this.create(donationData);
  }

  async updateDonation(id, donationData) {
    return this.update(id, donationData);
  }

  async deleteDonation(id) {
    return this.delete(id);
  }

  async getDonationStats() {
    return this.getStats();
  }
}

// Create and export service instance
export const donationsService = new DonationsService();
export default donationsService;