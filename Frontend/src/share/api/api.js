import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// Interceptor para adjuntar token si existe en sessionStorage (Zustand persistido)
api.interceptors.request.use((config) => {
  try {
    const raw = sessionStorage.getItem("auth-store");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error(error);
  }
  return config;
});
