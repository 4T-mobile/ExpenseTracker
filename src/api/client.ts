import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/storage";
import { RefreshTokenRequest, RefreshTokenResponse } from "../types/auth.type";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.2:3000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let onSessionExpired: (() => void) | null = null;

export const setSessionExpiredHandler = (handler: () => void) => {
  onSessionExpired = handler;
};

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip adding token for auth endpoints to avoid stale token issues.
    if (isAuthEndpoint(config.url)) {
      return config;
    }

    const token = await tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Skip token refresh for auth endpoints - they handle 401 differently.
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post<RefreshTokenResponse>(
          `${BASE_URL}/api/v1/auth/refresh`,
          { refreshToken } as RefreshTokenRequest
        );

        await tokenStorage.setToken(data.data.accessToken);
        await tokenStorage.setRefreshToken(data.data.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        }

        onTokenRefreshed(data.data.accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        await tokenStorage.clearTokens();
        onSessionExpired?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export const apiClient = api;
