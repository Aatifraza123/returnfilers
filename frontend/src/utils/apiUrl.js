// API URL Helper - Uses environment variable or defaults to localhost
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// Helper function to get full API endpoint
export const getApiEndpoint = (endpoint) => {
  const baseUrl = getApiUrl();
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

export default getApiUrl;


