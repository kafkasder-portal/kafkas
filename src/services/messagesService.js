import { apiClient } from './api.js';

// Messages Service
export const messagesService = {
  // Get all messages
  async getAllMessages() {
    try {
      const response = await apiClient.get('/messages');
      return response;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  },

  // Get message by ID
  async getMessageById(id) {
    try {
      const response = await apiClient.get(`/messages/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch message:', error);
      throw error;
    }
  },

  // Send new message
  async sendMessage(messageData) {
    try {
      const response = await apiClient.post('/messages', messageData);
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  // Update message
  async updateMessage(id, messageData) {
    try {
      const response = await apiClient.put(`/messages/${id}`, messageData);
      return response;
    } catch (error) {
      console.error('Failed to update message:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(id) {
    try {
      const response = await apiClient.delete(`/messages/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },

  // Get messages by conversation
  async getMessagesByConversation(conversationId) {
    try {
      const response = await apiClient.get(`/messages/conversation/${conversationId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch messages by conversation:', error);
      throw error;
    }
  },

  // Get messages by sender
  async getMessagesBySender(senderId) {
    try {
      const response = await apiClient.get(`/messages?sender=${senderId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch messages by sender:', error);
      throw error;
    }
  },

  // Get unread messages
  async getUnreadMessages(userId) {
    try {
      const response = await apiClient.get(`/messages/unread?user=${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch unread messages:', error);
      throw error;
    }
  },

  // Mark message as read
  async markAsRead(id) {
    try {
      const response = await apiClient.put(`/messages/${id}/read`);
      return response;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  },

  // Mark multiple messages as read
  async markMultipleAsRead(messageIds) {
    try {
      const response = await apiClient.put('/messages/read-multiple', { messageIds });
      return response;
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      throw error;
    }
  },

  // Search messages
  async searchMessages(query) {
    try {
      const response = await apiClient.get(`/messages/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      console.error('Failed to search messages:', error);
      throw error;
    }
  },

  // Get conversations for user
  async getUserConversations(userId) {
    try {
      const response = await apiClient.get(`/messages/conversations?user=${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user conversations:', error);
      throw error;
    }
  },

  // Create new conversation
  async createConversation(participantIds, title) {
    try {
      const response = await apiClient.post('/messages/conversations', { participantIds, title });
      return response;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  },

  // Get message statistics
  async getMessageStats() {
    try {
      const response = await apiClient.get('/messages/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch message statistics:', error);
      throw error;
    }
  },

  // Backward compatibility aliases
  async getAll() {
    return this.getAllMessages();
  },

  async update(id, data) {
    return this.updateMessage(id, data);
  },

  async delete(id) {
    return this.deleteMessage(id);
  },
};

export default messagesService;