import axios from "axios";

// API Base URLs Configuration
const DEPLOYED = "https://cryptonex-backend.onrender.com"; // Your Render backend URL
const LOCAL_GATEWAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Local API Gateway
const LOCALHOST = "http://localhost:1106"; // Direct backend (Spring Boot)

// Use VITE_API_BASE_URL if provided (allows dynamic config on Vercel), otherwise fall back to production/dev defaults.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "production" ? DEPLOYED : LOCAL_GATEWAY);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Use a request interceptor to ALWAYS read the latest JWT from localStorage.
// This fixes the bug where a stale/empty token was used after fresh login.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Set default Content-Type for POST requests
api.defaults.headers.post["Content-Type"] = "application/json";

export default api;

