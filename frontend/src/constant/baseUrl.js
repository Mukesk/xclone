// Runtime-based URL detection
let baseUrl;

// Function to get the correct base URL
const getBaseUrl = () => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    // If we're on a vercel.app domain, use the current domain
    if (window.location.hostname.includes('vercel.app')) {
      return window.location.origin;
    }
    // For local development
    return 'http://localhost:8080';
  }
  
  // Fallback for SSR/build time
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
};

// Set baseUrl dynamically
baseUrl = getBaseUrl();

export default baseUrl;
