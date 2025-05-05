import { BusinessTypeOtpEnum } from '@/common/enum';
import config from '@/config';
import api from '@/lib/axios';
import {
  ICallbackLoginGoogle,
  IForgotPassword,
  ILogin,
  ILogout,
  IRegister,
  IVerifyEmail,
  IVerifyOtp,
} from '@/types/common';

export const loginApi = async (payload: { data: ILogin }) => {
  const { data } = payload;
  const result = await api.post('/auth/login', data);
  return result.data;
};

export const registerApi = async (payload: { data: IRegister }) => {
  const { data } = payload;
  const result = await api.post('/auth/register', data);
  return result.data;
};

export const loginWithGoogleApi = async () => {
  const rootUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
  window.location.href = `${rootUrl}${config.routes.protected.google}`;
};

export const callbackLoginGoogleApi = async (payload: { data: ICallbackLoginGoogle }) => {
  const { data } = payload;
  const result = await api.post('/auth/callback/login', data);
  return result.data;
};

export const logoutApi = async (payload: { data: ILogout }) => {
  const { data } = payload;
  const result = await api.post('/auth/logout', data);
  return result.data;
};

export const verifyEmailApi = async (payload: { data: IVerifyEmail }) => {
  const { data } = payload;
  const result = await api.post(`/auth/otp`, data);
  return result.data;
};

export const verifyOtpApi = async (payload: { data: IVerifyOtp }) => {
  const { data } = payload;
  const result = await api.post(
    `/auth/otp/verify?businessType=${BusinessTypeOtpEnum.FORGOT_PASSWORD}`,
    data
  );
  return result.data;
};

export const forgotPasswordApi = async (payload: { data: IForgotPassword; userId: string }) => {
  const { data, userId } = payload;
  const result = await api.put(`/auth/${userId}/forgot_password`, data);
  return result.data;
};

export const verifyOtpRestoreApi = async (payload: { data: IVerifyOtp }) => {
  const { data } = payload;
  const result = await api.post(
    `/auth/otp/verify-restore?businessType=${BusinessTypeOtpEnum.RESTORE}`,
    data
  );
  return result.data;
};
