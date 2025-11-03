import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { clearTokens, getTokens, setTokens } from "@apis/token";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

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
    console.log("🌐 AXIOS REQUEST:", config.url, new Date().toISOString());
    const tokens = await getTokens();

    if (tokens.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      console.log("🌐 AXIOS: Using access token");
    } else {
      console.log("🌐 AXIOS: No access token available");
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log("🌐 AXIOS RESPONSE SUCCESS:", response.config.url);
      return response;
    },
    async (error: AxiosError) => {
      console.log(
        "🌐 AXIOS RESPONSE ERROR:",
        error.config?.url,
        error.response?.status
      );
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      const status = error.response?.status;

      // Attempt refresh via cookie-based flow once for 401 errors
      if (status === 401 && !originalRequest?._retry) {
        console.log("🌐 AXIOS: 401 error, attempting token refresh");
        originalRequest._retry = true;
        try {
          const refreshed = await refreshAccessToken(instance);
          if (refreshed) {
            console.log(
              "🌐 AXIOS: Token refreshed successfully, retrying request"
            );
            return instance(originalRequest);
          }
        } catch {
          console.log("🌐 AXIOS: Token refresh failed");
        }
        // Clear tokens and redirect to login if refresh fails
        console.log("🌐 AXIOS: Clearing tokens and redirecting to login");
        await clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

async function refreshAccessToken(instance: AxiosInstance): Promise<boolean> {
  try {
    // Get refresh token from cookies
    const tokens = await getTokens();
    if (!tokens.refreshToken) {
      return false;
    }

    // Send refresh token in request body
    const response = await instance.post("/auth/refresh", {
      refreshToken: tokens.refreshToken,
    });

    // Update tokens with new tokens from response
    if (response.data?.data?.accessToken && response.data?.data?.refreshToken) {
      await setTokens({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken, // Use NEW refresh token
      });
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export const apiClient = createAxiosClient();

export type ApiClient = AxiosInstance;
