const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Standardized fetch wrapper for API calls
 * @param {string} endpoint - API endpoint (e.g., '/users')
 * @param {object} options - Fetch options (method, body, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // Stringify body if it's an object and not FormData
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // Remove Content-Type for FormData to let the browser set the correct boundary
  if (config.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API Request Failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
