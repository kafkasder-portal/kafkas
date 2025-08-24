import { apiClient } from './api.js';
import { BaseService } from './BaseService.js';

// Finance Service extending BaseService for standardized error handling
class FinanceService extends BaseService {
  constructor() {
    super('/finance');
  }

  // Specialized methods with standardized error handling
  async getRecordsByType(type) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?type=${type}`),
      `to fetch records by type: ${type}`
    );
  }

  async getRecordsByCategory(category) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?category=${category}`),
      `to fetch records by category: ${category}`
    );
  }

  async getRecordsByDateRange(startDate, endDate) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}?start=${startDate}&end=${endDate}`),
      `to fetch records by date range: ${startDate} to ${endDate}`
    );
  }

  async getFinancialSummary() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/summary`),
      'to fetch financial summary'
    );
  }

  async getBudgetInfo() {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/budget`),
      'to fetch budget information'
    );
  }

  async updateBudget(budgetData) {
    return this.handleRequest(
      () => apiClient.put(`${this.endpoint}/budget`, budgetData),
      'to update budget'
    );
  }

  async getExpenseReports(period) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/reports/expenses?period=${period}`),
      `to fetch expense reports for period: ${period}`
    );
  }

  async getIncomeReports(period) {
    return this.handleRequest(
      () => apiClient.get(`${this.endpoint}/reports/income?period=${period}`),
      `to fetch income reports for period: ${period}`
    );
  }

  // Legacy method names for backward compatibility
  async getAllFinancialRecords() {
    return this.getAll();
  }

  async getFinancialRecordById(id) {
    return this.getById(id);
  }

  async createFinancialRecord(recordData) {
    return this.create(recordData);
  }

  async updateFinancialRecord(id, recordData) {
    return this.update(id, recordData);
  }

  async deleteFinancialRecord(id) {
    return this.delete(id);
  }

  async searchFinancialRecords(query) {
    return this.search(query);
  }

  async getFinancialStats() {
    return this.getStats();
  }
}

// Create and export service instance
export const financeService = new FinanceService();
export default financeService;