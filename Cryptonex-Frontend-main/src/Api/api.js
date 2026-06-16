import axios from "axios";

// API Base URLs Configuration
const DEPLOYED = "https://cryptonex-backend.onrender.com"; // Your Render backend URL
const LOCAL_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Local API Gateway
const LOCALHOST = "http://localhost:1106"; // Direct backend (Spring Boot)

// Use API Gateway in development (unified single localhost)
// Use deployed URL in production (if needed)
export const API_BASE_URL =
  import.meta.env.MODE === "production" ? DEPLOYED : LOCAL_GATEWAY;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Retrieve token from local storage if present
const token = localStorage.getItem("jwt");

// Add the Authorization header with Bearer token
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Set default Content-Type for POST requests
api.defaults.headers.post["Content-Type"] = "application/json";

export default api;
