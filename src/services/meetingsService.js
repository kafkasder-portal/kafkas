import { apiClient } from './api.js';

// Meetings Service
export const meetingsService = {
  // Get all meetings
  async getAllMeetings() {
    try {
      const response = await apiClient.get('/meetings');
      return response;
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      throw error;
    }
  },

  // Get meeting by ID
  async getMeetingById(id) {
    try {
      const response = await apiClient.get(`/meetings/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch meeting:', error);
      throw error;
    }
  },

  // Create new meeting
  async createMeeting(meetingData) {
    try {
      const response = await apiClient.post('/meetings', meetingData);
      return response;
    } catch (error) {
      console.error('Failed to create meeting:', error);
      throw error;
    }
  },

  // Update meeting
  async updateMeeting(id, meetingData) {
    try {
      const response = await apiClient.put(`/meetings/${id}`, meetingData);
      return response;
    } catch (error) {
      console.error('Failed to update meeting:', error);
      throw error;
    }
  },

  // Delete meeting
  async deleteMeeting(id) {
    try {
      const response = await apiClient.delete(`/meetings/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      throw error;
    }
  },

  // Get meetings by status
  async getMeetingsByStatus(status) {
    try {
      const response = await apiClient.get(`/meetings?status=${status}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch meetings by status:', error);
      throw error;
    }
  },

  // Get upcoming meetings
  async getUpcomingMeetings() {
    try {
      const response = await apiClient.get('/meetings/upcoming');
      return response;
    } catch (error) {
      console.error('Failed to fetch upcoming meetings:', error);
      throw error;
    }
  },

  // Get meetings by date range
  async getMeetingsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(
        `/meetings?start=${startDate}&end=${endDate}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch meetings by date range:', error);
      throw error;
    }
  },

  // Search meetings
  async searchMeetings(query) {
    try {
      const response = await apiClient.get(
        `/meetings/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to search meetings:', error);
      throw error;
    }
  },

  // Update meeting status
  async updateMeetingStatus(id, status) {
    try {
      const response = await apiClient.put(`/meetings/${id}/status`, {
        status,
      });
      return response;
    } catch (error) {
      console.error('Failed to update meeting status:', error);
      throw error;
    }
  },

  // Add attendee to meeting
  async addAttendee(meetingId, attendeeId) {
    try {
      const response = await apiClient.post(
        `/meetings/${meetingId}/attendees`,
        { attendeeId }
      );
      return response;
    } catch (error) {
      console.error('Failed to add attendee to meeting:', error);
      throw error;
    }
  },

  // Remove attendee from meeting
  async removeAttendee(meetingId, attendeeId) {
    try {
      const response = await apiClient.delete(
        `/meetings/${meetingId}/attendees/${attendeeId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to remove attendee from meeting:', error);
      throw error;
    }
  },

  // Get meeting attendees
  async getMeetingAttendees(id) {
    try {
      const response = await apiClient.get(`/meetings/${id}/attendees`);
      return response;
    } catch (error) {
      console.error('Failed to fetch meeting attendees:', error);
      throw error;
    }
  },

  // Get meeting statistics
  async getMeetingStats() {
    try {
      const response = await apiClient.get('/meetings/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch meeting statistics:', error);
      throw error;
    }
  },

  // Backward compatibility aliases
  async getAll() {
    return this.getAllMeetings();
  },

  async update(id, data) {
    return this.updateMeeting(id, data);
  },

  async delete(id) {
    return this.deleteMeeting(id);
  },
};

export default meetingsService;
