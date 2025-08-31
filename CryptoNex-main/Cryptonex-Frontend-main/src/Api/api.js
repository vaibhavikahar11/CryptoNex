import axios from 'axios';

// Update to use your deployed backend URL
const DEPLOYED = 'https://cryptonex-backend.onrender.com'; // Your Render backend URL
const LOCALHOST = 'http://localhost:1106';

// Use the deployed URL in production
export const API_BASE_URL = DEPLOYED;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Retrieve token from local storage if present
const token = localStorage.getItem('jwt');

// Add the Authorization header with Bearer token
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Set default Content-Type for POST requests
api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;
