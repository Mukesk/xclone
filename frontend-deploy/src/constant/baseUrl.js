// Use environment variable if available, otherwise use development server
const baseUrl = import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://your-backend-name.onrender.com' 
    : 'http://localhost:8080');

export default baseUrl;
