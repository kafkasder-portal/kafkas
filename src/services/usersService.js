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

  // Legacy method names for backward compatibility - DEPRECATED: Use base class methods directly
  // getAll() -> getAllUsers()
  // getById(id) -> getUserById(id) 
  // create(data) -> createUser(data)
  // update(id, data) -> updateUser(id, data)
  // delete(id) -> deleteUser(id)
  // search(query) -> searchUsers(query)
  // getStats() -> getUserStats()
  // Note: These methods are kept for backward compatibility but should be replaced with direct base class method calls
}

// Create and export service instance
export const usersService = new UsersService();
export default usersService;
