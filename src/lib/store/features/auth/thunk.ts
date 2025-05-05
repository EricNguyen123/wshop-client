/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICallbackLoginGoogleReq,
  IForgotPasswordReq,
  IGetGoogleReq,
  ILoginReq,
  ILogoutReq,
  IRegisterReq,
  IVerifyEmailReq,
  IVerifyOtpReq,
} from '@/types/common';
import {
  forgotPasswordSuccess,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  setStatus,
  verifyEmailSuccess,
  verifyOtpSuccess,
} from './slice';
import {
  callbackLoginGoogleApi,
  forgotPasswordApi,
  loginApi,
  loginWithGoogleApi,
  logoutApi,
  registerApi,
  verifyEmailApi,
  verifyOtpApi,
  verifyOtpRestoreApi,
} from './api';
import { AppDispatch } from '@/lib/store/store';

export const loginAsync = (payload: { data: ILoginReq }) => async (dispatch: AppDispatch) => {
  const { data } = payload;
  dispatch(setStatus('loading'));
  try {
    const response = await loginApi({ data: data.value });
    if (response.status === 200) {
      dispatch(loginSuccess(response));
      data.setToastSuccess(response.code);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
  } catch (error: any) {
    dispatch(setStatus('failed'));
    if (error) {
      data.setToastError(error.response.data.code || error.status);
    }
  }
};

export const registerAsync = (payload: { data: IRegisterReq }) => async (dispatch: AppDispatch) => {
  const { data } = payload;
  dispatch(setStatus('loading'));
  try {
    const response = await registerApi({ data: data.value });
    if (response.status === 201) {
      dispatch(registerSuccess(response));
      data.setToastSuccess(response.code);
    }
  } catch (error: any) {
    dispatch(setStatus('failed'));
    if (error) {
      data.setToastError(error.response.data.code || error.status);
    }
  }
};

export const loginWithGoogleAsync =
  (payload: { data: IGetGoogleReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    try {
      await loginWithGoogleApi();
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const callbackLoginGoogleAsync =
  (payload: { data: ICallbackLoginGoogleReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await callbackLoginGoogleApi({ data: data.value });
      if (response.status === 200) {
        dispatch(loginSuccess(response));
        data.setToastSuccess(response.code);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const logoutAsync = (payload: { data: ILogoutReq }) => async (dispatch: AppDispatch) => {
  const { data } = payload;
  dispatch(setStatus('loading'));
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await logoutApi({ data: { token } });
      if (response.status === 200) {
        dispatch(logoutSuccess());
        data.setToastSuccess(response.code);
      } else {
        dispatch(setStatus('failed'));
      }
      localStorage.clear();
    } else {
      dispatch(setStatus('failed'));
    }
  } catch (error: any) {
    dispatch(logoutSuccess());
    localStorage.clear();
    if (error) {
      data.setToastError(error.response.data.code || error.status);
    }
  }
};

export const verifyEmailAsync =
  (payload: { data: IVerifyEmailReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await verifyEmailApi({ data: data.value });
      if (response.status === 200) {
        dispatch(verifyEmailSuccess(response));
        data.setToastSuccess(response.code);
      } else {
        dispatch(setStatus('failed'));
        data.setToastError(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const verifyOtpAsync =
  (payload: { data: IVerifyOtpReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await verifyOtpApi({ data: data.value });

      if (response.status === 200) {
        dispatch(verifyOtpSuccess(response));
        data.setToastSuccess(response.code);
      } else {
        dispatch(setStatus('failed'));
        data.setToastError(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const forgotPasswordAsync =
  (payload: { data: IForgotPasswordReq; userId: string }) => async (dispatch: AppDispatch) => {
    const { data, userId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await forgotPasswordApi({ data: data.value, userId });
      if (response.status === 200) {
        dispatch(forgotPasswordSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const verifyOtpRestoreAsync =
  (payload: { data: IVerifyOtpReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await verifyOtpRestoreApi({ data: data.value });

      if (response.status === 200) {
        dispatch(verifyOtpSuccess(response));
        data.setToastSuccess(response.code);
      } else {
        dispatch(setStatus('failed'));
        data.setToastError(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };
