// Runtime-based URL detection
let baseUrl;

// Function to get the correct base URL
const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:8080";
  }
  return ""; // Relative path for production
};

// Set baseUrl dynamically
baseUrl = getBaseUrl();

export default baseUrl;
