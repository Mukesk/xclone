// Runtime-based URL detection
let baseUrl;

// Function to get the correct base URL
const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:8080";
  }
  // Production: Use env var if available (Split deployment), otherwise relative (Monolith)
  return import.meta.env.VITE_BACKEND_URL || "";
};

// Set baseUrl dynamically
baseUrl = getBaseUrl();

export default baseUrl;
