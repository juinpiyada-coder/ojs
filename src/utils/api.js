/**
 * ==============================================================================
 * Direct High-Performance OJS API Client with Session & Memory Cache
 * Keeps data persistently across tab and page navigation so UI switches are instant!
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

// In-memory cache + In-flight promise deduplication
const memoryCache = new Map();
const inFlightRequests = new Map();

// 5 minutes default persistent cache TTL for instant navigation
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Read cached response from Memory or SessionStorage
 */
export const getCachedData = (key) => {
  // 1. Check memory cache first
  const memItem = memoryCache.get(key);
  if (memItem && Date.now() - memItem.timestamp < memItem.ttl) {
    return memItem.data;
  }

  // 2. Check sessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const raw = window.sessionStorage.getItem(`ojs_cache_${key}`);
      if (raw) {
        const item = JSON.parse(raw);
        if (Date.now() - item.timestamp < item.ttl) {
          memoryCache.set(key, item); // rehydrate memory
          return item.data;
        } else {
          window.sessionStorage.removeItem(`ojs_cache_${key}`);
        }
      }
    } catch {}
  }
  return null;
};

/**
 * Write response to Memory and SessionStorage
 */
export const setCachedData = (key, data, ttl = DEFAULT_CACHE_TTL_MS) => {
  const item = { data, timestamp: Date.now(), ttl };
  memoryCache.set(key, item);
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(`ojs_cache_${key}`, JSON.stringify(item));
    } catch {}
  }
};

/**
 * Invalidate cache upon create/update/delete mutations
 */
export const clearApiCache = (prefix = null) => {
  if (!prefix) {
    memoryCache.clear();
    if (typeof window !== 'undefined' && window.sessionStorage) {
      Object.keys(window.sessionStorage).forEach((k) => {
        if (k.startsWith('ojs_cache_')) window.sessionStorage.removeItem(k);
      });
    }
  } else {
    for (const key of memoryCache.keys()) {
      if (key.includes(prefix)) memoryCache.delete(key);
    }
    if (typeof window !== 'undefined' && window.sessionStorage) {
      Object.keys(window.sessionStorage).forEach((k) => {
        if (k.startsWith('ojs_cache_') && k.includes(prefix)) {
          window.sessionStorage.removeItem(k);
        }
      });
    }
  }
};

/**
 * Standardized fetch wrapper with Automatic Caching & Instant Navigation Persistence
 *
 * @param {string} endpoint - API route (e.g., '/users', '/articles', '/health')
 * @param {object} options - Fetch options (method, body, headers, cacheTtl, forceFresh, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { ...options.headers };

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

  // If mutation (POST/PUT/PATCH/DELETE), instantly invalidate cache for affected resource
  if (method !== 'GET') {
    const routePrefix = normalizedEndpoint.split('?')[0].split('/')[1] || '';
    if (routePrefix) clearApiCache(routePrefix);
  }

  const cacheKey = `${method}:${normalizedEndpoint}:${token ? 'auth' : 'anon'}`;
  const cacheTtlMs = options.cacheTtl !== undefined ? options.cacheTtl : (method === 'GET' ? DEFAULT_CACHE_TTL_MS : 0);

  // Return cached data immediately if available and fresh
  if (method === 'GET' && cacheTtlMs > 0 && !options.forceFresh) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
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

      // Persist in memory + sessionStorage for instant tab navigation
      if (method === 'GET' && cacheTtlMs > 0) {
        setCachedData(cacheKey, data, cacheTtlMs);
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
