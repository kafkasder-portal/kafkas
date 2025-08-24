import { apiClient } from './api.js';
import { BaseService } from './BaseService.js';

// Users Service extending BaseService for standardized error handling
class UsersService extends BaseService {
  constructor() {
    super('/users');
  }

  // Specialized methods with standardized error handling
  async getUsersByRole(role) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?role=${role}`),
      `to fetch users by role: ${role}`
    );
  }

  async getUsersByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch users by status: ${status}`
    );
  }

  async updateUserStatus(id, status) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/status`, { status }),
      `to update user status for id ${id}`
    );
  }

  async updateUserRole(id, role) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/role`, { role }),
      `to update user role for id ${id}`
    );
  }

  // Legacy method names for backward compatibility
  async getAllUsers() {
    return this.getAll();
  }

  async getUserById(id) {
    return this.getById(id);
  }

  async createUser(userData) {
    return this.create(userData);
  }

  async updateUser(id, userData) {
    return this.update(id, userData);
  }

  async deleteUser(id) {
    return this.delete(id);
  }

  async searchUsers(query) {
    return this.search(query);
  }

  async getUserStats() {
    return this.getStats();
  }
}

// Create and export service instance
export const usersService = new UsersService();
export default usersService;