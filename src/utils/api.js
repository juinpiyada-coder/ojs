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

/**
 * Resolves media/file URLs to point to the active API server host and handles URL encoding for spaces
 * @param {string} url - The URL string from backend
 */
export const resolveFileUrl = (url) => {
  if (!url) return '';
  const baseUrl = API_URL.replace(/\/api\/?$/, '');
  let finalUrl = url;
  
  // If url contains /s3_img/, normalize domain/port to match current configured API host
  const s3Index = url.indexOf('/s3_img/');
  if (s3Index !== -1) {
    finalUrl = `${baseUrl}${url.substring(s3Index)}`;
  } else if (url.startsWith('/')) {
    finalUrl = `${baseUrl}${url}`;
  }

  // Ensure special characters and spaces are properly URL encoded without double encoding
  try {
    return encodeURI(decodeURI(finalUrl));
  } catch (e) {
    return finalUrl;
  }
};

export const resolveImageUrl = resolveFileUrl;
