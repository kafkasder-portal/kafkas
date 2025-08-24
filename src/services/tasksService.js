import { apiClient } from './api.js';
import { BaseService } from './BaseService.js';

// Tasks Service extending BaseService for standardized error handling
class TasksService extends BaseService {
  constructor() {
    super('/tasks');
  }

  // Specialized methods with standardized error handling
  async getTasksByStatus(status) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?status=${status}`),
      `to fetch tasks by status: ${status}`
    );
  }

  async getTasksByPriority(priority) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?priority=${priority}`),
      `to fetch tasks by priority: ${priority}`
    );
  }

  async getTasksByAssignee(assigneeId) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?assignee=${assigneeId}`),
      `to fetch tasks by assignee: ${assigneeId}`
    );
  }

  async updateTaskStatus(id, status) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/status`, { status }),
      `to update task status for id ${id}`
    );
  }

  async assignTask(id, assigneeId) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/${id}/assign`, { assigneeId }),
      `to assign task ${id} to user ${assigneeId}`
    );
  }

  async getOverdueTasks() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/overdue`),
      'to fetch overdue tasks'
    );
  }

  // Legacy method names for backward compatibility
  async getAllTasks() {
    return this.getAll();
  }

  async getTaskById(id) {
    return this.getById(id);
  }

  async createTask(taskData) {
    return this.create(taskData);
  }

  async updateTask(id, taskData) {
    return this.update(id, taskData);
  }

  async deleteTask(id) {
    return this.delete(id);
  }

  async searchTasks(query) {
    return this.search(query);
  }

  async getTaskStats() {
    return this.getStats();
  }
}

// Create and export service instance
export const tasksService = new TasksService();
export default tasksService;
