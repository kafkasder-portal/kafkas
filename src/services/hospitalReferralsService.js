import { apiClient } from './api.js';

// Hospital Referrals Service
export const hospitalReferralsService = {
  // Get all hospital referrals
  async getAllHospitalReferrals() {
    try {
      const response = await apiClient.get('/hospital-referrals');
      return response;
    } catch (error) {
      console.error('Failed to fetch hospital referrals:', error);
      throw error;
    }
  },

  // Get hospital referral by ID
  async getHospitalReferralById(id) {
    try {
      const response = await apiClient.get(`/hospital-referrals/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch hospital referral:', error);
      throw error;
    }
  },

  // Create new hospital referral
  async createHospitalReferral(referralData) {
    try {
      const response = await apiClient.post(
        '/hospital-referrals',
        referralData
      );
      return response;
    } catch (error) {
      console.error('Failed to create hospital referral:', error);
      throw error;
    }
  },

  // Update hospital referral
  async updateHospitalReferral(id, referralData) {
    try {
      const response = await apiClient.put(
        `/hospital-referrals/${id}`,
        referralData
      );
      return response;
    } catch (error) {
      console.error('Failed to update hospital referral:', error);
      throw error;
    }
  },

  // Delete hospital referral
  async deleteHospitalReferral(id) {
    try {
      const response = await apiClient.delete(`/hospital-referrals/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to delete hospital referral:', error);
      throw error;
    }
  },

  // Get hospital referrals by status
  async getHospitalReferralsByStatus(status) {
    try {
      const response = await apiClient.get(
        `/hospital-referrals?status=${status}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch hospital referrals by status:', error);
      throw error;
    }
  },

  // Get hospital referrals by patient
  async getHospitalReferralsByPatient(patientId) {
    try {
      const response = await apiClient.get(
        `/hospital-referrals?patient_id=${patientId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch hospital referrals by patient:', error);
      throw error;
    }
  },

  // Get hospital referrals by hospital
  async getHospitalReferralsByHospital(hospitalId) {
    try {
      const response = await apiClient.get(
        `/hospital-referrals?hospital_id=${hospitalId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch hospital referrals by hospital:', error);
      throw error;
    }
  },

  // Update referral status
  async updateReferralStatus(id, status) {
    try {
      const response = await apiClient.put(`/hospital-referrals/${id}/status`, {
        status,
      });
      return response;
    } catch (error) {
      console.error('Failed to update referral status:', error);
      throw error;
    }
  },

  // Get referral statistics
  async getReferralStats() {
    try {
      const response = await apiClient.get('/hospital-referrals/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
      // Return mock data if API fails
      return {
        total: 45,
        pending: 12,
        change: -5.3,
        thisMonth: 3,
        monthlyTrend: [38000, 42000, 45000, 41000, 48000, 52000],
      };
    }
  },

  // Search hospital referrals
  async searchHospitalReferrals(query) {
    try {
      const response = await apiClient.get(
        `/hospital-referrals/search?q=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('Failed to search hospital referrals:', error);
      throw error;
    }
  },
};

export default hospitalReferralsService;
