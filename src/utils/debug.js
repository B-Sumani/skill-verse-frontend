// Debug utility for troubleshooting API issues
export const debugAPI = {
  // Log current authentication state
  logAuthState: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const walletAddress = localStorage.getItem('walletAddress');
    
    console.group('🔍 Authentication Debug Info');
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('User exists:', !!user);
    console.log('User data:', user ? JSON.parse(user) : 'null');
    console.log('Wallet address:', walletAddress);
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.groupEnd();
  },

  // Test API connectivity
  testAPIConnectivity: async () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://skill-verse-backend.onrender.com/api';
    
    console.group('🌐 API Connectivity Test');
    console.log('API Base URL:', API_BASE_URL);
    
    try {
      // Test basic connectivity
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Health check status:', response.status);
      console.log('Health check response:', await response.text());
      
      if (response.ok) {
        console.log('✅ API is reachable');
      } else {
        console.log('❌ API returned error:', response.status);
      }
    } catch (error) {
      console.log('❌ API connection failed:', error.message);
    }
    
    console.groupEnd();
  },

  // Test authentication endpoint
  testAuthEndpoint: async () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://skill-verse-backend.onrender.com/api';
    const token = localStorage.getItem('token');
    
    console.group('🔐 Authentication Endpoint Test');
    console.log('Testing /auth/me endpoint...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      console.log('Auth endpoint status:', response.status);
      console.log('Auth endpoint response:', await response.text());
      
      if (response.status === 403) {
        console.log('❌ 403 Forbidden - Token is invalid or expired');
      } else if (response.status === 401) {
        console.log('❌ 401 Unauthorized - No token provided');
      } else if (response.ok) {
        console.log('✅ Authentication successful');
      } else {
        console.log('❌ Unexpected response:', response.status);
      }
    } catch (error) {
      console.log('❌ Auth endpoint failed:', error.message);
    }
    
    console.groupEnd();
  },

  // Clear all stored data
  clearAllData: () => {
    console.log('🧹 Clearing all stored data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('walletAddress');
    console.log('✅ All data cleared');
  },

  // Run full diagnostic
  runDiagnostic: async () => {
    console.group('🔧 Full Diagnostic Report');
    debugAPI.logAuthState();
    await debugAPI.testAPIConnectivity();
    await debugAPI.testAuthEndpoint();
    console.groupEnd();
  }
};

// Make it available globally for debugging
if (process.env.NODE_ENV === 'development') {
  window.debugAPI = debugAPI;
  console.log('🔧 Debug utilities available at window.debugAPI');
  console.log('Run window.debugAPI.runDiagnostic() for full diagnostic');
}
