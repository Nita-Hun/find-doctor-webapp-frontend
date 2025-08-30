import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

function isTokenExpired(token: string) {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true; 
  }
}

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null" && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // remove expired token
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-changed"));
    }
  }
  return config;
});





















