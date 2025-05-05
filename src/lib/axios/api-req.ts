/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '@/config';
import { DEFAULT_TIME_OUT } from '@/constant';
import axios from 'axios';
import api from '.';

const apiReq = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.NEXT_PUBLIC_DEFAULT_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIME_OUT,
});

apiReq.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiReq.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refresh: refreshToken });
          const { token } = response.data;

          localStorage.setItem('token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiReq(originalRequest);
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.clear();
          window.location.href = `/${config.routes.public.login}`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiReq;
