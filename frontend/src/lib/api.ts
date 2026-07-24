import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";
const TOKEN_KEY = "bridgeup_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  success: false;
  message: string;
}

// Pulls a readable message out of an axios error, falling back to a generic one
export const getErrorMessage = (err: unknown, fallback = "Something went wrong"): string => {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as ApiError | undefined)?.message || err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};
