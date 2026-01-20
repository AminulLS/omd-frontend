import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, BASE_URL } from "@/lib/config/api";
import { handleApiError, type ApiErrorResponse } from "@/lib/helpers/errorHandler";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const authApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as InternalAxiosRequestConfig & {
      skipGlobalErrorHandler?: boolean;
    };

    if (!config?.skipGlobalErrorHandler) {
      handleApiError(error);
    }

    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as InternalAxiosRequestConfig & {
      skipGlobalErrorHandler?: boolean;
    };

    if (!config?.skipGlobalErrorHandler) {
      handleApiError(error);
    }

    return Promise.reject(error);
  }
);

export default api;
