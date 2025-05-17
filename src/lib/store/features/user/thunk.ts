/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IChangePasswordReq,
  ICreateUserReq,
  IDeleteUserReq,
  IGetDetailUserReq,
  IGetListUsersReq,
  IUpdateUserReq,
  IUploadAvatarReq,
} from '@/types/common';
import { AppDispatch } from '../../store';
import {
  changePasswordSuccess,
  createUserSuccess,
  deleteAvatarSuccess,
  deleteUserSuccess,
  getDetailUserSuccess,
  getListUsersSuccess,
  setStatus,
  updateUserSuccess,
  uploadAvatarSuccess,
} from './slice';
import {
  changePasswordApi,
  createUserApi,
  deleteAvatarApi,
  deleteUserApi,
  getDetailUserApi,
  getListUsersApi,
  updateUserApi,
  uploadAvatarApi,
} from './api';

export const changePasswordAsync =
  (payload: { data: IChangePasswordReq; userId: string }) => async (dispatch: AppDispatch) => {
    const { data, userId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await changePasswordApi({ data: data.value, userId });
      if (response.status === 200) {
        dispatch(changePasswordSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const getDetailUserAsync =
  (payload: { data: IGetDetailUserReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;

    dispatch(setStatus('loading'));
    try {
      const response = await getDetailUserApi({ userId: data.value.userId });

      if (response && response.status === 200) {
        dispatch(getDetailUserSuccess(response));

        if (data.setToastSuccess && response.code) {
          data.setToastSuccess(response.code);
        }
      } else {
        dispatch(setStatus('failed'));
        if (data.setToastError) {
          data.setToastError();
        }
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));

      if (error && data.setToastError) {
        const errorCode = error.response?.data?.code || error.status;
        data.setToastError(errorCode);
      }
    }
  };

export const updateUserAsync =
  (payload: { data: IUpdateUserReq; userId: string }) => async (dispatch: AppDispatch) => {
    const { data, userId } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await updateUserApi({ data: data.value, userId });
      if (response.status === 200) {
        dispatch(updateUserSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const getListUsersAsync =
  (payload: { data: IGetListUsersReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await getListUsersApi({ data: data.value });
      if (response.status === 200) {
        dispatch(getListUsersSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const createUserAsync =
  (payload: { data: ICreateUserReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await createUserApi({ data: data.value });
      if (response.status === 200) {
        dispatch(createUserSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteUserAsync =
  (payload: { data: IDeleteUserReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteUserApi({ userId: data.value.userId });
      if (response.status === 200) {
        dispatch(deleteUserSuccess({ id: data.value.userId }));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const uploadAvatarAsync =
  (payload: { data: IUploadAvatarReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const formData = new FormData();
      formData.append('file', data.value.file);
      formData.append('userId', data.value.userId);
      const response = await uploadAvatarApi({ data: formData });
      if (response.status === 200) {
        dispatch(uploadAvatarSuccess(response));
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };

export const deleteAvatarAsync =
  (payload: { data: IDeleteUserReq }) => async (dispatch: AppDispatch) => {
    const { data } = payload;
    dispatch(setStatus('loading'));
    try {
      const response = await deleteAvatarApi({ userId: data.value.userId });
      if (response.status === 200) {
        dispatch(deleteAvatarSuccess());
        data.setToastSuccess(response.code);
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      if (error) {
        data.setToastError(error.response.data.code || error.status);
      }
    }
  };
