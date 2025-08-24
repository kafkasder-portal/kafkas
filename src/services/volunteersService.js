import { apiClient } from './api.js';
import { BaseService } from './BaseService.js';

// Volunteers Service extending BaseService for standardized error handling
class VolunteersService extends BaseService {
  constructor() {
    super('/volunteers');
  }

  // Specialized methods with standardized error handling
  async getVolunteersByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch volunteers by status: ${status}`
    );
  }

  async getVolunteersBySkill(skill) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?skill=${skill}`),
      `to fetch volunteers by skill: ${skill}`
    );
  }

  async getAvailableVolunteers() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/available`),
      'to fetch available volunteers'
    );
  }

  async updateVolunteerStatus(id, status) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/status`, { status }),
      `to update volunteer status for id ${id}`
    );
  }

  async assignVolunteerToTask(volunteerId, taskId) {
    return this.handleRequest(
      () => apiClient.post(`${this.endpoint}/${volunteerId}/assign`, { taskId }),
      `to assign volunteer ${volunteerId} to task ${taskId}`
    );
  }

  async getVolunteerActivities(id) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/${id}/activities`),
      `to fetch activities for volunteer ${id}`
    );
  }

  // Legacy method names for backward compatibility
  async getAllVolunteers() {
    return this.getAll();
  }

  async getVolunteerById(id) {
    return this.getById(id);
  }

  async createVolunteer(volunteerData) {
    return this.create(volunteerData);
  }

  async updateVolunteer(id, volunteerData) {
    return this.update(id, volunteerData);
  }

  async deleteVolunteer(id) {
    return this.delete(id);
  }

  async searchVolunteers(query) {
    return this.search(query);
  }

  async getVolunteerStats() {
    return this.getStats();
  }
}

// Create and export service instance
export const volunteersService = new VolunteersService();
export default volunteersService;