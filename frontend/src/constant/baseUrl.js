// Use environment variable if available, otherwise use current domain
const baseUrl = import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== 'undefined' ? window.location.origin : '');

export default baseUrl;
