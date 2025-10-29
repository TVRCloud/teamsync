import Cookies from "js-cookie";
import axios, { AxiosError, AxiosInstance } from "axios";
import { config as sessionConfig } from "@/lib/config";

const withAuth = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: "",
    timeout: 60000, // 60 seconds
  });

  instance.interceptors.request.use((config) => {
    const token = Cookies.get(sessionConfig.session.cookieName);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("[API ERROR]", error);
      throw new AxiosError(
        error.response?.data?.message || "API request failed",
        error.code,
        error.config,
        error.request,
        error.response
      );
    }
  );

  return instance;
};

export const apiClient = withAuth();
