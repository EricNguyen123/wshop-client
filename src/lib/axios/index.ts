import { DEFAULT_TIME_OUT } from '@/constant';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.NEXT_PUBLIC_DEFAULT_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIME_OUT,
});

export default api;
