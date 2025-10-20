import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { clearTokens } from "@apis/token";
import { getTokens } from "@apis/token";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

function createAxiosClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add token to every request
  instance.interceptors.request.use(async (config) => {
    const tokens = await getTokens();

    if (tokens.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      const status = error.response?.status;

      // Attempt refresh via cookie-based flow once for 401 errors
      if (status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            return instance(originalRequest);
          }
        } catch {
          // fallthrough to logout
        }
        clearTokens();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

async function refreshAccessToken(): Promise<boolean> {
  // Cookie-based refresh: server reads refresh cookie and sets new cookies.
  try {
    await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return true;
  } catch {
    return false;
  }
}

export const apiClient = createAxiosClient();

export type ApiClient = AxiosInstance;
