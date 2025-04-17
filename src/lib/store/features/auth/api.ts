import api from '@/lib/axios';
import { ILogin } from '@/types/common';

export const loginApi = async (payload: { data: ILogin }) => {
  const { data } = payload;
  const result = await api.post('/auth/login', data);
  return result;
};
