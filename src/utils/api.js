/**
 * ==============================================================================
 * Direct High-Performance OJS API Client with Smart In-Memory / TTL Caching
 * Eliminates duplicate network waterfalls without heavyweight Redux overhead
 * ==============================================================================
 */

// Primary API Endpoints
export const PRODUCTION_API_URL = 'https://proxy.literaria-ajournaloftheenglishdepartmentwbsu.org/api';
export const LOCAL_API_URL = 'http://localhost:9090/api';

/**
 * Direct API Base URL resolution
 */
export const getDynamicApiUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  return PRODUCTION_API_URL;
};

export const API_URL = getDynamicApiUrl();
export const getActiveBackendUrl = () => getDynamicApiUrl();
export const setActiveBackendUrl = () => {};
export const initAutoFailover = () => {};
export const getCandidatePool = () => [getDynamicApiUrl()];

// Lightweight in-memory request cache and in-flight promise deduplication
const apiCache = new Map();
const inFlightRequests = new Map();

/**
 * Clear cached data for specific routes or entirely upon mutation
 */
export const clearApiCache = (prefix = null) => {
  if (!prefix) {
    apiCache.clear();
  } else {
    for (const key of apiCache.keys()) {
      if (key.includes(prefix)) {
        apiCache.delete(key);
      }
    }
  }
};

/**
 * Standardized fetch wrapper with in-flight deduplication and GET caching
 *
 * @param {string} endpoint - API route (e.g., '/users', '/articles', '/health')
 * @param {object} options - Fetch options (method, body, headers, cacheTtl, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { ...options.headers };

  // Set default JSON Content-Type unless body is FormData
  if (!(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  } else {
    delete headers['Content-Type'];
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = getDynamicApiUrl();
  const targetFullUrl = `${baseUrl}${normalizedEndpoint}`;

  // If mutation (POST/PUT/PATCH/DELETE), invalidate relevant cache
  if (method !== 'GET') {
    const routePrefix = normalizedEndpoint.split('?')[0].split('/')[1] || '';
    if (routePrefix) clearApiCache(routePrefix);
  }

  // Check TTL cache for GET requests
  const cacheTtlMs = options.cacheTtl !== undefined ? options.cacheTtl : (method === 'GET' ? 3000 : 0);
  const cacheKey = `${method}:${targetFullUrl}:${token || ''}`;

  if (cacheTtlMs > 0) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTtlMs) {
      return cached.data;
    }
  }

  // Deduplicate identical in-flight GET requests
  if (method === 'GET' && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const requestTimeoutMs = options.timeout || 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

  const config = {
    ...options,
    headers,
    body,
    signal: controller.signal
  };

  const fetchPromise = (async () => {
    try {
      const response = await fetch(targetFullUrl, config);
      clearTimeout(timer);

      let data = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      // Save in cache if GET request
      if (method === 'GET' && cacheTtlMs > 0) {
        apiCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  if (method === 'GET') {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  return fetchPromise;
};

/**
 * Resolves media / file URLs to point to the backend host
 *
 * @param {string} url - The URL string from backend or database
 */
export const resolveFileUrl = (url) => {
  if (!url) return '';
  const currentApi = getDynamicApiUrl();
  const baseUrl = currentApi.replace(/\/api\/?$/, '');
  let finalUrl = url.trim();

  const knownOrigins = [
    'http://localhost:9090',
    'http://127.0.0.1:9090',
    'https://proxy.literaria-ajournaloftheenglishdepartmentwbsu.org',
    'https://be.pjs.literaria-ajournaloftheenglishdepartmentwbsu.org'
  ];

  for (const origin of knownOrigins) {
    if (finalUrl.startsWith(origin)) {
      finalUrl = finalUrl.substring(origin.length);
      break;
    }
  }

  if (finalUrl.startsWith('/')) {
    if (/^\/(journals|manuscripts|avatars|branding|s3_img|uploads|storage|api)\//i.test(finalUrl)) {
      finalUrl = `${baseUrl}${finalUrl}`;
    }
  }

  try {
    return encodeURI(decodeURI(finalUrl));
  } catch (e) {
    return finalUrl;
  }
};

export const resolveImageUrl = resolveFileUrl;

/**
 * Image error fallback handler
 */
export const handleImageFailover = (event, originalUrl) => {
  if (!event || !event.target || !originalUrl) return;
  const fallbackBase = PRODUCTION_API_URL.replace(/\/api\/?$/, '');
  const cleanPath = originalUrl.replace(/^https?:\/\/[^\/]+/, '');
  const newSrc = `${fallbackBase}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
  if (event.target.src !== newSrc) {
    event.target.src = newSrc;
  }
};
