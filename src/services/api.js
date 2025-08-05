// API configuration and helper functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401 && data.error?.message?.includes('expired')) {
          await this.refreshToken();
          // Retry the request with new token
          const retryConfig = {
            ...config,
            headers: this.getAuthHeaders()
          };
          const retryResponse = await fetch(url, retryConfig);
          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryData.error?.message || 'Request failed');
          }
          
          return retryData;
        }
        
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    return response;
  }

  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success) {
      // Store tokens and user data
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (!response.ok) {
        // Refresh token is invalid, clear storage and redirect to login
        this.logout();
        throw new Error('Session expired. Please log in again.');
      }

      // Update access token
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      return data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async logoutAll() {
    try {
      await this.makeRequest('/auth/logout-all', {
        method: 'POST'
      });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async verifyEmail(token) {
    return await this.makeRequest(`/auth/verify-email/${token}`, {
      method: 'GET'
    });
  }

  async resendVerification(email) {
    return await this.makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async forgotPassword(email) {
    return await this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token, passwords) {
    return await this.makeRequest(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify(passwords)
    });
  }

  async getCurrentUser() {
    return await this.makeRequest('/auth/me');
  }

  // User management methods
  async updateProfile(profileData) {
    return await this.makeRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return await this.makeRequest('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  async deleteAccount(confirmationData) {
    return await this.makeRequest('/user/account', {
      method: 'DELETE',
      body: JSON.stringify(confirmationData)
    });
  }

  async getDashboard() {
    return await this.makeRequest('/user/dashboard');
  }

  async updateAvatar(avatarUrl) {
    return await this.makeRequest('/user/avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatarUrl })
    });
  }

  async getUserActivity() {
    return await this.makeRequest('/user/activity');
  }

  // Utility methods
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Server is unavailable');
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
  getDashboard,
  updateAvatar,
  getUserActivity,
  isAuthenticated,
  getCurrentUserData,
  healthCheck
} = apiService;
