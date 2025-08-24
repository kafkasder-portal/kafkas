import { apiClient } from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Giriş yapılırken hata oluştu');
    }
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (_error) {
      throw new Error('Token yenilenirken hata oluştu');
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.user;
    } catch (_error) {
      throw new Error('Kullanıcı bilgileri alınırken hata oluştu');
    }
  }

  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.user;
    } catch (_error) {
      throw new Error('Profil güncellenirken hata oluştu');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (_error) {
      throw new Error('Şifre değiştirilirken hata oluştu');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (_error) {
      throw new Error('Şifre sıfırlama e-postası gönderilirken hata oluştu');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response;
    } catch (_error) {
      throw new Error('Şifre sıfırlanırken hata oluştu');
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
export default authService;
