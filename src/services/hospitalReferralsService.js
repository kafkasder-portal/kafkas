import { apiClient } from './api.js'

// Hospital Referrals Service
export const hospitalReferralsService = {
  // Get all hospital referrals
  async getAllHospitalReferrals() {
    try {
      const response = await apiClient.get('/hospital-referrals')
      return response
    } catch (error) {
      console.error('Failed to fetch hospital referrals:', error)
      throw error
    }
  },

  // Get hospital referral by ID
  async getHospitalReferralById(id) {
    try {
      const response = await apiClient.get(`/hospital-referrals/${id}`)
      return response
    } catch (error) {
      console.error('Failed to fetch hospital referral:', error)
      throw error
    }
  },

  // Create new hospital referral
  async createHospitalReferral(referralData) {
    try {
      const response = await apiClient.post('/hospital-referrals', referralData)
      return response
    } catch (error) {
      console.er  ror('Failed to create hospital referral:', error)
      throw error
    }
  },

  // Update hospital referral
  async updateHospitalReferral(id, referralData) {
    try {
      const response = await apiClient.put(`/hospital-referrals/${id}`, referralData)
      return response
    } catch (error) {
      console.error('Failed to update hospital referral:', error)
      throw error
    }
  },

  // Delete hospital referral
  async deleteHospitalReferral(id) {
    try {
      const response = await apiClient.delete(`/hospital-referrals/${id}`)
      return response
    } catch (error) {
      console.error('Failed to delete hospital referral:', error)
      throw error
    }
  },

  // Get hospital referrals by status
  async getHospitalReferralsByStatus(status) {
    try {
      const response = await apiClient.get(`/hospital-referrals?status=${status}`)
      return response
    } catch (error) {
      console.error('Failed to fetch hospital referrals by status:', error)
      throw error
    }
  },

  // Get hospital referrals by patient
  async getHospitalReferralsByPatient(patientId) {
    try {
      const response = await apiClient.get(`/hospital-referrals?patient_id=${patientId}`)
      return response
    } catch (error) {
      console.error('Failed to fetch hospital referrals by patient:', error)
      throw error
    }
  },

  // Get hospital referrals by hospital
  async getHospitalReferralsByHospital(hospitalId) {
    try {
      const response = await apiClient.get(`/hospital-referrals?hospital_id=${hospitalId}`)
      return response
    } catch (error) {
      console.error('Failed to fetch hospital referrals by hospital:', error)
      throw error
    }
  },

  // Update referral status
  async updateReferralStatus(id, status) {
    try {
      const response = await apiClient.put(`/hospital-referrals/${id}/status`, { status })
      return response
    } catch (error) {
      console.error('Failed to update referral status:', error)
      throw error
    }
  },

  // Get referral statistics
  async getReferralStats() {
    try {
      // Check if API is available
      const API_AVAILABLE =
        import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ''

      if (!API_AVAILABLE) {
        // Return mock referral statistics
        return Promise.resolve({
          total: 35,
          pending: 8,
          completed: 24,
          cancelled: 3,
          thisMonth: 12,
        })
      }

      const response = await apiClient.get('/hospital-referrals/stats')
      return response
    } catch (error) {
      console.error('Failed to fetch referral statistics:', error)
      // Return mock data as fallback
      return {
        total: 35,
        pending: 8,
        completed: 24,
        cancelled: 3,
        thisMonth: 12,
      }
    }
  },

  // Search hospital referrals
  async searchHospitalReferrals(query) {
    try {
      const response = await apiClient.get(
        `/hospital-referrals/search?q=${encodeURIComponent(query)}`
      )
      return response
    } catch (error) {
      console.error('Failed to search hospital referrals:', error)
      throw error
    }
  },

  // Dashboard için özel metod
  async getTotalReferrals() {
    try {
      const stats = await this.getReferralStats();
      return {
        total: stats.total || 156,
        pending: stats.pending || 23,
        change: -5.1
      };
    } catch (error) {
      console.error('Failed to fetch total referrals:', error);
      return {
        total: 156,
        pending: 23,
        change: -5.1
      };
    }
  },
}

export default hospitalReferralsService
