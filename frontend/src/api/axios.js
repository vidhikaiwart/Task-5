import axios from "axios";
import { store } from "../app/store";
import { logoutUser } from "../features/auth/authThunks";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses with refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = store.getState().auth.refreshToken;
      
      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await axios.post(
            "http://localhost:5000/api/auth/refresh",
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update store with new tokens
          const state = store.getState().auth;
          store.dispatch({
            type: "auth/setCredentials",
            payload: {
              user: state.user,
              token: accessToken,
              refreshToken: newRefreshToken,
            },
          });
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          await store.dispatch(logoutUser());
          if (window.location.pathname !== "/login") {
            window.location.href = "/login?expired=true";
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout user
        await store.dispatch(logoutUser());
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?expired=true";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;