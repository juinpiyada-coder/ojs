/**
 * ==============================================================================
 * Open Journal System (OJS) - Smart Multi-Backend API Client
 * Features:
 *  - Automatic Instant Failover from Localhost to Live Working Production Proxy
 *  - Transparent Request Retrying with Session-Persisted Health State
 *  - High-Availability Dynamic File & Media URL Resolution
 *  - Production Working URL: https://proxy.literaria-ajournaloftheenglishdepartmentwbsu.org/api
 * ==============================================================================
 */

// Production Working Backend Endpoint
export const PRODUCTION_API_URL = 'https://proxy.literaria-ajournaloftheenglishdepartmentwbsu.org/api';
export const LOCAL_API_URL = 'http://localhost:9090/api';

// Candidate Endpoints Pool
const KNOWN_BACKENDS = [
  'http://localhost:9090/api',
  'https://proxy.literaria-ajournaloftheenglishdepartmentwbsu.org/api',
  'https://be.pjs.literaria-ajournaloftheenglishdepartmentwbsu.org/api'
];

/**
 * Safely accesses Vite / Node environment variables
 */
const getEnvVar = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return null;
};

/**
 * Normalizes a URL by trimming spaces, removing trailing slashes, and ensuring /api suffix
 */
const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return PRODUCTION_API_URL;
  let clean = url.trim().replace(/\/+$/, '');
  if (!clean.endsWith('/api') && !clean.includes('/api/')) {
    clean += '/api';
  }
  return clean;
};

/**
 * Detects whether a URL is targeting a local machine (localhost / 127.0.0.1)
 */
const isLocalhostUrl = (url) => {
  return /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(url);
};

/**
 * Detects whether an error is a network/connectivity/DNS/timeout failure vs an application 4xx error
 */
const isNetworkOrConnectionError = (err) => {
  if (!err) return false;
  if (err.name === 'AbortError' || err.name === 'TimeoutError') return true;
  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('connect') ||
    msg.includes('failed') ||
    msg.includes('refused') ||
    msg.includes('timeout') ||
    msg.includes('offline') ||
    msg.includes('enotfound') ||
    msg.includes('econnrefused') ||
    msg.includes('err_name_not_resolved') ||
    msg.includes('abort')
  );
};

/**
 * Builds the ordered candidate backend pool
 */
export const getCandidatePool = () => {
  const pool = [];
  const addCandidate = (url) => {
    const normalized = normalizeApiUrl(url);
    if (normalized && !pool.includes(normalized)) {
      pool.push(normalized);
    }
  };

  // 1. Primary Endpoint from environment variable (VITE_API_URL)
  const primaryEnv = getEnvVar('VITE_API_URL');
  if (primaryEnv) {
    addCandidate(primaryEnv);
  }

  // 2. Fallback Endpoint from environment variable (VITE_FALLBACK_API_URL)
  const fallbackEnv = getEnvVar('VITE_FALLBACK_API_URL');
  if (fallbackEnv) {
    addCandidate(fallbackEnv);
  }

  // 3. Guaranteed Production Proxy URL
  addCandidate(PRODUCTION_API_URL);

  // 4. Default Known Backends
  KNOWN_BACKENDS.forEach((b) => addCandidate(b));

  return pool;
};

// Cached active backend URL in memory
let activeBackendUrl = null;

/**
 * Resolves active API Base URL (recovers verified active backend from sessionStorage)
 */
export const getDynamicApiUrl = () => {
  if (activeBackendUrl) {
    return activeBackendUrl;
  }

  // Try recovering from sessionStorage if previously verified
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const saved = window.sessionStorage.getItem('ojs_active_backend_url');
    if (saved && typeof saved === 'string') {
      activeBackendUrl = normalizeApiUrl(saved);
      return activeBackendUrl;
    }
  }

  const pool = getCandidatePool();
  activeBackendUrl = pool[0] || PRODUCTION_API_URL;
  return activeBackendUrl;
};

export const API_URL = getDynamicApiUrl();
export const getActiveBackendUrl = () => getDynamicApiUrl();

/**
 * Manually switch the active backend endpoint and persist to sessionStorage
 */
export const setActiveBackendUrl = (url) => {
  const normalized = normalizeApiUrl(url);
  if (normalized) {
    activeBackendUrl = normalized;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('ojs_active_backend_url', normalized);
    }
  }
};

/**
 * Performs a lightweight health check on a target backend candidate
 */
export const checkBackendHealth = async (baseUrl, timeoutMs = 2500) => {
  const normalized = normalizeApiUrl(baseUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${normalized}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (e) {
    clearTimeout(timeoutId);
    return false;
  }
};

/**
 * Non-blocking Background Prober: Checks primary backend health on startup.
 * If localhost is down, seamlessly switches active backend to the live working proxy URL immediately!
 */
export const initAutoFailover = () => {
  if (typeof window === 'undefined') return;

  const currentActive = getDynamicApiUrl();
  if (isLocalhostUrl(currentActive)) {
    checkBackendHealth(currentActive, 2000).then((isAlive) => {
      if (!isAlive) {
        console.warn(`[OJS Load Balancer] Localhost is offline. Seamlessly routing to Live Working Backend: ${PRODUCTION_API_URL}`);
        setActiveBackendUrl(PRODUCTION_API_URL);
      }
    });
  }
};

// Trigger background health check on startup and when tab regains focus
if (typeof window !== 'undefined') {
  setTimeout(initAutoFailover, 50);
  window.addEventListener('focus', () => {
    initAutoFailover();
  });
}

/**
 * Standardized fetch wrapper with Automatic Failover & Load Balancing
 * If the active backend (e.g. localhost) fails or is down, it seamlessly
 * and immediately calls the live working production URL (proxy.literaria...)!
 *
 * @param {string} endpoint - API route (e.g., '/users', '/articles', '/health')
 * @param {object} options - Fetch options (method, body, headers, timeout, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
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
  const candidates = getCandidatePool();
  const currentActive = getDynamicApiUrl();

  // Order candidates starting with current active backend, then remaining working candidates
  const orderedCandidates = [
    currentActive,
    ...candidates.filter((c) => c !== currentActive)
  ];

  let lastError = null;

  for (let i = 0; i < orderedCandidates.length; i++) {
    const candidateUrl = orderedCandidates[i];
    const targetFullUrl = `${candidateUrl}${normalizedEndpoint}`;

    // Fast 2.5s timeout for localhost so user is never delayed when local PHP server isn't running
    const defaultTimeout = isLocalhostUrl(candidateUrl) ? 2500 : 12000;
    const requestTimeoutMs = options.timeout || defaultTimeout;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

    const config = {
      ...options,
      headers,
      body,
      signal: controller.signal
    };

    try {
      const response = await fetch(targetFullUrl, config);
      clearTimeout(timer);

      // If server returned 5xx, failover to next candidate in the pool
      if (response.status >= 500 && i < orderedCandidates.length - 1) {
        console.warn(
          `[OJS Load Balancer] Backend at ${candidateUrl} returned ${response.status}. Auto-failing over to: ${orderedCandidates[i + 1]}`
        );
        lastError = new Error(`Server returned HTTP ${response.status} at ${candidateUrl}`);
        continue;
      }

      // Parse JSON response
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

      // If switched backend successfully, save healthy host in memory & sessionStorage
      if (candidateUrl !== activeBackendUrl) {
        console.info(`[OJS Load Balancer] Active backend switched to: ${candidateUrl}`);
        setActiveBackendUrl(candidateUrl);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      clearTimeout(timer);

      // If it's a valid client application error (e.g. 400 bad request, 401 unauthorized, 404 not found):
      if (!isNetworkOrConnectionError(err)) {
        throw err;
      }

      // Network / Connection / Timeout Failure: Failover to next working candidate
      lastError = err;
      if (i < orderedCandidates.length - 1) {
        console.warn(
          `[OJS Load Balancer] Connection to ${candidateUrl} failed (${err.message}). Auto-failing over to: ${orderedCandidates[i + 1]}`
        );
      }
    }
  }

  // If all candidate backends were exhausted
  console.error('[OJS Load Balancer] All candidate backends failed to respond.', lastError);
  throw lastError || new Error('All backend endpoints failed to respond. Please check your network connection.');
};

/**
 * Resolves media / file URLs to point to the active healthy backend host
 * Handles relative backend paths, legacy domains, and URL encoding
 *
 * @param {string} url - The URL string from backend or database
 */
export const resolveFileUrl = (url) => {
  if (!url) return '';
  const currentApi = getDynamicApiUrl();
  const baseUrl = currentApi.replace(/\/api\/?$/, '');
  let finalUrl = url.trim();

  // Strip known backend origins to dynamically bind to the current active working host
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

  // If relative backend path
  if (finalUrl.startsWith('/')) {
    if (/^\/(journals|manuscripts|avatars|s3_img|uploads|storage|api)\//i.test(finalUrl)) {
      finalUrl = `${baseUrl}${finalUrl}`;
    } else {
      finalUrl = finalUrl;
    }
  }

  // Ensure proper encoding for filenames with spaces/parentheses
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
  const candidates = getCandidatePool();
  const currentActive = getDynamicApiUrl();
  const fallbacks = candidates.filter((c) => c !== currentActive);

  if (fallbacks.length > 0) {
    const fallbackBase = fallbacks[0].replace(/\/api\/?$/, '');
    const cleanPath = originalUrl.replace(/^https?:\/\/[^\/]+/, '');
    const newSrc = `${fallbackBase}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
    if (event.target.src !== newSrc) {
      event.target.src = newSrc;
    }
  }
};
