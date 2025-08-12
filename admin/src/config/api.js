// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  
  // Member endpoints
  MEMBERS: `${API_BASE_URL}/api/members`,
  MEMBER_BY_ID: (id) => `${API_BASE_URL}/api/members/${id}`,
  
  // Seat endpoints
  SEATS: `${API_BASE_URL}/api/seats`,
  SEATS_AVAILABLE: `${API_BASE_URL}/api/seats/available`,
  SEATS_ASSIGN: `${API_BASE_URL}/api/seats/assign`,
  SEATS_VACATE: `${API_BASE_URL}/api/seats/vacate`,
  SEATS_SYNC: `${API_BASE_URL}/api/seats/sync`,
  
  // Payment endpoints
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  PAYMENTS_STATS: `${API_BASE_URL}/api/payments/stats`,
  
  // WhatsApp endpoints
  WHATSAPP_SEND_REMINDER: `${API_BASE_URL}/api/whatsapp/send-reminder`,
};

// Default axios configuration
export const getAuthConfig = () => {
  const token = localStorage.getItem('adminToken');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  };
};

export default API_ENDPOINTS;
