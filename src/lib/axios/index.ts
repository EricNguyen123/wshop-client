import { DEFAULT_TIME_OUT } from '@/constant';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.NEXT_PUBLIC_DEFAULT_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIME_OUT,
});

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage (client-side only)
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token")
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   async (error) => {
//     const originalRequest = error.config

//     // Handle token refresh for 401 errors (optional)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         // Refresh token logic here
//         const refreshToken = localStorage.getItem("refreshToken")
//         if (refreshToken) {
//           const response = await axios.post("/auth/refresh", { refreshToken })
//           const { token } = response.data

//           localStorage.setItem("token", token)

//           // Update the original request with the new token
//           originalRequest.headers.Authorization = `Bearer ${token}`
//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         // Handle refresh token failure (e.g., redirect to login)
//         if (typeof window !== "undefined") {
//           // Clear tokens and redirect to login
//           localStorage.removeItem("token")
//           localStorage.removeItem("refreshToken")
//           window.location.href = "/login"
//         }
//       }
//     }

//     return Promise.reject(error)
//   },
// )

export default api;
