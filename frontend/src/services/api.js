import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// Optional: Add token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
