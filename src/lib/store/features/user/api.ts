import apiReq from '@/lib/axios/api-req';
import { IChangePassword, IUpdateUser, IGetListReq, ICreateUser } from '@/types/common';

export const changePasswordApi = async (payload: { data: IChangePassword; userId: string }) => {
  const { data, userId } = payload;
  const result = await apiReq.put(`/auth/${userId}/password`, {
    currentPassword: data.currentPassword,
    password: data.newPassword,
    confirmPassword: data.confirmPassword,
  });
  return result.data;
};

export const getDetailUserApi = async (payload: { userId: string }) => {
  const { userId } = payload;
  const result = await apiReq.get(`/users/${userId}`);
  return result.data;
};

export const updateUserApi = async (payload: { userId: string; data: IUpdateUser }) => {
  const { userId, data } = payload;
  const result = await apiReq.put(`/users/${userId}`, data);
  return result.data;
};

export const getListUsersApi = async (payload: { data: IGetListReq }) => {
  const { data } = payload;
  const result = await apiReq.get(`/users`, { params: data });
  return result.data;
};

export const createUserApi = async (payload: { data: ICreateUser }) => {
  const { data } = payload;
  const result = await apiReq.post(`/users`, data);
  return result.data;
};

export const deleteUserApi = async (payload: { userId: string }) => {
  const { userId } = payload;
  const result = await apiReq.delete(`/users/${userId}`);
  return result.data;
};
