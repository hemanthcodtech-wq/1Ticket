export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Returns full API URL in production, or relative path in dev (proxy)
 * @param {string} endpoint - e.g. '/api/events'
 * @returns {string} - e.g. 'https://1-ticket.vercel.app/api/events' or '/api/events'
 */
export function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Helper to ensure uploaded images point to backend domain if stored as relative /uploads
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return imagePath;
}

export default getApiUrl;
