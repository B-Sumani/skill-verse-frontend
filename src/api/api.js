import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://skill-verse-backend.onrender.com/api';

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers
    });
    
    // Handle different error status codes
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('walletAddress');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.log('Forbidden - token may be invalid or expired');
      // Don't auto-redirect on 403, let the component handle it
    } else if (error.response?.status >= 500) {
      console.log('Server error - backend may be down');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Signup
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Signin
  signin: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (token) => {
    const response = await api.post('/auth/refresh-token', { token });
    return response.data;
  },
};

// Algorand API calls
export const algorandAPI = {
  // Generate account
  generateAccount: async () => {
    const response = await api.post('/algorand/account/generate');
    return response.data;
  },

  // Get wallet info
  getWalletInfo: async () => {
    const response = await api.get('/algorand/wallet');
    return response.data;
  },

  // Get account info
  getAccountInfo: async (address) => {
    const response = await api.get(`/algorand/account/${address}`);
    return response.data;
  },

  // Send transaction
  sendTransaction: async (transactionData) => {
    const response = await api.post('/algorand/transaction/send', transactionData);
    return response.data;
  },

  // Create asset
  createAsset: async (assetData) => {
    const response = await api.post('/algorand/asset/create', assetData);
    return response.data;
  },

  // Get network info
  getNetworkInfo: async () => {
    const response = await api.get('/algorand/network');
    return response.data;
  },

  // Validate address
  validateAddress: async (address) => {
    const response = await api.post('/algorand/validate-address', { address });
    return response.data;
  },
};

// User API calls
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Get other user's profile
  getOtherUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Delete user profile
  deleteProfile: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Track profile view
  trackProfileView: async (viewedUserId) => {
    const response = await api.post(`/users/${viewedUserId}/view`);
    return response.data;
  },

  // Search users
  searchUsers: async (searchParams) => {
    const response = await api.get('/users/search', { params: searchParams });
    return response.data;
  },

  // Send skill exchange request
  sendSkillExchangeRequest: async (requestData) => {
    const response = await api.post('/users/skill-exchange-request', requestData);
    return response.data;
  },
};

// Session API calls
export const sessionAPI = {
  // Create session
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  // Get session
  getSession: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  // Get all sessions for current user
  getSessions: async () => {
    const response = await api.get('/video-sessions/sessions');
    return response.data;
  },

  // Update session
  updateSession: async (sessionId, sessionData) => {
    const response = await api.put(`/sessions/${sessionId}`, sessionData);
    return response.data;
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },

  // Accept session request
  acceptSession: async (requestId) => {
    const response = await api.post(`/sessions/${requestId}/accept`);
    return response.data;
  },

  // Decline session request
  declineSession: async (requestId) => {
    const response = await api.post(`/sessions/${requestId}/decline`);
    return response.data;
  },

  // Get session requests
  getSessionRequests: async () => {
    const response = await api.get('/sessions/requests');
    return response.data;
  },

  // Get session invitations
  getSessionInvitations: async () => {
    const response = await api.get('/sessions/invitations');
    return response.data;
  },
};

// Message API calls
export const messageAPI = {
  // Send message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get conversations
  getConversations: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  // Get messages with a specific user
  getMessages: async (userId, params) => {
    const response = await api.get(`/messages/${userId}`, { params });
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (userId) => {
    const response = await api.put(`/messages/${userId}/read`);
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  // Check content for violations
  checkContent: async (content) => {
    const response = await api.post('/messages/check-content', { content });
    return response.data;
  },
};

// Feedback API calls
export const feedbackAPI = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Get feedback
  getFeedback: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },

  // Update feedback
  updateFeedback: async (feedbackId, feedbackData) => {
    const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
    return response.data;
  },
};

// Credential API calls
export const credentialAPI = {
  // Create credential
  createCredential: async (credentialData) => {
    const response = await api.post('/credentials', credentialData);
    return response.data;
  },

  // Get credential
  getCredential: async (credentialId) => {
    const response = await api.get(`/credentials/${credentialId}`);
    return response.data;
  },

  // Update credential
  updateCredential: async (credentialId, credentialData) => {
    const response = await api.put(`/credentials/${credentialId}`, credentialData);
    return response.data;
  },

  // Delete credential
  deleteCredential: async (credentialId) => {
    const response = await api.delete(`/credentials/${credentialId}`);
    return response.data;
  },
};

// Video API calls
export const videoAPI = {
  // Create video session
  createSession: async (sessionData) => {
    const response = await api.post('/video-sessions/sessions', sessionData);
    return response.data;
  },

  // Get video sessions
  getSessions: async (params) => {
    const response = await api.get('/video-sessions/sessions', { params });
    return response.data;
  },

  // Get specific session
  getSession: async (sessionId) => {
    const response = await api.get(`/video-sessions/sessions/${sessionId}`);
    return response.data;
  },

  // Start session
  startSession: async (sessionId) => {
    const response = await api.post(`/video-sessions/sessions/${sessionId}/start`);
    return response.data;
  },

  // End session
  endSession: async (sessionId) => {
    const response = await api.post(`/video-sessions/sessions/${sessionId}/end`);
    return response.data;
  },

  // Cancel session
  cancelSession: async (sessionId) => {
    const response = await api.post(`/video-sessions/sessions/${sessionId}/cancel`);
    return response.data;
  },

  // Accept session
  acceptSession: async (sessionId) => {
    const response = await api.post(`/video-sessions/sessions/${sessionId}/accept`);
    return response.data;
  },

  // Decline session
  declineSession: async (sessionId) => {
    const response = await api.post(`/video-sessions/sessions/${sessionId}/decline`);
    return response.data;
  },

  // Submit feedback
  submitFeedback: async (sessionId, feedbackData) => {
    const response = await api.post(`/video-sessions/sessions/${sessionId}/feedback`, feedbackData);
    return response.data;
  },
};

// Video Request API calls
export const videoRequestAPI = {
  // Send video request
  sendRequest: async (requestData) => {
    const response = await api.post('/video-requests/requests', requestData);
    return response.data;
  },

  // Get video requests
  getRequests: async (params) => {
    const response = await api.get('/video-requests/requests', { params });
    return response.data;
  },

  // Accept video request
  acceptRequest: async (requestId, data) => {
    const response = await api.put(`/video-requests/requests/${requestId}/accept`, data);
    return response.data;
  },

  // Decline video request
  declineRequest: async (requestId, data) => {
    const response = await api.put(`/video-requests/requests/${requestId}/decline`, data);
    return response.data;
  },

  // Schedule video request
  scheduleRequest: async (requestId, data) => {
    const response = await api.put(`/video-requests/requests/${requestId}/schedule`, data);
    return response.data;
  },

  // Get pending requests count
  getPendingCount: async () => {
    const response = await api.get('/video-requests/requests/pending-count');
    return response.data;
  },
};

// Notification API calls
export const notificationAPI = {
  // Get notifications
  getNotifications: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Get notification count
  getCount: async (params) => {
    const response = await api.get('/notifications/count', { params });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Admin API calls
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // User management
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Analytics
  getAnalytics: async (params) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};

// ===== LIVEKIT API =====
export const livekitAPI = {
  // Generate room token
  generateToken: async (sessionId) => {
    const response = await api.get(`/livekit/token/${sessionId}`);
    return response.data;
  },
  
  // End video call
  endCall: async (sessionId) => {
    const response = await api.post(`/livekit/end-call/${sessionId}`);
    return response.data;
  },
  
  // Get room info
  getRoomInfo: async (sessionId) => {
    const response = await api.get(`/livekit/room-info/${sessionId}`);
    return response.data;
  }
};

export default api; 