// Use environment variable if available, otherwise use separate backend deployment
const baseUrl = import.meta.env.VITE_BACKEND_URL || 
  'https://backend-deploy-dm8weukmi-mukesks-projects.vercel.app';

export default baseUrl;
