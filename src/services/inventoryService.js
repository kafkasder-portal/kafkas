import { apiClient } from './api.js';

// Inventory Service
export const inventoryService = {
  // Get all inventory items
  async getAllItems() {
    try {
      const response = await apiClient.get('/inventory');
      return response;
    } catch (error) {
      console.error('Failed to fetch inventory items:', error);
      throw error;
    }
  },

  // Get inventory item by ID
  async getItemById(id) {
    try {
      const response = await apiClient.get(`/inventory/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch inventory item:', error);
      throw error;
    }
  },

  // Create new inventory item
  async createItem(itemData) {
    try {
      const response = await apiClient.post('/inventory', itemData);
      return response;
    } catch (error) {
      console.error('Failed to create inventory item:', error);
      throw error;
    }
  },

  // Update inventory item
  async updateItem(id, itemData) {
    try {
      const response = await apiClient.put(`/inventory/${id}`, itemData);
      return response;
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  },

  // Delete inventory item
  async deleteItem(id) {
    try {
      const response = await apiClient.delete(`/inventory/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      throw error;
    }
  },

  // Get items by category
  async getItemsByCategory(category) {
    try {
      const response = await apiClient.get(`/inventory?category=${category}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch items by category:', error);
      throw error;
    }
  },

  // Get low stock items
  async getLowStockItems() {
    try {
      const response = await apiClient.get('/inventory/low-stock');
      return response;
    } catch (error) {
      console.error('Failed to fetch low stock items:', error);
      throw error;
    }
  },

  // Search inventory items
  async searchItems(query) {
    try {
      const response = await apiClient.get(
        `/inventory/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to search inventory items:', error);
      throw error;
    }
  },

  // Update item stock
  async updateStock(id, quantity, operation = 'set') {
    try {
      const response = await apiClient.put(`/inventory/${id}/stock`, {
        quantity,
        operation,
      });
      return response;
    } catch (error) {
      console.error('Failed to update item stock:', error);
      throw error;
    }
  },

  // Get inventory statistics
  async getInventoryStats() {
    try {
      const response = await apiClient.get('/inventory/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch inventory statistics:', error);
      throw error;
    }
  },

  // Get stock movements
  async getStockMovements(itemId) {
    try {
      const response = await apiClient.get(`/inventory/${itemId}/movements`);
      return response;
    } catch (error) {
      console.error('Failed to fetch stock movements:', error);
      throw error;
    }
  },

  // Backward compatibility aliases
  async getAll() {
    return this.getAllItems();
  },

  async update(id, data) {
    return this.updateItem(id, data);
  },

  async delete(id) {
    return this.deleteItem(id);
  },
};

export default inventoryService;
