import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosInstance } from "axios";
import { handleApiError } from "./errorHandler";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});
//const defaultHeaders = { ...axiosInstance.defaults.headers.common };
// console.log("API BASE URL: ", process.env.REACT_APP_API_BASE_URL);

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const storedToken = sessionStorage.getItem("accessToken");

    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);

        let token: string = '';
        if (typeof parsedToken === 'string') {
          token = parsedToken;
        } else if (parsedToken && typeof parsedToken.token === 'string') {
          token = parsedToken.token;
        }

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
          console.log('Added auth header:', `Bearer ${token.substring(0, 20)}...`); // Debug log
        }
      } catch (error) {
        console.error('Error parsing access token:', error);
        // Clear invalid token
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("loggedUser");
      }
    } else {
      console.log('No access token found in sessionStorage'); // Debug log
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("Bad Request");
          break;
        case 401:
          console.error("Unauthorized - Invalid credentials");
          break;
        case 403:
          console.error("Forbidden - Access denied");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 429:
          console.error("Too Many Requests - Rate limit exceeded");
          break;
        case 500:
          console.error("Server error occurred");
          break;
        default:
          console.error(`Unhandled status code: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("Network Error - No response received");
    } else {
      console.error("Request setup error:", error.message);
    }

    handleApiError(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
